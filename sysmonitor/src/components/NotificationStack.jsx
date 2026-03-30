import { X, CheckCircle, AlertCircle } from "lucide-react";
import useSystemStore from "@/store/systemStore";

export default function NotificationStack() {
  const notifications = useSystemStore((s) => s.notifications);
  const dismiss = useSystemStore((s) => s.dismissNotification);

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {notifications.map((n) => (
        <div
          key={n.id}
          className="flex items-start gap-3 bg-card border rounded-lg p-3 shadow-lg animate-in slide-in-from-right-5 fade-in-0 duration-300"
        >
          {n.type === "success" ? (
            <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
          )}
          <p className="text-sm flex-1">{n.message}</p>
          <button onClick={() => dismiss(n.id)} className="text-muted-foreground hover:text-foreground cursor-pointer">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
