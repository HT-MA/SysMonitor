from fastapi import APIRouter
import psutil
import platform
from pydantic import BaseModel

router = APIRouter()

class SystemInfo(BaseModel):
    os: str
    cpu_model: str
    cpu_cores: int
    memory_total: int
    hostname: str

@router.get("/system", response_model=SystemInfo)
async def get_system_info():
    cpu_info = platform.processor() or "Unknown CPU"
    
    try:
        cpu_freq = psutil.cpu_freq()
        if cpu_freq:
            cpu_info = f"{cpu_info} @ {cpu_freq.max:.2f} MHz"
    except:
        pass
    
    return SystemInfo(
        os=f"{platform.system()} {platform.release()}",
        cpu_model=cpu_info,
        cpu_cores=psutil.cpu_count(logical=False) or psutil.cpu_count(),
        memory_total=psutil.virtual_memory().total,
        hostname=platform.node()
    )
