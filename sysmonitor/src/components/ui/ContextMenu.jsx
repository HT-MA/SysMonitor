import { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

export default function ContextMenu({ x, y, items, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  const menuStyle = {
    position: "fixed",
    left: x,
    top: y,
    zIndex: 9999,
  };

  return (
    <div ref={ref} style={menuStyle} className="animate-in fade-in-0 zoom-in-95 duration-100">
      <div className="min-w-[160px] rounded-lg border bg-popover p-1 shadow-xl">
        {items.map((item, i) => (
          <button
            key={i}
            onClick={() => {
              item.onClick();
              onClose();
            }}
            disabled={item.disabled}
            className={cn(
              "flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors cursor-pointer",
              item.danger
                ? "text-red-500 hover:bg-red-500/10"
                : "text-popover-foreground hover:bg-accent",
              item.disabled && "opacity-40 pointer-events-none"
            )}
          >
            {item.icon && <item.icon className="h-3.5 w-3.5" />}
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function useContextMenu() {
  const [ctx, setCtx] = useState(null);

  const show = useCallback((e, items) => {
    e.preventDefault();
    e.stopPropagation();
    const menuW = 170;
    const menuH = items.length * 32 + 8;
    const posX = e.clientX + menuW > window.innerWidth ? e.clientX - menuW : e.clientX;
    const posY = e.clientY + menuH > window.innerHeight ? e.clientY - menuH : e.clientY;
    setCtx({ x: posX, y: posY, items });
  }, []);

  const hide = useCallback(() => setCtx(null), []);

  return { contextMenu: ctx, showContextMenu: show, hideContextMenu: hide };
}
