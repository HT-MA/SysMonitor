from fastapi import APIRouter
import psutil
from pydantic import BaseModel

router = APIRouter()

class MemoryInfo(BaseModel):
    total: int
    used: int
    free: int
    percent: float

@router.get("/memory", response_model=MemoryInfo)
async def get_memory_info():
    mem = psutil.virtual_memory()
    return MemoryInfo(
        total=mem.total,
        used=mem.used,
        free=mem.free,
        percent=mem.percent
    )
