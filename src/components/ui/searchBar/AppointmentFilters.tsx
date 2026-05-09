const selectStyle = "p-3 border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-primary/20";

interface Props {
  statusFilter: string;
  onStatusChange: (value: string) => void;
  dateFilter: string;
  onDateChange: (value: string) => void;
}

export const AppointmentFilters = ({
  statusFilter,
  onStatusChange,
  dateFilter,
  onDateChange,
}: Props) => {
  return (
    <div className="flex gap-2 flex-wrap">
      <select
        className={selectStyle}
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value)}
      >
        <option value="all">All Status</option>
        <option value="pending">Pending</option>
        <option value="confirmed">Confirmed</option>
        <option value="cancelled">Cancelled</option>
      </select>

      <select
        className={selectStyle}
        value={dateFilter}
        onChange={(e) => onDateChange(e.target.value)}
      >
        <option value="all">Any Time</option>
        <option value="today">Today</option>
        <option value="tomorrow">Tomorrow</option>
        <option value="this-week">This Week</option>
      </select>
    </div>
  );
};