from fastapi import APIRouter
import psutil
from typing import List
from pydantic import BaseModel

router = APIRouter()


class NetworkInfo(BaseModel):
    bytes_sent: int
    bytes_recv: int
    packets_sent: int
    packets_recv: int
    errin: int
    errout: int
    dropin: int
    dropout: int


class NetworkPerInterface(BaseModel):
    interface: str
    bytes_sent: int
    bytes_recv: int
    packets_sent: int
    packets_recv: int
    errin: int
    errout: int
    dropin: int
    dropout: int


@router.get("/network", response_model=NetworkInfo)
async def get_network_info():
    net_io = psutil.net_io_counters()
    return NetworkInfo(
        bytes_sent=net_io.bytes_sent,
        bytes_recv=net_io.bytes_recv,
        packets_sent=net_io.packets_sent,
        packets_recv=net_io.packets_recv,
        errin=net_io.errin,
        errout=net_io.errout,
        dropin=net_io.dropin,
        dropout=net_io.dropout,
    )


@router.get("/network/interfaces", response_model=List[NetworkPerInterface])
async def get_network_interfaces():
    net_io_per_nic = psutil.net_io_counters(pernic=True)
    result = []
    for interface, stats in net_io_per_nic.items():
        result.append(
            NetworkPerInterface(
                interface=interface,
                bytes_sent=stats.bytes_sent,
                bytes_recv=stats.bytes_recv,
                packets_sent=stats.packets_sent,
                packets_recv=stats.packets_recv,
                errin=stats.errin,
                errout=stats.errout,
                dropin=stats.dropin,
                dropout=stats.dropout,
            )
        )
    return result
