from fastapi import APIRouter
import psutil
from pydantic import BaseModel
import time

router = APIRouter()

_memory_cache = {"data": None, "timestamp": 0}
_CACHE_TTL = 1.5


class MemoryInfo(BaseModel):
    total: int
    used: int
    free: int
    percent: float


def _get_memory_info():
    global _memory_cache
    now = time.time()
    if (
        _memory_cache["data"] is not None
        and (now - _memory_cache["timestamp"]) < _CACHE_TTL
    ):
        return _memory_cache["data"]
    mem = psutil.virtual_memory()
    _memory_cache["data"] = MemoryInfo(
        total=mem.total, used=mem.used, free=mem.free, percent=mem.percent
    )
    return _memory_cache["data"]


@router.get("/memory", response_model=MemoryInfo)
async def get_memory_info():
    return _get_memory_info()
