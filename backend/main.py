from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import uvicorn
import os

app = FastAPI(title="SysScope API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from api import cpu, memory, process, ports, system, network, disk

app.include_router(cpu.router, prefix="/api", tags=["CPU"])
app.include_router(memory.router, prefix="/api", tags=["Memory"])
app.include_router(process.router, prefix="/api", tags=["Process"])
app.include_router(ports.router, prefix="/api", tags=["Ports"])
app.include_router(system.router, prefix="/api", tags=["System"])
app.include_router(network.router, prefix="/api", tags=["Network"])
app.include_router(disk.router, prefix="/api", tags=["Disk"])

frontend_path = os.path.join(os.path.dirname(__file__), "..", "frontend")
if os.path.exists(frontend_path):
    app.mount("/", StaticFiles(directory=frontend_path, html=True), name="frontend")


@app.get("/")
async def root():
    return {"message": "SysScope API is running"}


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8001)
