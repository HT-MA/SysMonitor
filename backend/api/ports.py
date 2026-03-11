from fastapi import APIRouter
import psutil
from typing import List
from pydantic import BaseModel

router = APIRouter()

class PortInfo(BaseModel):
    port: int
    protocol: str
    process: str
    pid: int

@router.get("/ports", response_model=List[PortInfo])
async def get_ports_info():
    ports = []
    connections = psutil.net_connections()
    
    for conn in connections:
        if conn.status == 'LISTEN':
            try:
                port = conn.laddr.port
                protocol = 'TCP' if conn.type == 1 else 'UDP'
                pid = conn.pid
                process_name = ''
                
                if pid:
                    try:
                        proc = psutil.Process(pid)
                        process_name = proc.name()
                    except (psutil.NoSuchProcess, psutil.AccessDenied):
                        process_name = 'unknown'
                
                ports.append(PortInfo(
                    port=port,
                    protocol=protocol,
                    process=process_name,
                    pid=pid or 0
                ))
            except (psutil.NoSuchProcess, psutil.AccessDenied):
                pass
    
    ports.sort(key=lambda x: x.port)
    return ports
