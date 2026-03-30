import { Sun, Moon, Bell } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { Button } from "@/components/ui/button";
import useSystemStore from "@/store/systemStore";

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const notifications = useSystemStore((s) => s.notifications);
  const activeTab = useSystemStore((s) => s.activeTab);

  const tabLabels = {
    overview: "System Overview",
    processes: "Process Manager",
    cpu: "CPU Monitor",
    memory: "Memory Monitor",
    network: "Network Monitor",
    disk: "Disk Monitor",
  };

  return (
    <header className="h-14 border-b bg-card flex items-center justify-between px-6 shrink-0">
      <h1 className="text-base font-semibold tracking-tight">{tabLabels[activeTab] || "Dashboard"}</h1>
      <div className="flex items-center gap-2">
        <div className="relative">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-4 w-4" />
            {notifications.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 bg-red-500 rounded-full text-[9px] text-white flex items-center justify-center font-bold">
                {notifications.length}
              </span>
            )}
          </Button>
        </div>
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </div>
    </header>
  );
}
