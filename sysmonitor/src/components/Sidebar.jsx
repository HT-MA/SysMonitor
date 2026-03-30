import {
  LayoutDashboard,
  Cpu,
  MemoryStick,
  HardDrive,
  Network,
  List,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import useSystemStore from "@/store/systemStore";

const navItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "processes", label: "Processes", icon: List },
  { id: "cpu", label: "CPU", icon: Cpu },
  { id: "memory", label: "Memory", icon: MemoryStick },
  { id: "network", label: "Network", icon: Network },
  { id: "disk", label: "Disk", icon: HardDrive },
];

export default function Sidebar() {
  const activeTab = useSystemStore((s) => s.activeTab);
  const setActiveTab = useSystemStore((s) => s.setActiveTab);

  return (
    <aside className="hidden md:flex w-60 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      <div className="flex items-center gap-2.5 px-5 h-14 border-b border-sidebar-border">
        <Activity className="h-5 w-5 text-blue-400" />
        <span className="font-bold text-base tracking-tight">SysMonitor</span>
      </div>
      <nav className="flex-1 py-3 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer",
                isActive
                  ? "bg-sidebar-accent text-white shadow-sm"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </button>
          );
        })}
      </nav>
      <div className="px-4 py-3 border-t border-sidebar-border">
        <p className="text-[10px] text-sidebar-foreground/40 uppercase tracking-widest">System Monitor v1.0</p>
      </div>
    </aside>
  );
}
