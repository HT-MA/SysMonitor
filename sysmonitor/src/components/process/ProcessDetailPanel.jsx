import { useMemo, useEffect } from "react";
import { X, Skull, Cpu, MemoryStick } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import useSystemStore from "@/store/systemStore";

function MiniChart({ data, dataKey, color, label }) {
  const chartData = useMemo(
    () =>
      data.map((d) => ({
        time: new Date(d.timestamp).toLocaleTimeString("en", { minute: "2-digit", second: "2-digit" }),
        value: d[dataKey],
      })),
    [data, dataKey]
  );

  return (
    <div>
      <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
        {label}
      </p>
      <ResponsiveContainer width="100%" height={120}>
        <AreaChart data={chartData} margin={{ top: 2, right: 2, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id={`detail-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.2} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(215 20% 65% / 0.15)" />
          <XAxis dataKey="time" tick={{ fontSize: 9 }} stroke="hsl(215 20% 65%)" interval="preserveStartEnd" />
          <YAxis tick={{ fontSize: 9 }} stroke="hsl(215 20% 65%)" />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              return (
                <div className="bg-popover border rounded-lg px-2.5 py-1.5 shadow-lg text-xs">
                  <span className="font-semibold tabular-nums">{payload[0].value}%</span>
                </div>
              );
            }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={1.5}
            fill={`url(#detail-${dataKey})`}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function formatUptime(seconds) {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (d > 0) return `${d}d ${h}h ${m}m`;
  if (h > 0) return `${h}h ${m}m ${s}s`;
  return `${m}m ${s}s`;
}

export default function ProcessDetailPanel() {
  const selectedProcess = useSystemStore((s) => s.selectedProcess);
  const processDetailOpen = useSystemStore((s) => s.processDetailOpen);
  const setProcessDetailOpen = useSystemStore((s) => s.setProcessDetailOpen);
  const setSelectedProcess = useSystemStore((s) => s.setSelectedProcess);
  const setKillConfirmOpen = useSystemStore((s) => s.setKillConfirmOpen);
  const processes = useSystemStore((s) => s.processes);

  const liveProcess = useMemo(
    () => (selectedProcess ? processes.find((p) => p.pid === selectedProcess.pid) : null),
    [selectedProcess, processes]
  );

  useEffect(() => {
    if (liveProcess && selectedProcess) {
      setSelectedProcess(liveProcess);
    }
  }, [liveProcess?.cpu, liveProcess?.memory]);

  if (!processDetailOpen || !selectedProcess) return null;

  const proc = liveProcess || selectedProcess;

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div
        className="absolute inset-0 bg-black/40 animate-in fade-in-0 duration-200"
        onClick={() => setProcessDetailOpen(false)}
      />
      <div className="relative w-full max-w-md bg-card border-l shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <Cpu className="h-4 w-4 text-primary shrink-0" />
            <h2 className="text-sm font-semibold truncate">{proc.name}</h2>
            <span className="text-[10px] text-muted-foreground shrink-0">PID {proc.pid}</span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-red-400 hover:text-red-500 hover:bg-red-500/10"
              onClick={() => {
                setProcessDetailOpen(false);
                setKillConfirmOpen(true);
              }}
            >
              <Skull className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setProcessDetailOpen(false)}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-muted/50 p-3">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">CPU Usage</p>
              <p className={`text-2xl font-bold tabular-nums ${proc.cpu > 50 ? "text-red-400" : ""}`}>
                {proc.cpu}%
              </p>
            </div>
            <div className="rounded-lg bg-muted/50 p-3">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Memory</p>
              <p className={`text-2xl font-bold tabular-nums ${proc.memory > 50 ? "text-purple-400" : ""}`}>
                {proc.memory}%
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            {[
              ["PID", proc.pid],
              ["Status", proc.status],
              ["Threads", proc.threads],
              ["Uptime", formatUptime(proc.uptime)],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0">
                <span className="text-xs text-muted-foreground">{label}</span>
                <span className="text-xs font-medium">{value}</span>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <MiniChart data={proc.history} dataKey="cpu" color="#3b82f6" label="CPU Usage Over Time" />
            <MiniChart data={proc.history} dataKey="memory" color="#8b5cf6" label="Memory Usage Over Time" />
          </div>
        </div>
      </div>
    </div>
  );
}
