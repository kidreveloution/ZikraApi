from typing import Any
from fastapi import FastAPI, File, UploadFile, Form, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from mongo_memory import *
from pydantic import BaseModel
from fastapi import FastAPI, Query
import os
from fastapi.security.api_key import APIKeyHeader
import secrets

API_KEY = "Uy5BoYHf3_qySLbNj5jSe9LX_HyI6BBvAr0OFucM1cc"  # Ideally, this should be an environment variable
API_KEY_NAME = "zikra_main"
api_key_header = APIKeyHeader(name=API_KEY_NAME, auto_error=False)


# app = FastAPI(docs_url=None, redoc_url=None)
app = FastAPI()

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
    descx: str

async def get_api_key(api_key_header: str = Depends(api_key_header)):
    if api_key_header == API_KEY:
        return api_key_header
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid API Key",
        )

@app.get("/")
def root():
    return {"message": "Welcome to Zikra"}

@app.post("/addMemory/")
def read_item(
        item: addEntry,
        api_key: str = Depends(get_api_key)
    ):
    print(item)
    videoMemory = Video(
        title=item.title,
        location=item.location,
        timestamp=item.timestamp,
        lat=item.lat,
        lon=item.lon,
        link=item.link,
        icon=item.icon,
        descx=item.descx,
        )
    print(videoMemory)
    mongoSave(videoMemory)
    #redisSave(videoMemory)
    return {"message": f"Successfully Added {videoMemory.title}"}

@app.post("/uploadMemory/")
async def upload(
        memoryMeta: str = Form(...),
        file: UploadFile = File(...),
        api_key: str = Depends(get_api_key)
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
    
    mongoSave(videoMemory)
    #redisSave(videoMemory)

    return {"message": f"Successfully uploaded {file.filename}"}
    
@app.get("/getMemoryById/")
def get_item(
    itemId: str,
    api_key: str = Depends(get_api_key)
) -> Any:
    try:
        memory = mongoLoad(itemId)
        #memory = redisLoad(itemId)
        return memory
    except:
        return {"message": f"'{itemId}' does not exist"}

@app.get("/getMemories/")
def get_item(ne_lat: float = Query(None),
             ne_long: float = Query(None),
             sw_lat: float = Query(None),
             sw_long: float = Query(None),
             center_lat: float = Query(None),
             center_long: float = Query(None),
             timestamp: str = None,
             api_key: str = Depends(get_api_key)
):
    # Call your getMemories function with the retrieved parameters
    #return(timestamp)
    return mongoGetMemoriesInFrame(ne_lat=ne_lat,ne_long=ne_long,sw_lat=sw_lat,sw_long=sw_long)
    #return getMemories(GeoRectangle(ne_lat, ne_long, sw_lat, sw_long, center_lat, center_long), timestamp)

@app.get("/getAllMemories/")
def get_item(
    timestamp: str = None,
    api_key: str = Depends(get_api_key)
):
    # Call All Memories given timestamp
    return mongoGetAllMemories(timestamp)
    #return getAllMemoriesTimed(timestamp)

@app.post("/deleteMemory/")
def read_item(
        memoryId: str,
        api_key: str = Depends(get_api_key)
    ):
    try:
        memory = mongoLoad(memory_id=memoryId)
        #memory = redisLoad(memoryId)
    except:
        return ("MEMORY DOES NOT EXIST",memoryId)
    
    mongoDelete(memory_id=memoryId)
    #redisDelete(memoryId)

    return ("MEMORY DELETED",memoryId)