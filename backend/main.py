from typing import Any
from fastapi import FastAPI, File, Request, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from memory import *
from pydantic import BaseModel
import aiofiles
import shutil
import os
app = FastAPI()

origins = [
    "http://192.168.50.189:8080",
    "http://127.0.0.1:8080",
    "https://ahlan-salati.surge.sh/",
    "https://ahlan-salati.surge.sh",
    "http://localhost:3000",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

class addEntry(BaseModel):
    title: str
    location: str 
    timestamp: str
    coordinates: str
    link: str

@app.post("/addmemory/")
def read_item(
        item: addEntry
    ):
    videoMemory = Video(title=item.title,location=item.location,timestamp=item.timestamp,lat=item.lat,lon = item.lon,link=item.link)
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
    memory = redisLoad(itemId)
    return memory