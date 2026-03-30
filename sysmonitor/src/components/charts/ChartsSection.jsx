import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useSystemStore from "@/store/systemStore";

function ChartCard({ title, children }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-popover border rounded-lg px-3 py-2 shadow-lg text-xs">
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-muted-foreground capitalize">{p.dataKey}:</span>
          <span className="font-semibold tabular-nums">{p.value}</span>
        </div>
      ))}
    </div>
  );
}

function formatTime(ts) {
  const d = new Date(ts);
  return `${d.getMinutes().toString().padStart(2, "0")}:${d.getSeconds().toString().padStart(2, "0")}`;
}

export default function ChartsSection() {
  const history = useSystemStore((s) => s.history);
  const diskPartitions = useSystemStore((s) => s.diskPartitions);

  const chartData = useMemo(
    () =>
      history.map((h, i) => ({
        time: formatTime(h.timestamp),
        cpu: h.cpu,
        memory: h.memory,
        networkUp: h.networkUp,
        networkDown: h.networkDown,
        disk: diskPartitions[0]?.history[i]?.usage ?? 45,
      })),
    [history, diskPartitions]
  );

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      <ChartCard title="CPU Usage Over Time">
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="cpuGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(215 20% 65% / 0.15)" />
            <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke="hsl(215 20% 65%)" />
            <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} stroke="hsl(215 20% 65%)" />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="cpu"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#cpuGrad)"
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Memory Usage Over Time">
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="memGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(215 20% 65% / 0.15)" />
            <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke="hsl(215 20% 65%)" />
            <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} stroke="hsl(215 20% 65%)" />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="memory"
              stroke="#8b5cf6"
              strokeWidth={2}
              fill="url(#memGrad)"
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Network Activity">
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(215 20% 65% / 0.15)" />
            <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke="hsl(215 20% 65%)" />
            <YAxis tick={{ fontSize: 10 }} stroke="hsl(215 20% 65%)" />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="networkUp"
              stroke="#10b981"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="networkDown"
              stroke="#06b6d4"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Disk Usage Over Time">
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="diskGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(215 20% 65% / 0.15)" />
            <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke="hsl(215 20% 65%)" />
            <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} stroke="hsl(215 20% 65%)" />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="disk"
              stroke="#f59e0b"
              strokeWidth={2}
              fill="url(#diskGrad)"
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
