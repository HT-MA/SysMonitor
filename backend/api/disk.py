from fastapi import APIRouter
import psutil
import os
from typing import List
from pydantic import BaseModel

router = APIRouter()


class DiskInfo(BaseModel):
    total: int
    used: int
    free: int
    percent: float


class DiskPartition(BaseModel):
    device: str
    mountpoint: str
    fstype: str
    total: int
    used: int
    free: int
    percent: float


def _get_root_path():
    return "C:" if os.name == "nt" else "/"


@router.get("/disk", response_model=DiskInfo)
async def get_disk_info():
    root = _get_root_path()
    usage = psutil.disk_usage(root)
    return DiskInfo(
        total=usage.total, used=usage.used, free=usage.free, percent=usage.percent
    )


@router.get("/disk/partitions", response_model=List[DiskPartition])
async def get_disk_partitions():
    partitions = psutil.disk_partitions()
    result = []
    for partition in partitions:
        try:
            usage = psutil.disk_usage(partition.mountpoint)
            result.append(
                DiskPartition(
                    device=partition.device,
                    mountpoint=partition.mountpoint,
                    fstype=partition.fstype,
                    total=usage.total,
                    used=usage.used,
                    free=usage.free,
                    percent=usage.percent,
                )
            )
        except PermissionError:
            pass
    return result
