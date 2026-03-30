import { useMemo, useCallback } from "react";
import {
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Skull,
  ChevronLeft,
  ChevronRight,
  Eye,
  RefreshCw,
  Filter,
  CheckSquare,
  Square,
  Trash2,
  FileText,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ContextMenu, { useContextMenu } from "@/components/ui/ContextMenu";
import TopResourceBar from "./TopResourceBar";
import ProcessDetailPanel from "./ProcessDetailPanel";
import useSystemStore from "@/store/systemStore";

const FILTER_OPTIONS = [
  { value: "all", label: "All Processes" },
  { value: "high-cpu", label: "High CPU (>50%)" },
  { value: "high-memory", label: "High Memory (>50%)" },
];

function StatusBadge({ status }) {
  const config = {
    running: "bg-emerald-500/15 text-emerald-500",
    sleeping: "bg-amber-500/15 text-amber-500",
    stopped: "bg-slate-500/15 text-slate-400",
    idle: "bg-amber-500/15 text-amber-500",
    suspended: "bg-slate-500/15 text-slate-400",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${config[status] || config.running}`}>
      {status}
    </span>
  );
}

function UsageBar({ value, max, thresholds }) {
  const [high, mid] = thresholds;
  const pct = Math.min(100, (value / max) * 100);
  const color =
    value > high ? "bg-red-500" : value > mid ? "bg-amber-500" : "bg-blue-500";
  const textColor =
    value > high ? "text-red-400" : value > mid ? "text-amber-400" : "";

  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={`text-xs font-medium tabular-nums w-12 text-right ${textColor}`}>
        {value}%
      </span>
    </div>
  );
}

function ProcessIcon({ name }) {
  const ext = name.split(".").pop()?.toLowerCase();
  const iconMap = {
    exe: "⚙️",
    dll: "📦",
  };
  return <span className="text-xs mr-1.5">{iconMap[ext] || "📄"}</span>;
}

export default function ProcessTable() {
  const processes = useSystemStore((s) => s.processes);
  const searchQuery = useSystemStore((s) => s.searchQuery);
  const setSearchQuery = useSystemStore((s) => s.setSearchQuery);
  const sortField = useSystemStore((s) => s.sortField);
  const sortDirection = useSystemStore((s) => s.sortDirection);
  const setSortField = useSystemStore((s) => s.setSortField);
  const currentPage = useSystemStore((s) => s.currentPage);
  const setCurrentPage = useSystemStore((s) => s.setCurrentPage);
  const pageSize = useSystemStore((s) => s.pageSize);
  const selectedProcess = useSystemStore((s) => s.selectedProcess);
  const setSelectedProcess = useSystemStore((s) => s.setSelectedProcess);
  const killConfirmOpen = useSystemStore((s) => s.killConfirmOpen);
  const setKillConfirmOpen = useSystemStore((s) => s.setKillConfirmOpen);
  const processDetailOpen = useSystemStore((s) => s.processDetailOpen);
  const setProcessDetailOpen = useSystemStore((s) => s.setProcessDetailOpen);
  const killProcess = useSystemStore((s) => s.killProcess);
  const processFilter = useSystemStore((s) => s.processFilter);
  const setProcessFilter = useSystemStore((s) => s.setProcessFilter);
  const selectedPids = useSystemStore((s) => s.selectedPids);
  const toggleSelectPid = useSystemStore((s) => s.toggleSelectPid);
  const selectAllPids = useSystemStore((s) => s.selectAllPids);
  const clearSelection = useSystemStore((s) => s.clearSelection);
  const bulkKillOpen = useSystemStore((s) => s.bulkKillOpen);
  const setBulkKillOpen = useSystemStore((s) => s.setBulkKillOpen);
  const bulkKill = useSystemStore((s) => s.bulkKill);
  const isKilling = useSystemStore((s) => s.isKilling);
  const tick = useSystemStore((s) => s.tick);

  const { contextMenu, showContextMenu, hideContextMenu } = useContextMenu();

  const filtered = useMemo(() => {
    let list = [...processes];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || String(p.pid).includes(q)
      );
    }
    if (processFilter === "high-cpu") list = list.filter((p) => p.cpu > 50);
    if (processFilter === "high-memory") list = list.filter((p) => p.memory > 50);
    list.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      return sortDirection === "desc" ? bVal - aVal : aVal - bVal;
    });
    return list;
  }, [processes, searchQuery, sortField, sortDirection, processFilter]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const allPagePids = paged.map((p) => p.pid);
  const allPageSelected = allPagePids.length > 0 && allPagePids.every((pid) => selectedPids.has(pid));

  const SortIcon = useCallback(
    ({ field }) => {
      if (sortField !== field)
        return <ArrowUpDown className="h-3 w-3 text-muted-foreground/40" />;
      return sortDirection === "desc" ? (
        <ArrowDown className="h-3 w-3 text-primary" />
      ) : (
        <ArrowUp className="h-3 w-3 text-primary" />
      );
    },
    [sortField, sortDirection]
  );

  const handleKillClick = (proc) => {
    setSelectedProcess(proc);
    setKillConfirmOpen(true);
  };

  const handleDetailClick = (proc) => {
    setSelectedProcess(proc);
    setProcessDetailOpen(true);
  };

  const handleContextMenu = (e, proc) => {
    showContextMenu(e, [
      {
        icon: Eye,
        label: "Inspect Process",
        onClick: () => handleDetailClick(proc),
      },
      {
        icon: Skull,
        label: "Kill Process",
        danger: true,
        onClick: () => handleKillClick(proc),
      },
    ]);
  };

  const handleSelectAll = () => {
    if (allPageSelected) {
      clearSelection();
    } else {
      selectAllPids(allPagePids);
    }
  };

  return (
    <>
      <Card>
        <CardContent className="p-4 space-y-3">
          <TopResourceBar />

          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative flex-1 min-w-[200px] max-w-xs">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search by name or PID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-8 text-xs"
              />
            </div>

            <div className="flex items-center gap-1">
              {FILTER_OPTIONS.map((opt) => (
                <Button
                  key={opt.value}
                  variant={processFilter === opt.value ? "default" : "outline"}
                  size="sm"
                  className="h-8 text-[11px]"
                  onClick={() => setProcessFilter(opt.value)}
                >
                  {opt.label}
                </Button>
              ))}
            </div>

            <div className="flex items-center gap-1 ml-auto">
              {selectedPids.size > 0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  className="h-8 text-[11px] gap-1.5"
                  onClick={() => setBulkKillOpen(true)}
                >
                  <Trash2 className="h-3 w-3" />
                  Kill {selectedPids.size} Selected
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-[11px] gap-1.5"
                onClick={tick}
              >
                <RefreshCw className="h-3 w-3" />
                Refresh
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 text-left">
                  <th className="py-2 px-3 w-9">
                    <button onClick={handleSelectAll} className="cursor-pointer">
                      {allPageSelected ? (
                        <CheckSquare className="h-3.5 w-3.5 text-primary" />
                      ) : (
                        <Square className="h-3.5 w-3.5 text-muted-foreground/50" />
                      )}
                    </button>
                  </th>
                  <th className="py-2 px-3 text-xs font-medium text-muted-foreground">Name</th>
                  <th className="py-2 px-3 text-xs font-medium text-muted-foreground">PID</th>
                  <th
                    className="py-2 px-3 text-xs font-medium text-muted-foreground cursor-pointer select-none"
                    onClick={() => setSortField("cpu")}
                  >
                    <div className="flex items-center gap-1">CPU <SortIcon field="cpu" /></div>
                  </th>
                  <th
                    className="py-2 px-3 text-xs font-medium text-muted-foreground cursor-pointer select-none"
                    onClick={() => setSortField("memory")}
                  >
                    <div className="flex items-center gap-1">Memory <SortIcon field="memory" /></div>
                  </th>
                  <th className="py-2 px-3 text-xs font-medium text-muted-foreground">Threads</th>
                  <th className="py-2 px-3 text-xs font-medium text-muted-foreground">Status</th>
                  <th className="py-2 px-3 text-xs font-medium text-muted-foreground text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((proc) => {
                  const isSelected = selectedPids.has(proc.pid);
                  const highCpu = proc.cpu > 50;
                  const highMem = proc.memory > 50;
                  return (
                    <tr
                      key={proc.pid}
                      className={`border-b last:border-0 transition-colors cursor-default ${
                        isSelected
                          ? "bg-primary/5"
                          : "hover:bg-muted/30"
                      } ${highMem ? "bg-purple-500/[0.03]" : ""}`}
                      onContextMenu={(e) => handleContextMenu(e, proc)}
                    >
                      <td className="py-2 px-3">
                        <button onClick={() => toggleSelectPid(proc.pid)} className="cursor-pointer">
                          {isSelected ? (
                            <CheckSquare className="h-3.5 w-3.5 text-primary" />
                          ) : (
                            <Square className="h-3.5 w-3.5 text-muted-foreground/30 hover:text-muted-foreground/60 transition-colors" />
                          )}
                        </button>
                      </td>
                      <td className="py-2 px-3">
                        <div className="flex items-center">
                          <ProcessIcon name={proc.name} />
                          <span className={`font-medium text-xs ${highCpu ? "text-red-400" : ""}`}>
                            {proc.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-2 px-3 text-xs text-muted-foreground tabular-nums font-mono">
                        {proc.pid}
                      </td>
                      <td className="py-2 px-3">
                        <UsageBar value={proc.cpu} max={100} thresholds={[50, 20]} />
                      </td>
                      <td className="py-2 px-3">
                        <UsageBar value={proc.memory} max={100} thresholds={[50, 10]} />
                      </td>
                      <td className="py-2 px-3 text-xs text-muted-foreground tabular-nums">
                        {proc.threads}
                      </td>
                      <td className="py-2 px-3">
                        <StatusBadge status={proc.status} />
                      </td>
                      <td className="py-2 px-3 text-right">
                        <div className="flex items-center justify-end gap-0.5">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleDetailClick(proc)}
                            title="View Details"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-red-400 hover:text-red-500 hover:bg-red-500/10"
                            onClick={() => handleKillClick(proc)}
                            title="Kill Process"
                          >
                            <Skull className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-muted-foreground">
                Showing {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, filtered.length)} of{" "}
                {filtered.length} processes
              </span>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </Button>
                {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                  let page;
                  if (totalPages <= 7) {
                    page = i + 1;
                  } else if (currentPage <= 4) {
                    page = i + 1;
                  } else if (currentPage >= totalPages - 3) {
                    page = totalPages - 6 + i;
                  } else {
                    page = currentPage - 3 + i;
                  }
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="icon"
                      className="h-7 w-7 text-[11px]"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  );
                })}
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          items={contextMenu.items}
          onClose={hideContextMenu}
        />
      )}

      <Dialog open={killConfirmOpen} onOpenChange={setKillConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-500">
              <Skull className="h-5 w-5" />
              Terminate Process
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to terminate{" "}
              <span className="font-semibold text-foreground">{selectedProcess?.name}</span>
              {" "}with PID{" "}
              <span className="font-semibold text-foreground">{selectedProcess?.pid}</span>?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setKillConfirmOpen(false)} disabled={isKilling}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => selectedProcess && killProcess(selectedProcess.pid)}
              disabled={isKilling}
            >
              {isKilling ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  Terminating...
                </>
              ) : (
                "Terminate Process"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={bulkKillOpen} onOpenChange={setBulkKillOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-500">
              <Trash2 className="h-5 w-5" />
              Bulk Terminate Processes
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to terminate{" "}
              <span className="font-semibold text-foreground">{selectedPids.size} processes</span>?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setBulkKillOpen(false)} disabled={isKilling}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={bulkKill} disabled={isKilling}>
              {isKilling ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  Terminating...
                </>
              ) : (
                `Terminate ${selectedPids.size} Processes`
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ProcessDetailPanel />
    </>
  );
}
