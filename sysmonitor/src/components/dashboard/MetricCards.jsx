import { Cpu, MemoryStick, HardDrive, Network, ArrowUp, ArrowDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Sparkline from "@/components/Sparkline";
import useSystemStore from "@/store/systemStore";

function MetricCard({ icon: Icon, label, value, unit, sparkData, color, sub }) {
  return (
    <Card className="group hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <div
              className="p-1.5 rounded-lg"
              style={{ backgroundColor: `${color}15`, color }}
            >
              <Icon className="h-4 w-4" />
            </div>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {label}
            </span>
          </div>
        </div>
        <div className="flex items-baseline gap-1 mb-1">
          <span className="text-2xl font-bold tabular-nums">{value}</span>
          <span className="text-xs text-muted-foreground">{unit}</span>
        </div>
        {sub && <p className="text-[11px] text-muted-foreground mb-2">{sub}</p>}
        <Sparkline
          data={sparkData}
          color={color}
          height={32}
        />
      </CardContent>
    </Card>
  );
}

export default function MetricCards() {
  const cpu = useSystemStore((s) => s.cpu);
  const memory = useSystemStore((s) => s.memory);
  const memoryUsed = useSystemStore((s) => s.memoryUsed);
  const memoryTotal = useSystemStore((s) => s.memoryTotal);
  const diskPartitions = useSystemStore((s) => s.diskPartitions);
  const networkUp = useSystemStore((s) => s.networkUp);
  const networkDown = useSystemStore((s) => s.networkDown);
  const history = useSystemStore((s) => s.history);

  const totalDiskTotal = diskPartitions.reduce((a, d) => a + d.total, 0);
  const totalDiskUsed = diskPartitions.reduce((a, d) => a + d.used, 0);
  const avgDiskUsage = parseFloat(((totalDiskUsed / totalDiskTotal) * 100).toFixed(1));

  const cpuSpark = history.slice(-20).map((h) => ({ value: h.cpu }));
  const memSpark = history.slice(-20).map((h) => ({ value: h.memory }));
  const diskSpark = (diskPartitions[0]?.history || []).slice(-20).map((h) => ({ value: h.usage }));
  const netUpSpark = history.slice(-20).map((h) => ({ value: h.networkUp }));
  const netDownSpark = history.slice(-20).map((h) => ({ value: h.networkDown }));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <MetricCard
        icon={Cpu}
        label="CPU Usage"
        value={cpu}
        unit="%"
        sparkData={cpuSpark}
        color="#3b82f6"
      />
      <MetricCard
        icon={MemoryStick}
        label="Memory"
        value={memory}
        unit="%"
        sub={`${memoryUsed} GB / ${memoryTotal} GB`}
        sparkData={memSpark}
        color="#8b5cf6"
      />
      <MetricCard
        icon={HardDrive}
        label="Disk Usage"
        value={avgDiskUsage}
        unit="%"
        sub={`${totalDiskUsed} GB / ${totalDiskTotal} GB (${diskPartitions.length} drives)`}
        sparkData={diskSpark}
        color="#f59e0b"
      />
      <Card className="group hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
                <Network className="h-4 w-4" />
              </div>
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Network
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-1">
            <div>
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground mb-0.5">
                <ArrowUp className="h-3 w-3" /> Upload
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold tabular-nums">{networkUp}</span>
                <span className="text-[10px] text-muted-foreground">MB/s</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground mb-0.5">
                <ArrowDown className="h-3 w-3" /> Download
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold tabular-nums">{networkDown}</span>
                <span className="text-[10px] text-muted-foreground">MB/s</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Sparkline data={netUpSpark} color="#10b981" height={28} />
            <Sparkline data={netDownSpark} color="#06b6d4" height={28} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
