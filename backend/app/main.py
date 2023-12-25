from typing import Any
from fastapi import FastAPI, File, Request, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from memory import *
from pydantic import BaseModel
from fastapi import FastAPI, Query
import os
from mangum import Mangum

app = FastAPI()
handler = Mangum(app)

# CORS configuration
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class addEntry(BaseModel):
    title: str
    location: str
    timestamp: str
    lat: float
    lon: float
    link: str
    icon: str

@app.get("/")
async def root():
    return {"message": "Welcome to Zikra"}

@app.post("/addmemory/")
def read_item(
        item: addEntry
    ):
    videoMemory = Video(
        title=item.title,
        location=item.location,
        timestamp=item.timestamp,
        lat=item.lat,
        lon=item.lon,
        link=item.link,
        icon=item.icon
        )
    redisSave(videoMemory)
    return {"message": f"Successfully Added {videoMemory.title}"}

@app.post("/uploadMemory/")
async def upload(
        memoryMeta: str = Form(...),
        file: UploadFile = File(...)
    ):
    memoryMeta = json.loads(memoryMeta)
    videoMemory = Video(**memoryMeta)
    
    os.makedirs('memories', exist_ok=True)
    file_path = os.path.join('memories', file.filename)
    try:
        with open(file_path, 'wb') as f:
            while contents := file.file.read(1024 * 1024):
                f.write(contents)
    except Exception:
        return {"message": "There was an error uploading the file"}
    finally:
        file.file.close()
    videoMemory.link = file_path
    redisSave(videoMemory)

    return {"message": f"Successfully uploaded {file.filename}"}
    
@app.get("/getMemoryById/{itemId}")
def get_item(itemId: str) -> Any:
    try:
        memory = redisLoad(itemId)
        return memory
    except:
        return {"message": f"'{itemId}' does not exist"}

# "ne_lat": bounds.getNortheast().lat(),
# "ne_long": bounds.getNortheast().lng(),
# "sw_lat": bounds.getSouthwest().lat(),
# "sw_long": bounds.getSouthwest().lng(),
# "center_lat":bounds.getCenter().lat(),
# "center_long":bounds.getCenter().lng(),
# "timestamp": timestamp,
@app.get("/getMemories")
def get_item(ne_lat: float = Query(None),
             ne_long: float = Query(None),
             sw_lat: float = Query(None),
             sw_long: float = Query(None),
             center_lat: float = Query(None),
             center_long: float = Query(None),
             timestamp: str = None):
    # Call your getMemories function with the retrieved parameters
    print(timestamp)
    return getMemories(GeoRectangle(ne_lat, ne_long, sw_lat, sw_long, center_lat, center_long), timestamp)

@app.get("/getAllMemories")
def get_item(timestamp: str = None):
    # Call All Memories given timestamp
    return getAllMemoriesTimed(timestamp)
