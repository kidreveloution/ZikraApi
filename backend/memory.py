import redis
import json
import uuid
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

def getMemories(geo_rectangle):
    points = redis_connection.georadius("memories", geo_rectangle.center_lon, geo_rectangle.center_lat, geo_rectangle.radius, unit='km', withcoord=True)

    in_rectangle = []
    for point in points:
        lon, lat = point[1]
        if geo_rectangle.top_left_lon <= lon <= geo_rectangle.bottom_right_lon and \
           geo_rectangle.bottom_right_lat <= lat <= geo_rectangle.top_left_lat:
            in_rectangle.append(point[0])
            

    return in_rectangle

class GeoRectangle:
    def __init__(self, top_left_lat, top_left_lon, bottom_right_lat, bottom_right_lon):
        self.top_left_lat = top_left_lat
        self.top_left_lon = top_left_lon
        self.bottom_right_lat = bottom_right_lat
        self.bottom_right_lon = bottom_right_lon
        self.center_lat, self.center_lon = self.get_center()
        self.radius = self.calculate_radius()

    def get_center(self):
        center_lat = (self.top_left_lat + self.bottom_right_lat) / 2
        center_lon = (self.top_left_lon + self.bottom_right_lon) / 2
        return center_lat, center_lon

    def calculate_radius(self):
        lat_diff = abs(self.top_left_lat - self.bottom_right_lat)
        lon_diff = abs(self.top_left_lon - self.bottom_right_lon)
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
    obj = GeoRectangle(49.141067,44.491879,48.590697,46.08455)
    print(obj.get_center())
    print(getMemories(obj))
    for id in getMemories(obj):
        print(redisLoad(id))
