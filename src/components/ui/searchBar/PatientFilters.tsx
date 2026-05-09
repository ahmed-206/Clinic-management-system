interface Props {
  statusFilter: string;
  onStatusChange: (value: string) => void;
}

export const PatientFilters = ({ statusFilter, onStatusChange }: Props) => {
  return (
    <select
      className="p-3 border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-primary/20"
      value={statusFilter}
      onChange={(e) => onStatusChange(e.target.value)}
    >
      <option value="all">All Status</option>
      <option value="active">Active Only</option>
      <option value="banned">Banned Only</option>
    </select>
  );
};