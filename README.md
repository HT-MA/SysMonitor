# SysScope - 本地系统监控 Web 应用

一个现代化的本地系统监控 Dashboard，用于实时查看计算机的运行状态。

## 功能特性

- **Dashboard**: 系统概览，显示 CPU、内存、进程、端口等关键指标
- **CPU Monitor**: 实时 CPU 使用率监控，带历史折线图
- **Memory Monitor**: 内存使用情况，包含饼图可视化
- **Process Monitor**: 进程列表，支持搜索和排序
- **Port Monitor**: 监听端口列表，支持过滤
- **System Info**: 系统详细信息

## 技术栈

### 后端
- Python 3.8+
- FastAPI - Web 框架
- psutil - 系统信息获取
- uvicorn - ASGI 服务器

### 前端
- Vue 3 - 前端框架
- Element Plus - UI 组件库
- ECharts - 数据可视化

## 项目结构

```
local-dashboard/
├── backend/
│   ├── main.py              # FastAPI 主应用
│   ├── requirements.txt     # Python 依赖
│   └── api/
│       ├── cpu.py          # CPU API
│       ├── memory.py       # 内存 API
│       ├── process.py      # 进程 API
│       ├── ports.py        # 端口 API
│       └── system.py       # 系统信息 API
└── frontend/
    ├── index.html          # HTML 入口
    ├── style.css           # 样式文件
    ├── app.js              # Vue 主应用
    ├── api/
    │   └── monitor.js      # API 调用
    ├── components/
    │   ├── InfoCard.js     # 信息卡片组件
    │   ├── CpuChart.js     # CPU 图表组件
    │   └── MemoryChart.js  # 内存图表组件
    └── views/
        ├── Dashboard.js    # Dashboard 视图
        ├── Cpu.js          # CPU 视图
        ├── Memory.js       # 内存视图
        ├── Process.js      # 进程视图
        ├── Ports.js        # 端口视图
        └── System.js       # 系统信息视图
```

## 快速开始

### 1. 安装 Python 依赖

```bash
cd backend
pip install -r requirements.txt
```

### 2. 启动后端服务

```bash
python main.py
```

后端服务将在 `http://127.0.0.1:8000` 启动

### 3. 访问应用

在浏览器中打开：

```
http://localhost:8000
```

## API 接口

| 接口 | 方法 | 描述 |
|------|------|------|
| `/api/cpu` | GET | 获取 CPU 使用率 |
| `/api/memory` | GET | 获取内存信息 |
| `/api/process` | GET | 获取进程列表 |
| `/api/ports` | GET | 获取监听端口 |
| `/api/system` | GET | 获取系统信息 |

## 功能说明

### Dashboard
显示系统整体状态，包括：
- CPU 使用率
- 内存使用率
- 进程数量
- 监听端口数量
- 系统运行时间

### CPU Monitor
- 实时显示 CPU 使用率
- 折线图展示过去 60 秒的历史数据
- 显示当前值、平均值和峰值

### Memory Monitor
- 显示总内存、已用内存、空闲内存
- 饼图可视化内存使用情况
- 进度条显示使用百分比

### Process Monitor
- 显示进程列表（PID、名称、CPU%、内存%、状态）
- 支持按名称或 PID 搜索
- 支持按各字段排序

### Port Monitor
- 显示监听端口（端口、协议、进程、PID）
- 支持按端口或进程搜索
- 支持按协议过滤

### System Info
- 显示操作系统信息
- 显示主机名
- 显示 CPU 型号和核心数
- 显示总内存

## 刷新机制

前端每 2 秒自动刷新一次数据，确保监控信息的实时性。

## 安全策略

应用默认只监听 `127.0.0.1`，仅允许本地访问，防止远程访问。

## 性能要求

- CPU 占用 < 2%
- 内存占用 < 100MB
- API 响应时间 < 100ms

## 浏览器兼容性

支持现代浏览器：
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## 许可证

MIT License
