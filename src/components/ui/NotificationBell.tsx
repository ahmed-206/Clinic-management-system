// components/ui/NotificationBell.tsx
import { useState, useRef, useEffect } from "react";
import { LuBell, LuCheck } from "react-icons/lu";
import { useNotifications } from "../../hooks/notification/useNotifications";
import { formatDistanceToNow } from "date-fns";

const TYPE_STYLES: Record<string, string> = {
  appointment_confirmed:  "bg-green-50  border-green-100  text-green-700",
  appointment_cancelled:  "bg-red-50    border-red-100    text-red-700",
  appointment_completed:  "bg-blue-50   border-blue-100   text-blue-700",
  reschedule_needed:      "bg-orange-50 border-orange-100 text-orange-700",
  new_appointment:        "bg-purple-50 border-purple-100 text-purple-700",
  prescription_ready:     "bg-teal-50   border-teal-100   text-teal-700",
};

export const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  // إغلاق الـ dropdown لما تضغط برا
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      {/* Bell Button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative p-2 rounded-xl hover:bg-gray-100 transition"
      >
        <LuBell size={22} className="text-secondary" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100">
            <h3 className="font-bold text-secondary text-sm">
              Notifications
              {unreadCount > 0 && (
                <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={() => markAllAsRead()}
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                <LuCheck size={12} /> Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
            {notifications.length === 0 ? (
              <div className="py-10 text-center text-gray-400 text-sm">
                No notifications yet
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => !n.is_read && markAsRead(n.id)}
                  className={`px-4 py-3 cursor-pointer transition hover:bg-gray-50 ${
                    !n.is_read ? "bg-blue-50/40" : ""
                  }`}
                >
                  <div className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border mb-1 ${
                    TYPE_STYLES[n.type] ?? "bg-gray-50 border-gray-100 text-gray-600"
                  }`}>
                    {n.type.replace(/_/g, " ").toUpperCase()}
                  </div>
                  <p className="text-sm font-semibold text-secondary">{n.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{n.body}</p>
                  <p className="text-[10px] text-gray-400 mt-1">
                    {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};