from fastapi import APIRouter
import psutil
from pydantic import BaseModel

router = APIRouter()

class CPUInfo(BaseModel):
    cpu_percent: float

@router.get("/cpu", response_model=CPUInfo)
async def get_cpu_info():
    cpu_percent = psutil.cpu_percent(interval=0.1)
    return CPUInfo(cpu_percent=cpu_percent)
