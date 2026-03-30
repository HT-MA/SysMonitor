import { create } from "zustand";

const PROCESS_NAMES = [
  "chrome.exe", "code.exe", "node.exe", "python.exe", "explorer.exe",
  "svchost.exe", "dwm.exe", "SearchHost.exe", "RuntimeBroker.exe",
  "ShellExperienceHost.exe", "Taskmgr.exe", "WindowsTerminal.exe",
  "firefox.exe", "slack.exe", "discord.exe", "steam.exe", "spotify.exe",
  "vscode.exe", "git.exe", "docker.exe", "postgres.exe", "redis-server.exe",
  "nginx.exe", "java.exe", "dotnet.exe", "msedge.exe", "OneDrive.exe",
  "Teams.exe", "Outlook.exe", "PowerShell.exe", "cmd.exe", "conhost.exe",
  "sihost.exe", "taskhostw.exe", "fontdrvhost.exe", "ctfmon.exe",
  "SecurityHealthService.exe", "MsMpEng.exe", "NisSrv.exe",
  "AudioSrv.dll", "WUDFHost.exe", "dllhost.exe", "spoolsv.exe",
  "winlogon.exe", "csrss.exe", "lsass.exe", "services.exe", "wininit.exe",
  "System", "smss.exe",
];

const STATUSES = ["running", "running", "running", "running", "running", "sleeping", "stopped"];

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function randInt(min, max) {
  return Math.floor(rand(min, max));
}

function generateProcessHistory(count = 30) {
  const history = [];
  let cpu = rand(0, 25);
  let memory = rand(0.1, 15);
  for (let i = count; i > 0; i--) {
    cpu = parseFloat(Math.max(0, Math.min(100, cpu + rand(-5, 5))).toFixed(1));
    memory = parseFloat(Math.max(0.1, Math.min(30, memory + rand(-1, 1))).toFixed(1));
    history.push({ cpu, memory, timestamp: Date.now() - i * 2000 });
  }
  return history;
}

function generateProcess(id) {
  const name = PROCESS_NAMES[id % PROCESS_NAMES.length];
  const cpu = rand(0, 30);
  const memory = rand(0.1, 15);
  return {
    pid: 1000 + id,
    name,
    cpu: parseFloat(cpu.toFixed(1)),
    memory: parseFloat(memory.toFixed(1)),
    status: STATUSES[randInt(0, STATUSES.length)],
    threads: randInt(1, 64),
    uptime: randInt(0, 86400),
    history: generateProcessHistory(30),
  };
}

function generateProcesses(count = 80) {
  return Array.from({ length: count }, (_, i) => generateProcess(i));
}

const API_BASE = "http://localhost:8001/api";

function bytesToGB(bytes) {
  return parseFloat((bytes / (1024 * 1024 * 1024)).toFixed(1));
}

