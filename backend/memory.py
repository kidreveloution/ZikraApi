import pprint

import redis
import json
import uuid
from datetime import datetime
import math

redis_connection = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)

def redisLoad(id):
    memory_data = redis_connection.get(id)  
    if memory_data:
        memory_dict = json.loads(memory_data)
        return (memory_dict)
    raise AttributeError(f'{id} not found in Database')

def redisSave(memory):
    memory_data = json.dumps({
    'title': memory.title,
    'location': memory.location,
    'timestamp': memory.timestamp,
    'lat': memory.lat,
    'lon': memory.lon,
    'link': memory.link,
    'type': memory.__class__.__name__,
    })
    redis_connection.set(
                        memory.id,
                        memory_data, 
                        )
    redis_connection.geoadd(name='memories',values=[memory.lon, memory.lat, memory.id])
    pass
#Timestamp = YYYY-MM-DD

def _getFormattedDate(datetime_object):
    formatted_str = ""
    weekdaysShort= ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat','Sun']
    monthShort= ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
    dayOfWeek=  weekdaysShort[datetime_object.weekday()]
    month = monthShort[datetime_object.month-1]
    dayNum = datetime_object.day
    year = datetime_object.year
    if dayNum <= 9:
        dayNum = "0"+str(dayNum)
    formatted_str = str(dayOfWeek)+" "+str(month)+" "+str(dayNum)+" "+str(year)
    return(formatted_str)



def getMemories(geo_rectangle,timestamp):
    points = redis_connection.georadius("memories", longitude=geo_rectangle.center_long, latitude=geo_rectangle.center_lat, radius=geo_rectangle.radius, unit='km', withcoord=True)

    #Edge case given the pikaday calls this

    in_rectangle = []
    for point in points:
        lon, lat = point[1]
        if geo_rectangle.sw_long <= lon <= geo_rectangle.ne_long and geo_rectangle.sw_lat <= lat <= geo_rectangle.ne_lat:
            in_rectangle.append(point[0])
    res = []

    if timestamp == None:
        for memory in in_rectangle:
            individual = redisLoad(memory)
            datetime_object = datetime.strptime(individual["timestamp"], '%Y-%m-%d')
            formattedDate = _getFormattedDate(datetime_object=datetime_object)
            if formattedDate in res:
                pass
            else:
                res.append(formattedDate)
        return res
    
    locations= {}
    timestamp = datetime.strptime(timestamp.split('T')[0], '%Y-%m-%d')
    
    for memory in in_rectangle:
        individual = redisLoad(memory)
        ind_timestamp = individual['timestamp']
        ind_location = individual['location']
        memDate = datetime.strptime(ind_timestamp,"%Y-%m-%d")
        print(memDate, timestamp)
        if (memDate == timestamp):
            res.append(individual)
            print("ADDED TIME STAMP",timestamp)

        if ind_location in locations:
            locations[ind_location].append(individual)
        else:
            locations[ind_location] = [individual]
    pp = pprint.PrettyPrinter(indent=4)
    #pp.pprint(locations)
    return (res)        

class GeoRectangle:
    def __init__(self, ne_lat, ne_long, sw_lat, sw_long,center_lat,center_long):
        self.ne_lat = ne_lat
        self.ne_long = ne_long
        self.sw_lat = sw_lat
        self.sw_long = sw_long
        self.center_lat = center_lat
        self.center_long = center_long
        self.radius = self.calculate_radius()

    def get_center(self):
        center_lat = (self.top_left_lat + self.bottom_right_lat) / 2
        center_lon = (self.top_left_lon + self.bottom_right_lon) / 2
        return center_lat, center_lon

    def calculate_radius(self):
        lat_diff = abs(self.ne_lat - self.sw_lat)
        lon_diff = abs(self.ne_long - self.sw_long)
        diagonal = math.sqrt(lat_diff**2 + lon_diff**2)
        return diagonal / 2 * 111  # Conversion to kilometers

class Memory:
    def __init__(self, title: str, location: str, timestamp, lat: float, lon: float, id=None):
        self.id = str(uuid.uuid4()) if id is None else id
        self.title = title
        self.location = location
        self.timestamp = timestamp
        self.lat = self._convert_to_float(lat)
        self.lon = self._convert_to_float(lon)
        
    @staticmethod
    def _convert_to_float(value):
        try:
            return float(value)
        except ValueError:
            raise ValueError(f"Invalid value for a coordinate: {value}")

class Video(Memory):
    def __init__(self, title, location, timestamp, lat, lon, link):
        super().__init__(title=title, location=location, timestamp=timestamp, lat=lat, lon=lon)
        self.link = link

class Audio(Memory):
    def __init__(self, title, location, timestamp, lat, lon, link):
        super().__init__(title=title, location=location, timestamp=timestamp, lat=lat, lon=lon)
        self.link = link

class Text(Memory):
    def __init__(self, title, location, timestamp, lat, lon, content):
        super().__init__(title=title, location=location, timestamp=timestamp, lat=lat, lon=lon)
        self.content = content



# Example usage:
if __name__ == "__main__":
    # video = Video(title= "Alys Text", location= "Paris", timestamp= "2023-07-16T08:00:00Z", link= "http://example.com/video.mp4",lat= "48.8566",lon= "45.2322")
    # redisSave(video)
    # print(video.id)
    # retrieved_video = redisLoad(video.id)
    # print(retrieved_video)
    obj = GeoRectangle(ne_lat=31.821606118113657,ne_long=35.51954600781248,sw_lat=31.130592290762717,sw_long=33.44312999218748,center_lat=31.476099204438185,center_long=34.48133799999998)
    print(getMemories(obj,""))
    # for id in getMemories(obj):
    #     print(redisLoad(id))
