import { useMemo } from "react";
import { Cpu, MemoryStick } from "lucide-react";
import useSystemStore from "@/store/systemStore";

export default function TopResourceBar() {
  const processes = useSystemStore((s) => s.processes);

  const stats = useMemo(() => {
    const totalCpu = processes.reduce((a, p) => a + p.cpu, 0);
    const totalMem = processes.reduce((a, p) => a + p.memory, 0);
    const highCpu = processes.filter((p) => p.cpu > 50).length;
    const highMem = processes.filter((p) => p.memory > 50).length;
    const running = processes.filter((p) => p.status === "running").length;
    const sleeping = processes.filter((p) => p.status === "sleeping").length;
    const stopped = processes.filter((p) => p.status === "stopped").length;
    return { totalCpu, totalMem, highCpu, highMem, running, sleeping, stopped };
  }, [processes]);

  const items = [
    { label: "Total Processes", value: processes.length, color: "text-foreground" },
    { label: "Running", value: stats.running, color: "text-emerald-400" },
    { label: "Sleeping", value: stats.sleeping, color: "text-amber-400" },
    { label: "Stopped", value: stats.stopped, color: "text-slate-400" },
    { label: "High CPU (>50%)", value: stats.highCpu, color: "text-red-400" },
    { label: "High Mem (>50%)", value: stats.highMem, color: "text-purple-400" },
  ];

  return (
    <div className="flex items-center gap-4 flex-wrap">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-1.5">
          <span className="text-[11px] text-muted-foreground">{item.label}:</span>
          <span className={`text-xs font-bold tabular-nums ${item.color}`}>{item.value}</span>
        </div>
      ))}
    </div>
  );
}
