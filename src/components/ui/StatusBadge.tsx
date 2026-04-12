import type { AppointmentStatus } from "../../types/types";

interface StatusBadgeProps {
  status: AppointmentStatus;
  className?: string;
}

const STATUS_CONFIG: Record<
  AppointmentStatus,
  { label: string; className: string }
> = {
  pending: {
    label: "Pending",
    className: "bg-amber-50 text-amber-700 border border-amber-200",
  },
  confirmed: {
    label: "Confirmed",
    className: "bg-teal-50 text-teal-700 border border-teal-200",
  },
  completed: {
    label: "Completed",
    className: "bg-green-50 text-green-700 border border-green-200",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-red-50 text-red-600 border border-red-200",
  },
  reschedule_needed: {
    label: "Reschedule Needed",
    className:
      "bg-orange-50 text-orange-700 border border-orange-200 animate-pulse",
  },
  no_show: {
    label: "No Show",
    className: "bg-rose-50 text-rose-800 border border-rose-200",
  },
  expired: {
    label: "Expired",
    className: "bg-gray-100 text-gray-500 border border-gray-200",
  },
};

export const StatusBadge = ({ status, className = "" }: StatusBadgeProps) => {
  const config = STATUS_CONFIG[status] ?? {
    label: status,
    className: "bg-blue-50 text-blue-700 border border-blue-200",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-[8px] text-[10px] font-bold uppercase tracking-wide ${config.className} ${className}`}
    >
      {config.label}
    </span>
  );
};
