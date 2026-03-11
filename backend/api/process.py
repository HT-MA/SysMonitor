from fastapi import APIRouter, HTTPException
import psutil
from typing import List
from pydantic import BaseModel

router = APIRouter()

PROTECTED_PROCESSES = {
    'System',
    'Idle',
    'csrss.exe',
    'wininit.exe',
    'services.exe',
    'lsass.exe'
}

class ProcessInfo(BaseModel):
    pid: int
    name: str
    cpu: float
    memory: float
    status: str
    protected: bool = False

class ProcessActionRequest(BaseModel):
    pid: int

class ProcessActionResponse(BaseModel):
    success: bool
    message: str

@router.get("/process", response_model=List[ProcessInfo])
async def get_process_info():
    processes = []
    for proc in psutil.process_iter(['pid', 'name', 'cpu_percent', 'memory_percent', 'status']):
        try:
            process_name = proc.info['name']
            processes.append(ProcessInfo(
                pid=proc.info['pid'],
                name=process_name,
                cpu=proc.info['cpu_percent'] or 0,
                memory=proc.info['memory_percent'] or 0,
                status=proc.info['status'],
                protected=process_name in PROTECTED_PROCESSES
            ))
        except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
            pass
    
    processes.sort(key=lambda x: x.cpu, reverse=True)
    return processes[:50]

@router.post("/process/stop", response_model=ProcessActionResponse)
async def stop_process(request: ProcessActionRequest):
    try:
        proc = psutil.Process(request.pid)
        process_name = proc.name()
        
        if process_name in PROTECTED_PROCESSES:
            raise HTTPException(status_code=403, detail=f"Cannot stop protected system process: {process_name}")
        
        proc.terminate()
        return ProcessActionResponse(success=True, message=f"Process {request.pid} ({process_name}) terminated successfully")
    except psutil.NoSuchProcess:
        raise HTTPException(status_code=404, detail=f"Process with PID {request.pid} not found")
    except psutil.AccessDenied:
        raise HTTPException(status_code=403, detail=f"Access denied to process {request.pid}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to stop process: {str(e)}")

@router.post("/process/kill", response_model=ProcessActionResponse)
async def kill_process(request: ProcessActionRequest):
    try:
        proc = psutil.Process(request.pid)
        process_name = proc.name()
        
        if process_name in PROTECTED_PROCESSES:
            raise HTTPException(status_code=403, detail=f"Cannot kill protected system process: {process_name}")
        
        proc.kill()
        return ProcessActionResponse(success=True, message=f"Process {request.pid} ({process_name}) killed successfully")
    except psutil.NoSuchProcess:
        raise HTTPException(status_code=404, detail=f"Process with PID {request.pid} not found")
    except psutil.AccessDenied:
        raise HTTPException(status_code=403, detail=f"Access denied to process {request.pid}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to kill process: {str(e)}")
