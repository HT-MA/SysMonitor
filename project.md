
---

# SysScope 本机系统监控 Web 应用

**需求实现文档（PRD + 技术方案）**

---

# 一、项目概述

## 1.1 项目名称

**SysScope**

含义：

```
System + Scope
系统监控视图
```

---

## 1.2 项目目标

开发一个 **本地运行的系统监控 Web 应用**，用于实时查看当前计算机的运行状态。

用户只需要在浏览器访问：

```
http://localhost:8000
```

即可查看系统信息。

系统主要用于：

* 本地系统状态监控
* 开发者环境监控
* 轻量级服务器监控
* 系统学习实验

---

## 1.3 设计目标

系统需要具备：

| 特性   | 说明      |
| ---- | ------- |
| 实时监控 | 每2秒刷新数据 |
| 可视化  | 图表展示    |
| 轻量级  | 低资源占用   |
| 本地运行 | 不依赖云服务  |
| 可扩展  | 可增加监控模块 |

---

# 二、系统架构设计

系统采用 **前后端分离架构**。

架构图：

```
┌───────────────────────┐
│       Browser         │
│                       │
│ Vue Dashboard UI     │
└───────────▲───────────┘
            │ REST API
            │
┌───────────┴───────────┐
│      Backend API      │
│                       │
│ Python FastAPI        │
│                       │
│ System Monitor Logic  │
└───────────▲───────────┘
            │
            │
┌───────────┴───────────┐
│      Operating System │
│                       │
│ CPU Memory Process    │
│ Ports Network         │
└───────────────────────┘
```

---

# 三、技术选型

## 3.1 后端技术

推荐使用：

```
Python + FastAPI
```

原因：

* 性能高
* 开发简单
* 文档自动生成
* AI生成代码效果好

使用库：

| 库        | 用途         |
| -------- | ---------- |
| psutil   | 系统信息获取     |
| fastapi  | Web API    |
| uvicorn  | Web server |
| pydantic | 数据模型       |

---

## 3.2 前端技术

推荐：

```
Vue3
```

UI框架：

```
Element Plus
```

图表库：

Apache ECharts

功能：

* 实时图表
* 数据可视化
* Dashboard展示

---

# 四、核心功能模块

系统主要包含 **6个模块**。

| 模块              | 功能    |
| --------------- | ----- |
| Dashboard       | 系统概览  |
| CPU Monitor     | CPU监控 |
| Memory Monitor  | 内存监控  |
| Process Monitor | 进程监控  |
| Port Monitor    | 端口监控  |
| System Info     | 系统信息  |

---

# 五、Dashboard 系统概览

## 5.1 功能

展示系统整体状态。

包括：

| 指标      | 描述       |
| ------- | -------- |
| CPU 使用率 | 当前CPU百分比 |
| 内存使用率   | 当前内存百分比  |
| 进程数量    | 当前运行进程   |
| 监听端口    | 当前端口数量   |
| 系统运行时间  | uptime   |

---

## 5.2 UI设计

Dashboard 使用 **卡片布局**。

示例：

```
--------------------------------
 CPU        Memory        Process
 23%         45%           128
--------------------------------
 Ports        Uptime
 15           2 days
--------------------------------
```

每个卡片显示：

* 指标名称
* 当前数值
* 小图表

---

# 六、CPU 监控模块

## 6.1 功能

实时显示 CPU 使用率。

---

## 6.2 数据结构

字段：

| 字段          | 类型    |
| ----------- | ----- |
| cpu_percent | float |

示例：

```json
{
 "cpu_percent": 23.5
}
```

---

## 6.3 UI展示

使用 **实时折线图**。

展示：

```
过去60秒 CPU使用率
```

刷新频率：

```
2秒
```

---

# 七、内存监控模块

## 7.1 功能

显示系统内存使用情况。

---

## 7.2 数据字段

| 字段      | 描述  |
| ------- | --- |
| total   | 总内存 |
| used    | 已用  |
| free    | 空闲  |
| percent | 使用率 |

---

示例：

```json
{
 "total": 17179869184,
 "used": 7340032000,
 "free": 9839837184,
 "percent": 42
}
```

