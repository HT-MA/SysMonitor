from fastapi import APIRouter
import psutil
from pydantic import BaseModel
import time

router = APIRouter()

_cpu_cache = {"data": None, "timestamp": 0}
_CACHE_TTL = 1.0


class CPUInfo(BaseModel):
    cpu_percent: float


def _get_cpu_info():
    global _cpu_cache
    now = time.time()
    if _cpu_cache["data"] is not None and (now - _cpu_cache["timestamp"]) < _CACHE_TTL:
        return _cpu_cache["data"]
    cpu_percent = psutil.cpu_percent(interval=0.1)
    _cpu_cache = {"data": CPUInfo(cpu_percent=cpu_percent), "timestamp": now}
    return _cpu_cache["data"]


@router.get("/cpu", response_model=CPUInfo)
async def get_cpu_info():
    return _get_cpu_info()
