import { useEffect } from "react";
import { ThemeProvider } from "@/components/ThemeProvider";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import NotificationStack from "@/components/NotificationStack";
import MetricCards from "@/components/dashboard/MetricCards";
import TopProcesses from "@/components/dashboard/TopProcesses";
import ProcessTable from "@/components/process/ProcessTable";
import ChartsSection from "@/components/charts/ChartsSection";
import useSystemStore from "@/store/systemStore";
import {
  Cpu,
  MemoryStick,
  HardDrive,
  Network,
  Activity,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

function DetailView({ title, icon: Icon, value, unit, color, dataKey, sub }) {
  const history = useSystemStore((s) => s.history);
  const chartData = history.map((h) => ({
    time: new Date(h.timestamp).toLocaleTimeString("en", { minute: "2-digit", second: "2-digit" }),
    value: h[dataKey],
  }));

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl" style={{ backgroundColor: `${color}15`, color }}>
              <Icon className="h-8 w-8" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{title}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold tabular-nums">{value}</span>
                <span className="text-sm text-muted-foreground">{unit}</span>
              </div>
              {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">{title} History</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id={`detail-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.2} />
                  <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(215 20% 65% / 0.15)" />
              <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke="hsl(215 20% 65%)" />
              <YAxis tick={{ fontSize: 10 }} stroke="hsl(215 20% 65%)" />
              <Tooltip content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                return (
                  <div className="bg-popover border rounded-lg px-3 py-2 shadow-lg text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                      <span className="font-semibold tabular-nums">{payload[0].value}</span>
                    </div>
                  </div>
                );
              }} />
              <Area
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={2}
                fill={`url(#detail-${dataKey})`}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

function NetworkDetail() {
  const history = useSystemStore((s) => s.history);
  const chartData = history.map((h) => ({
    time: new Date(h.timestamp).toLocaleTimeString("en", { minute: "2-digit", second: "2-digit" }),
    upload: h.networkUp,
    download: h.networkDown,
  }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500">
                <Activity className="h-8 w-8" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Upload Speed</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold tabular-nums">{useSystemStore.getState().networkUp}</span>
                  <span className="text-sm text-muted-foreground">MB/s</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-500">
                <Network className="h-8 w-8" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Download Speed</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold tabular-nums">{useSystemStore.getState().networkDown}</span>
                  <span className="text-sm text-muted-foreground">MB/s</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Network History</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="netUpGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="netDownGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(215 20% 65% / 0.15)" />
              <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke="hsl(215 20% 65%)" />
              <YAxis tick={{ fontSize: 10 }} stroke="hsl(215 20% 65%)" />
              <Tooltip content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                return (
                  <div className="bg-popover border rounded-lg px-3 py-2 shadow-lg text-xs space-y-1">
                    {payload.map((p) => (
                      <div key={p.dataKey} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                        <span className="capitalize text-muted-foreground">{p.dataKey}:</span>
                        <span className="font-semibold tabular-nums">{p.value} MB/s</span>
                      </div>
                    ))}
                  </div>
                );
              }} />
              <Area type="monotone" dataKey="upload" stroke="#10b981" strokeWidth={2} fill="url(#netUpGrad)" isAnimationActive={false} />
              <Area type="monotone" dataKey="download" stroke="#06b6d4" strokeWidth={2} fill="url(#netDownGrad)" isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

function DiskDetail({ partitions }) {
  const totalUsed = partitions.reduce((a, d) => a + d.used, 0);
  const totalTotal = partitions.reduce((a, d) => a + d.total, 0);
  const totalPct = parseFloat(((totalUsed / totalTotal) * 100).toFixed(1));

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500">
              <HardDrive className="h-8 w-8" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Disk Usage</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold tabular-nums">{totalPct}</span>
                <span className="text-sm text-muted-foreground">%</span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{totalUsed} GB / {totalTotal} GB across {partitions.length} drives</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {partitions.map((p) => {
          const free = p.total - p.used;
          const chartData = p.history.map((h) => ({
            time: new Date(h.timestamp).toLocaleTimeString("en", { minute: "2-digit", second: "2-digit" }),
            value: h.usage,
          }));
          const barColor = p.usage > 90 ? "#ef4444" : p.usage > 70 ? "#f59e0b" : "#10b981";
          const gradId = `disk-${p.mount.replace(":", "")}`;

          return (
            <Card key={p.mount} className="overflow-hidden">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <HardDrive className="h-4 w-4 text-amber-500" />
                      <span className="text-sm font-bold">{p.mount}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-medium">{p.type}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{p.label}</p>
                  </div>
                  <span className="text-2xl font-bold tabular-nums" style={{ color: barColor }}>{p.usage}%</span>
                </div>

                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${p.usage}%`, backgroundColor: barColor }}
                  />
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-lg bg-muted/50 p-2">
                    <p className="text-[10px] text-muted-foreground mb-0.5">Used</p>
                    <p className="text-sm font-bold tabular-nums">{p.used} GB</p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-2">
                    <p className="text-[10px] text-muted-foreground mb-0.5">Free</p>
                    <p className="text-sm font-bold tabular-nums">{free} GB</p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-2">
                    <p className="text-[10px] text-muted-foreground mb-0.5">Total</p>
                    <p className="text-sm font-bold tabular-nums">{p.total} GB</p>
                  </div>
                </div>

                <ResponsiveContainer width="100%" height={100}>
                  <AreaChart data={chartData} margin={{ top: 2, right: 2, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={barColor} stopOpacity={0.2} />
                        <stop offset="100%" stopColor={barColor} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="time" tick={{ fontSize: 8 }} stroke="hsl(215 20% 65%)" interval="preserveStartEnd" />
                    <YAxis tick={{ fontSize: 8 }} stroke="hsl(215 20% 65%)" domain={[0, 100]} />
                    <Tooltip content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      return (
                        <div className="bg-popover border rounded-lg px-2 py-1 shadow-lg text-xs">
                          <span className="font-semibold tabular-nums">{payload[0].value}%</span>
                        </div>
                      );
                    }} />
                    <Area type="monotone" dataKey="value" stroke={barColor} strokeWidth={1.5} fill={`url(#${gradId})`} isAnimationActive={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function TabContent() {
  const activeTab = useSystemStore((s) => s.activeTab);
  const cpu = useSystemStore((s) => s.cpu);
  const memory = useSystemStore((s) => s.memory);
  const memoryUsed = useSystemStore((s) => s.memoryUsed);
  const memoryTotal = useSystemStore((s) => s.memoryTotal);
  const diskPartitions = useSystemStore((s) => s.diskPartitions);

  switch (activeTab) {
    case "overview":
      return (
        <div className="space-y-4">
          <MetricCards />
          <TopProcesses />
          <ChartsSection />
        </div>
      );
    case "processes":
      return <ProcessTable />;
    case "cpu":
      return <DetailView title="CPU Usage" icon={Cpu} value={cpu} unit="%" color="#3b82f6" dataKey="cpu" />;
    case "memory":
      return (
        <DetailView
          title="Memory Usage"
          icon={MemoryStick}
          value={memory}
          unit="%"
          color="#8b5cf6"
          dataKey="memory"
          sub={`${memoryUsed} GB / ${memoryTotal} GB`}
        />
      );
    case "network":
      return <NetworkDetail />;
    case "disk":
      return <DiskDetail partitions={diskPartitions} />;
    default:
      return null;
  }
}

export default function App() {
  const tick = useSystemStore((s) => s.tick);

  useEffect(() => {
    const interval = setInterval(tick, 2000);
    return () => clearInterval(interval);
  }, [tick]);

  return (
    <ThemeProvider>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">
            <TabContent />
          </main>
        </div>
        <NotificationStack />
      </div>
    </ThemeProvider>
  );
}
