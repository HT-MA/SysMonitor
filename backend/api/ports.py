from fastapi import APIRouter
import psutil
from typing import List
from pydantic import BaseModel
import time

router = APIRouter()

_ports_cache = {"data": None, "timestamp": 0}
_CACHE_TTL = 3.0


class PortInfo(BaseModel):
    port: int
    protocol: str
    process: str
    pid: int


def _get_ports_info():
    global _ports_cache
    now = time.time()
    if (
        _ports_cache["data"] is not None
        and (now - _ports_cache["timestamp"]) < _CACHE_TTL
    ):
        return _ports_cache["data"]

    ports = []
    seen_ports = set()
    connections = psutil.net_connections()

    for conn in connections:
        if conn.status == "LISTEN":
            try:
                if conn.laddr is None or not hasattr(conn.laddr, "port"):
                    continue
                port = conn.laddr.port
                if port in seen_ports:
                    continue
                seen_ports.add(port)

                protocol = "TCP" if conn.type == 1 else "UDP"
                pid = conn.pid
                process_name = ""

                if pid:
                    try:
                        proc = psutil.Process(pid)
                        process_name = proc.name()
                    except (psutil.NoSuchProcess, psutil.AccessDenied):
                        process_name = "unknown"

                ports.append(
                    PortInfo(
                        port=port, protocol=protocol, process=process_name, pid=pid or 0
                    )
                )
            except (psutil.NoSuchProcess, psutil.AccessDenied, AttributeError):
                pass

    ports.sort(key=lambda x: x.port)
    _ports_cache["data"] = ports
    _ports_cache["timestamp"] = now
    return ports


@router.get("/ports", response_model=List[PortInfo])
async def get_ports_info():
    return _get_ports_info()