async function fetchDiskPartitions() {
  try {
    const res = await fetch(`${API_BASE}/disk/partitions`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.map((p) => ({
      mount: p.mountpoint,
      label: p.mountpoint,
      total: bytesToGB(p.total),
      used: bytesToGB(p.used),
      free: bytesToGB(p.free),
      usage: parseFloat(p.percent.toFixed(1)),
      type: p.fstype || "Unknown",
      history: [],
    }));
  } catch {
    return null;
  }
}

function updateDiskPartitionsFromApi(prev, newData) {
  if (!newData) return prev;
  return newData.map((d) => {
    const existing = prev.find((p) => p.mount === d.mount);
    return {
      ...d,
      history: [
        ...(existing?.history?.slice(-29) || []),
        { usage: d.usage, timestamp: Date.now() },
      ],
    };
  });
}

function generateDiskPartitions() {
  const drives = [
    { mount: "C:", label: "System", total: 512, used: 234, type: "SSD (NVMe)" },
    { mount: "D:", label: "Data", total: 1024, used: 456, type: "SSD (NVMe)" },
  ];
  return drives.map((d) => {
    const pct = parseFloat(((d.used / d.total) * 100).toFixed(1));
    const history = [];
    let prev = pct;
    for (let i = 30; i > 0; i--) {
      prev = parseFloat(Math.max(5, Math.min(100, prev + rand(-0.5, 0.5))).toFixed(1));
      history.push({ usage: prev, timestamp: Date.now() - i * 2000 });
    }
    return { ...d, usage: pct, history };
  });
}

function generateHistoryPoint(prev) {
  return {
    cpu: parseFloat(Math.max(0, Math.min(100, (prev?.cpu ?? 35) + rand(-8, 8))).toFixed(1)),
    memory: parseFloat(Math.max(20, Math.min(95, (prev?.memory ?? 55) + rand(-3, 3))).toFixed(1)),
    networkUp: parseFloat(Math.max(0, (prev?.networkUp ?? 2.5) + rand(-1.5, 2.0)).toFixed(1)),
    networkDown: parseFloat(Math.max(0, (prev?.networkDown ?? 12) + rand(-5, 6)).toFixed(1)),
    timestamp: Date.now(),
  };
}

function generateInitialHistory(count = 30) {
  const history = [];
  let prev = { cpu: 35, memory: 55, networkUp: 2.5, networkDown: 12 };
  for (let i = count; i > 0; i--) {
    prev = generateHistoryPoint(prev);
    history.push({ ...prev, timestamp: Date.now() - i * 2000 });
  }
  return history;
}

function updateProcesses(prev) {
  return prev.map((p) => {
    let cpuDelta = rand(-3, 3);
    let memDelta = rand(-0.5, 0.5);

    if (Math.random() < 0.03) {
      cpuDelta = rand(15, 50);
    }

    const newCpu = parseFloat(Math.max(0, p.cpu + cpuDelta).toFixed(1));
    const newMem = parseFloat(Math.max(0.1, p.memory + memDelta).toFixed(1));
    const newHistory = [
      ...p.history.slice(-29),
      { cpu: newCpu, memory: newMem, timestamp: Date.now() },
    ];

    return {
      ...p,
      cpu: newCpu,
      memory: newMem,
      status: Math.random() > 0.05 ? p.status : STATUSES[randInt(0, STATUSES.length)],
      history: newHistory,
    };
  });
}

const useSystemStore = create((set, get) => ({
  cpu: 35,
  memory: 55,
  memoryUsed: 8.8,
  memoryTotal: 16,
  diskPartitions: generateDiskPartitions(),
  networkUp: 2.5,
  networkDown: 12,
  processes: generateProcesses(80),
  history: generateInitialHistory(30),
  activeTab: "overview",
  searchQuery: "",
  sortField: "cpu",
  sortDirection: "desc",
  currentPage: 1,
  pageSize: 20,
  selectedProcess: null,
  killConfirmOpen: false,
  processDetailOpen: false,
  processFilter: "all",
  selectedPids: new Set(),
  bulkKillOpen: false,
  isKilling: false,
  notifications: [],

  setActiveTab: (tab) => set({ activeTab: tab, currentPage: 1 }),
  setSearchQuery: (q) => set({ searchQuery: q, currentPage: 1 }),
  setSortField: (field) =>
    set((s) => ({
      sortField: field,
      sortDirection: s.sortField === field && s.sortDirection === "desc" ? "asc" : "desc",
    })),
  setCurrentPage: (p) => set({ currentPage: p }),
  setSelectedProcess: (p) => set({ selectedProcess: p }),
  setKillConfirmOpen: (o) => set({ killConfirmOpen: o }),
  setProcessDetailOpen: (o) => set({ processDetailOpen: o }),
  setProcessFilter: (f) => set({ processFilter: f, currentPage: 1 }),

  toggleSelectPid: (pid) =>
    set((s) => {
      const next = new Set(s.selectedPids);
      if (next.has(pid)) next.delete(pid);
      else next.add(pid);
      return { selectedPids: next };
    }),

  selectAllPids: (pids) => set({ selectedPids: new Set(pids) }),
  clearSelection: () => set({ selectedPids: new Set() }),

  setBulkKillOpen: (o) => set({ bulkKillOpen: o }),

  killProcess: (pid) => {
    set({ isKilling: true });
    setTimeout(() => {
      set((s) => {
        const proc = s.processes.find((p) => p.pid === pid);
        const notif = {
          id: Date.now(),
          type: "success",
          message: `Process ${proc?.name || pid} (PID: ${pid}) has been terminated.`,
        };
        const nextSelected = new Set(s.selectedPids);
        nextSelected.delete(pid);
        return {
          processes: s.processes.filter((p) => p.pid !== pid),
          killConfirmOpen: false,
          selectedProcess: null,
          isKilling: false,
          selectedPids: nextSelected,
          notifications: [...s.notifications, notif],
        };
      });
    }, 600);
  },

  bulkKill: () => {
    const { selectedPids, processes } = get();
    if (selectedPids.size === 0) return;
    set({ isKilling: true });
    setTimeout(() => {
      set((s) => {
        const killed = s.selectedPids;
        const count = killed.size;
        const notif = {
          id: Date.now(),
          type: "success",
          message: `${count} process${count > 1 ? "es" : ""} have been terminated.`,
        };
        return {
          processes: s.processes.filter((p) => !killed.has(p.pid)),
          bulkKillOpen: false,
          isKilling: false,
          selectedPids: new Set(),
          notifications: [...s.notifications, notif],
        };
      });
    }, 800);
  },

  dismissNotification: (id) =>
    set((s) => ({ notifications: s.notifications.filter((n) => n.id !== id) })),

  tick: () => {
    const state = get();
    const lastHistory = state.history[state.history.length - 1];
    const newPoint = generateHistoryPoint(lastHistory);

    fetchDiskPartitions().then((diskData) => {
      set((s) => ({
        diskPartitions: updateDiskPartitionsFromApi(s.diskPartitions, diskData),
      }));
    });

    set({
      cpu: newPoint.cpu,
      memory: newPoint.memory,
      memoryUsed: parseFloat(((newPoint.memory / 100) * 16).toFixed(1)),
      networkUp: newPoint.networkUp,
      networkDown: newPoint.networkDown,
      processes: updateProcesses(state.processes),
      history: [...state.history.slice(-59), { ...newPoint, timestamp: Date.now() }],
    });
  },
}));

fetchDiskPartitions().then((data) => {
  if (data) {
    useSystemStore.setState({ diskPartitions: data });
  }
});

export default useSystemStore;
