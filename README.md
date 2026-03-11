# SysScope - Local System Monitoring Web Application

A modern local system monitoring dashboard for real-time viewing of computer running status.

## Features

- **Dashboard**: System overview displaying CPU, memory, processes, ports, and other key metrics
- **CPU Monitor**: Real-time CPU usage monitoring with historical line chart
- **Memory Monitor**: Memory usage with pie chart visualization
- **Process Monitor**: Process list with search and sorting support
- **Port Monitor**: Listening port list with filtering support
- **System Info**: Detailed system information

## Tech Stack

### Backend
- Python 3.8+
- FastAPI - Web framework
- psutil - System information retrieval
- uvicorn - ASGI server

### Frontend
- Vue 3 - Frontend framework
- Element Plus - UI component library
- ECharts - Data visualization

## Project Structure

```
local-dashboard/
├── backend/
│   ├── main.py              # FastAPI main application
│   ├── requirements.txt     # Python dependencies
│   └── api/
│       ├── cpu.py          # CPU API
│       ├── memory.py       # Memory API
│       ├── process.py      # Process API
│       ├── ports.py        # Port API
│       └── system.py       # System info API
└── frontend/
    ├── index.html          # HTML entry point
    ├── style.css           # Stylesheet
    ├── app.js              # Vue main application
    ├── api/
    │   └── monitor.js      # API calls
    ├── components/
    │   ├── InfoCard.js     # Info card component
    │   ├── CpuChart.js     # CPU chart component
    │   └── MemoryChart.js  # Memory chart component
    └── views/
        ├── Dashboard.js    # Dashboard view
        ├── Cpu.js          # CPU view
        ├── Memory.js       # Memory view
        ├── Process.js      # Process view
        ├── Ports.js        # Port view
        └── System.js       # System info view
```

## Quick Start

### Option 1: Using uv (Recommended)

#### 1. Install uv
```bash
pip install uv
```

#### 2. Install Dependencies
```bash
cd backend
uv sync
```

#### 3. Start Backend Server
```bash
cd backend
uv run start
```

The backend server will start at `http://127.0.0.1:8000`

### Option 2: Using pip

#### 1. Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt
```

#### 2. Start Backend Server

```bash
python main.py
```

The backend server will start at `http://127.0.0.1:8000`

### 3. Access Application

Open in browser:

```
http://localhost:8000
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/cpu` | GET | Get CPU usage |
| `/api/memory` | GET | Get memory information |
| `/api/process` | GET | Get process list |
| `/api/process/stop` | POST | Stop a process |
| `/api/process/kill` | POST | Kill a process |
| `/api/ports` | GET | Get listening ports |
| `/api/system` | GET | Get system information |

## Feature Details

### Dashboard
Displays overall system status including:
- CPU usage
- Memory usage
- Process count
- Listening port count
- System uptime
- Hardware and system information

### CPU Monitor
- Real-time CPU usage display
- Line chart showing last 60 seconds of historical data
- Displays current value, average, and peak

### Memory Monitor
- Displays total memory, used memory, free memory
- Pie chart visualization of memory usage
- Progress bar showing usage percentage

### Process Monitor
- Displays process list (PID, name, CPU%, memory%, status)
- Search by name or PID
- Sort by any field
- Kill process functionality with confirmation
- Protected system processes cannot be terminated

### Port Monitor
- Displays listening ports (port, protocol, process, PID)
- Search by port or process
- Filter by protocol

### System Info
- Displays operating system information
- Displays hostname
- Displays CPU model and core count
- Displays total memory

## Refresh Mechanism

The frontend automatically refreshes data every 2 seconds to ensure real-time monitoring information.

## Security Policy

The application only listens on `127.0.0.1`, allowing only local access and preventing remote access.

## Performance Requirements

- CPU usage < 2%
- Memory usage < 100MB
- API response time < 100ms

## Browser Compatibility

Supports modern browsers:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## License

MIT License
