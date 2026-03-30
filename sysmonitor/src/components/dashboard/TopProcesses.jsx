import { Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useSystemStore from "@/store/systemStore";

function ProgressBar({ value, max, color }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${pct}%`, backgroundColor: color }}
      />
    </div>
  );
}

export default function TopProcesses() {
  const processes = useSystemStore((s) => s.processes);
  const setSelectedProcess = useSystemStore((s) => s.setSelectedProcess);
  const setProcessDetailOpen = useSystemStore((s) => s.setProcessDetailOpen);

  const topByCpu = [...processes].sort((a, b) => b.cpu - a.cpu).slice(0, 5);
  const topByMem = [...processes].sort((a, b) => b.memory - a.memory).slice(0, 5);

  const handleClick = (p) => {
    setSelectedProcess(p);
    setProcessDetailOpen(true);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Trophy className="h-4 w-4 text-amber-500" />
            Top 5 by CPU
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {topByCpu.map((p, i) => (
            <div key={p.pid} className="cursor-pointer group" onClick={() => handleClick(p)}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[10px] font-bold text-muted-foreground w-4">{i + 1}</span>
                  <span className="text-xs font-medium truncate group-hover:text-primary transition-colors">
                    {p.name}
                  </span>
                </div>
                <span className="text-xs font-bold tabular-nums text-blue-400">{p.cpu}%</span>
              </div>
              <ProgressBar value={p.cpu} max={30} color="#3b82f6" />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Trophy className="h-4 w-4 text-purple-500" />
            Top 5 by Memory
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {topByMem.map((p, i) => (
            <div key={p.pid} className="cursor-pointer group" onClick={() => handleClick(p)}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[10px] font-bold text-muted-foreground w-4">{i + 1}</span>
                  <span className="text-xs font-medium truncate group-hover:text-primary transition-colors">
                    {p.name}
                  </span>
                </div>
                <span className="text-xs font-bold tabular-nums text-purple-400">{p.memory}%</span>
              </div>
              <ProgressBar value={p.memory} max={16} color="#8b5cf6" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
