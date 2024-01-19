from pymongo import MongoClient
import uuid
from datetime import datetime
import re
from bson.objectid import ObjectId

from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi


uri = "mongodb+srv://localBuild:azZWk6zEmqiQ4068@zikracluster.viuumuy.mongodb.net/?retryWrites=true&w=majority"

# Create a client instance
# client = MongoClient('localhost', 27017)
client = MongoClient(uri, server_api=ServerApi('1'))

# Specify the database name
zikra_db = client['zikra_db']  # Replace with your database name

# Collection of Memories
memories_collection = zikra_db['memories']
#memory_times_collection = zikra_db['memory_times']
memory_geo_collection = zikra_db['memory_geo']
memory_geo_collection.create_index([("memory_geo_index", "2dsphere")])


#Classess

class Memory:
    def __init__(self, 
                title: str, 
                location: str, 
                timestamp, 
                lat: float, 
                lon: float, 
                icon: str,
                id=None, 
                descx: str = None):
        self.id = str(uuid.uuid4()) if id is None else id
        self.title = title
        self.location = location
        self.timestamp = timestamp
        self.lat = self._convert_to_float(lat)
        self.lon = self._convert_to_float(lon)
        self.icon = icon
        self.descx = descx
        
    @staticmethod
    def _convert_to_float(value):
        try:
            return float(value)
        except ValueError:
            raise ValueError(f"Invalid value for a coordinate: {value}")

class Video(Memory):
    def __init__(
            self, 
            title, 
            location, 
            timestamp, 
            lat, 
            lon, 
            link, 
            icon,
            descx):
        super().__init__(
            title=title, 
            location=location, 
            timestamp=timestamp, 
            lat=lat, 
            lon=lon, 
            icon=icon,
            descx=descx)
        self.link = link

class Audio(Memory):
    def __init__(self, title, location, timestamp, lat, lon, link):
        super().__init__(title=title, location=location, timestamp=timestamp, lat=lat, lon=lon)
        self.link = link

class Text(Memory):
    def __init__(self, title, location, timestamp, lat, lon, content):
        super().__init__(title=title, location=location, timestamp=timestamp, lat=lat, lon=lon)
        self.content = content

def mongoSave(memory):
    try: 
        memory_data = {
            'title': memory.title,
            'location': memory.location,
            'timestamp': memory.timestamp,
            'lat': memory.lat,
            'lon': memory.lon,
            'link': memory.link,
            'icon': memory.icon,
            'descx': memory.descx,
            'type': memory.__class__.__name__,
        }

        geo_point = {
            "type": "Point",
            "coordinates": [memory.lon, memory.lat],
            "timestamp": memory.timestamp,
        }

        memories_collection.insert_one(memory_data)

        # Pikaday functions need to know if it is within the window AND if it is within the time
        memory_geo_collection.insert_one(geo_point)
    except Exception as e:
        return(f"An error occurred in mongoSave: {e}")

def mongoLoad(memory_id):
    try:
        # Convert the document_id from string to ObjectId
        memory_id = ObjectId(memory_id)

        # Retrieve the document by its ID
        document = memories_collection.find_one({'_id': memory_id})

        return document

    except Exception as e:
        return(f"An error occurred in mongoLoad: {e}")

def mongoDelete(memory_id):
    try:
        # Convert the document_id from string to ObjectId
        memory_id = ObjectId(memory_id)

        # Delete the document by its ID
        result = memories_collection.delete_one({'_id': memory_id})

        # Check if a document was deleted
        if result.deleted_count > 0:
            print(f"Document with ID {memory_id} was deleted.")
        else:
            print(f"No document found with ID {memory_id}.")

    except Exception as e:
        return(f"An error occurred in mongoDelete: {e}")

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

def mongoGetMemoriesInFrame(ne_lat, ne_long, sw_lat, sw_long):
    top_left = [sw_long, ne_lat]
    top_right = [ne_long, ne_lat]
    bottom_left = [sw_long, sw_lat]
    bottom_right = [ne_long, sw_lat]

    polygon_coordinates = [top_left, top_right, bottom_right, bottom_left, top_left]

    try:
        # Define a GeoJSON polygon
        polygon = {
            "type": "Polygon",
            "coordinates": [polygon_coordinates]
        }

        # Perform a $geoWithin query to find locations within the polygon
        result = memory_geo_collection.find({
            "coordinates": {
                "$geoWithin": {
                    "$geometry": polygon
                }
            }
        })

        # Print the query and the number of documents found
        print("Query:")
        print({
            "coordinates": {
                "$geoWithin": {
                    "$geometry": polygon
                }
            }
        })
        results = []
 
        for document in result:
            time_str = document['timestamp']
            time_str = time_str.split(" ")[0]

            datetime_object = datetime.strptime(time_str, '%Y-%m-%d')
            formattedDate = _getFormattedDate(datetime_object=datetime_object)

            if formattedDate in results:
                pass
            else:
                results.append(formattedDate)
        return (results)
    except Exception as e:
        return(f"An error occurred in mongoGetMemoriesInFrame: {e}")

def mongoGetAllMemories(timestamp):
    results= {}
    try:
        # First attempt: Parse assuming the format is 'YYYY-MM-DDT00:00:00'
        try:
            timestamp = datetime.strptime(timestamp.split('T')[0], '%Y-%m-%d')
        except:
            timestamp = datetime.strptime(timestamp, '%Y-%b-%d')

    except ValueError:
        # Second attempt: Adjust the format to match the timestamp
        # Remove the timezone abbreviation and any additional text
        timestamp = re.sub(r'\sGMT[-+]\d{4}\s\(.*\)$', '', timestamp)
        timestamp = datetime.strptime(timestamp, '%a %b %d %Y %H:%M:%S')
    try: 
        memories = memories_collection.find({'timestamp': timestamp})
        for memory in memories:
            ind_location = memory['location']
            # For shared memories, if two memories have the same location, group them
            if ind_location in results:
                results[ind_location].append(memory) 
            else:
                results[ind_location] = [memory]
    except Exception as e:
        return(f"An error occurred in mongoGetMemoriesInFrame: {e}")
    return results



# Testing 
def generate_fake_video_data():
    title = "Test 3"
    location = "REAS Location"
    timestamp = "2024-01-12"
    lat = 12.3456  # Example latitude
    lon = 98.7654  # Example longitude
    link = "http://example.com/video.mp4"
    icon = "video-icon.png"
    descx = "This is a test video memory."
    return title, location, timestamp, lat, lon, link, icon, descx

def main():
    title, location, timestamp, lat, lon, link, icon, descx = generate_fake_video_data()
    video_memory = Video(title, location, timestamp, lat, lon, link, icon, descx)
    print(f"Created Video Memory: {video_memory.title}, at {video_memory.location}")

    mongoSave(video_memory)
    print("Video memory saved to database.")

if __name__ == "__main__":
    main()

# ne_lat: float = Query(None),
# ne_long: float = Query(None),
# sw_lat: float = Query(None),
# sw_long: float = Query(None),
# center_lat: float = Query(None),
# center_long: float = Query(None),
# timestamp: str = None,
# api_key: str = Depends(get_api_key)