---

## 7.3 UI展示

显示：

```
Memory Usage

[███████████-------]

Used: 7.3GB
Total: 16GB
```

并附带实时图表。

---

# 八、进程监控模块

## 8.1 功能

显示当前运行进程列表。

---

## 8.2 字段

| 字段     | 描述     |
| ------ | ------ |
| pid    | 进程ID   |
| name   | 进程名称   |
| cpu    | CPU使用率 |
| memory | 内存使用率  |
| status | 状态     |

---

示例：

```json
[
 {
  "pid": 1234,
  "name": "chrome.exe",
  "cpu": 5.3,
  "memory": 3.2,
  "status": "running"
 }
]
```

---

## 8.3 UI设计

表格展示：

```
PID     NAME        CPU%    MEM%
--------------------------------
1234    chrome      5.2     3.1
2231    code        2.0     1.5
```

功能：

* 支持排序
* 支持分页

---

# 九、端口监控模块

## 9.1 功能

显示系统监听端口。

---

## 9.2 字段

| 字段       | 描述        |
| -------- | --------- |
| port     | 端口        |
| protocol | TCP / UDP |
| process  | 进程名称      |
| pid      | 进程ID      |

---

示例：

```json
[
 {
  "port": 3306,
  "protocol": "TCP",
  "process": "mysqld",
  "pid": 1234
 }
]
```

---

## 9.3 UI设计

```
PORT    PROTOCOL    PROCESS
----------------------------
3306    TCP         mysqld
6379    TCP         redis
8080    TCP         node
```

---

# 十、系统信息模块

显示：

| 信息     | 示例               |
| ------ | ---------------- |
| 操作系统   | Windows 11       |
| CPU型号  | Intel Core Ultra |
| CPU核心数 | 20               |
| 总内存    | 16GB             |
| 主机名    | desktop          |

---

API示例：

```json
{
 "os": "Windows 11",
 "cpu_model": "Intel Core Ultra 7",
 "cpu_cores": 20,
 "memory_total": 17179869184,
 "hostname": "desktop"
}
```

---

# 十一、API 设计

统一前缀：

```
/api
```

---

## API列表

| API          | 功能     |
| ------------ | ------ |
| /api/cpu     | CPU使用率 |
| /api/memory  | 内存     |
| /api/process | 进程     |
| /api/ports   | 端口     |
| /api/system  | 系统信息   |

---

示例：

```
GET /api/cpu
GET /api/memory
GET /api/process
GET /api/ports
GET /api/system
```

---

# 十二、项目目录结构

推荐结构：

```
sysscope/

backend
│
├── main.py
├── api
│   ├── cpu.py
│   ├── memory.py
│   ├── process.py
│   ├── ports.py
│   └── system.py
│
├── services
│   └── monitor.py
│
└── requirements.txt


frontend
│
├── src
│   ├── views
│   │   ├── Dashboard.vue
│   │   ├── Process.vue
│   │   └── Ports.vue
│   │
│   ├── components
│   │   ├── CpuChart.vue
│   │   ├── MemoryChart.vue
│   │   └── InfoCard.vue
│   │
│   └── api
│       └── monitor.js
│
└── index.html
```

---

# 十三、刷新机制

前端每 **2秒请求一次 API**。

示例：

```javascript
setInterval(fetchData,2000)
```

未来可升级：

```
WebSocket 实时推送
```

---

# 十四、安全策略

限制访问：

```
只允许 localhost
```

防止远程访问。

---

# 十五、性能要求

| 指标    | 要求      |
| ----- | ------- |
| CPU占用 | < 2%    |
| 内存占用  | < 100MB |
| API响应 | < 100ms |

---

# 十六、扩展功能（未来）

可增加：

### 网络流量监控

```
上传速度
下载速度
```

---

### 进程管理

```
终止进程
```

---

### Docker监控

```
容器CPU
容器内存
```

---

# 十七、交付目标

最终交付一个：

```
本地系统监控 Dashboard
```

功能：

* CPU实时监控
* 内存监控
* 进程管理
* 端口查看
* 系统信息

