from fastapi import APIRouter, HTTPException
import psutil
from typing import List
from pydantic import BaseModel
import time

router = APIRouter()

PROTECTED_PROCESSES = {
    "System",
    "Idle",
    "csrss.exe",
    "wininit.exe",
    "services.exe",
    "lsass.exe",
    "smss.exe",
    "svchost.exe",
    "dwm.exe",
    "explorer.exe",
    "winlogon.exe",
    "sihost.exe",
    "taskhostw.exe",
    "fontdrvhost.exe",
    "searchui.exe",
    "searchindexer.exe",
    "securityhealthservice.exe",
    "msmpeng.exe",
    "nissrv.exe",
    "spoolsv.exe",
    "python.exe",
    "python3.exe",
    "node.exe",
    "java.exe",
    "javaw.exe",
    "code.exe",
    "devenv.exe",
    "idea64.exe",
    "pycharm64.exe",
    "webstorm64.exe",
    "docker.exe",
    "dockerd.exe",
    "mysql.exe",
    "mysqld.exe",
    "postgres.exe",
    "mongod.exe",
    "redis-server.exe",
}

_process_cache = {"data": None, "timestamp": 0}
_CACHE_TTL = 2.0
_MAX_PROCESSES = 50


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


def _clear_cache():
    global _process_cache
    _process_cache = {"data": None, "timestamp": 0}


def _get_process_list():
    global _process_cache
    now = time.time()
    if (
        _process_cache["data"] is not None
        and (now - _process_cache["timestamp"]) < _CACHE_TTL
    ):
        return _process_cache["data"]

    processes = []
    for proc in psutil.process_iter(
        ["pid", "name", "cpu_percent", "memory_percent", "status"]
    ):
        try:
            process_name = proc.info["name"]
            if process_name is None:
                continue
            processes.append(
                ProcessInfo(
                    pid=proc.info["pid"],
                    name=process_name,
                    cpu=proc.info["cpu_percent"] or 0,
                    memory=proc.info["memory_percent"] or 0,
                    status=proc.info["status"] or "unknown",
                    protected=process_name in PROTECTED_PROCESSES,
                )
            )
        except (
            psutil.NoSuchProcess,
            psutil.AccessDenied,
            psutil.ZombieProcess,
        ):
            pass

    processes.sort(key=lambda x: x.cpu, reverse=True)
    _process_cache["data"] = processes[:_MAX_PROCESSES]
    _process_cache["timestamp"] = now
    return _process_cache["data"]


@router.get("/process", response_model=List[ProcessInfo])
async def get_process_info():
    return _get_process_list()


@router.post("/process/stop", response_model=ProcessActionResponse)
async def stop_process(request: ProcessActionRequest):
    try:
        proc = psutil.Process(request.pid)
        process_name = proc.name()

        if process_name in PROTECTED_PROCESSES:
            raise HTTPException(
                status_code=403,
                detail=f"Cannot stop protected system process: {process_name}",
            )

        proc.terminate()
        _clear_cache()
        return ProcessActionResponse(
            success=True,
            message=f"Process {request.pid} ({process_name}) terminated successfully",
        )
    except psutil.NoSuchProcess:
        raise HTTPException(
            status_code=404, detail=f"Process with PID {request.pid} not found"
        )
    except psutil.AccessDenied:
        raise HTTPException(
            status_code=403, detail=f"Access denied to process {request.pid}"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to stop process: {str(e)}")


@router.post("/process/kill", response_model=ProcessActionResponse)
async def kill_process(request: ProcessActionRequest):
    try:
        proc = psutil.Process(request.pid)
        process_name = proc.name()

        if process_name in PROTECTED_PROCESSES:
            raise HTTPException(
                status_code=403,
                detail=f"Cannot kill protected system process: {process_name}",
            )

        proc.kill()
        _clear_cache()
        return ProcessActionResponse(
            success=True,
            message=f"Process {request.pid} ({process_name}) killed successfully",
        )
    except psutil.NoSuchProcess:
        raise HTTPException(
            status_code=404, detail=f"Process with PID {request.pid} not found"
        )
    except psutil.AccessDenied:
        raise HTTPException(
            status_code=403, detail=f"Access denied to process {request.pid}"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to kill process: {str(e)}")
