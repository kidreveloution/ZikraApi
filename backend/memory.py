import redis
import json
import uuid

redis_connection = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)

def redisLoad(id):
    memory_data = redis_connection.get(id)  
    if memory_data:
        memory_dict = json.loads(memory_data)
        return (memory_dict)
    return None

def redisSave(memory):
    memory_data = json.dumps(memory.__dict__)
    redis_connection.geoadd(name='memories',values=[memory.lon, memory.lat, memory.id])
    #redis_connection.geoadd('memories', memory.lon, memory.lat, memory.id)
    #redis_connection.set(Memory.id, memory_data) 

class Memory:
    def __init__(self, title, location, timestamp, lat, lon, id=None):
        self.id = str(uuid.uuid4()) if id is None else id
        self.title = title
        self.location = location
        self.timestamp = timestamp
        self.lat = lat
        self.lon = lon

class Video(Memory):
    def __init__(self, title, location, timestamp, link, lat, lon):
        super().__init__(title, location, timestamp, lat, lon)
        self.link = link

class Audio(Memory):
    def __init__(self, title,  location, timestamp, link, lat, lon,):
        super().__init__(title, location, timestamp, lat, lon, )
        self.link = link

class Text(Memory):
    def __init__(self, title, location, timestamp, content, lat, lon, ):
        super().__init__(title, location, timestamp, lat, lon, )
        self.content = content


# Example usage:

if __name__ == "__main__":
    video = Video("Alys Text", "Paris", "2023-07-16T08:00:00Z", "http://example.com/video.mp4", "48.8566","45.2322")
    redisSave(video)
    print(video.id)
    retrieved_video = redisLoad(video.id)
