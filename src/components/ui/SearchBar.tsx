interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  // فلاتر صفحة المرضى
  statusFilter?: string; 
  onStatusChange?: (value: string) => void;
  showStatusFilter?: boolean;

  // فلاتر صفحة الدكاترة
  selectedSpecialty?: string;
  onSpecialtyChange?: (value: string) => void;
  specialties?: string[];
  showSpecialtyFilter?: boolean;

 // فلاتر صفحة الحجوزات
  statusAppointmentFilter?: string;
  onStatusAppointmentFilter?: (value: string) => void;
  dateFilter?: string;
  onDateChange?: (value: string) => void;
  showAppointmentFilters?: boolean;
  
}

export const SearchBar = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  showStatusFilter = false,
  selectedSpecialty,
  onSpecialtyChange,
  specialties,
  showSpecialtyFilter = false,
  statusAppointmentFilter,
  onStatusAppointmentFilter,
  onDateChange,
  dateFilter,
  showAppointmentFilters = false
}: SearchBarProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 w-full mb-6">
      <input
        type="text"
        placeholder="Search by name..."
        className="flex-1 p-3 border border-gray-700 rounded-xl focus:ring-2 focus:ring-primary outline-none transition"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      
      {/* فلاتر الحجوزات (تظهر فقط في صفحة الحجوزات) */}
      {showAppointmentFilters && (
  <div className="flex gap-2 flex-wrap">
    <select 
      className="p-3 border border-gray-200 rounded-xl bg-white"
      value={ statusAppointmentFilter}
      onChange={(e) => onStatusAppointmentFilter?.(e.target.value)}
    >
      <option value="all">All Status</option>
      <option value="pending"> Pending</option>
      <option value="confirmed"> Confirmed</option>
      <option value="cancelled"> Cancelled</option>
    </select>

    <select 
      className="p-3 border border-gray-200 rounded-xl bg-white"
      value={dateFilter}
      onChange={(e) => onDateChange?.(e.target.value)}
    >
      <option value="all">Any Time</option>
      <option value="today">Today</option>
      <option value="tomorrow">Tomorrow</option>
      <option value="this-week">This Week</option>
    </select>
  </div>
)}
      {/* فلتر الحالة (يظهر في صفحة المرضى) */}
      {showStatusFilter && (
        <select
          className="p-3 border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-[#8B7E7E]"
          value={statusFilter}
          onChange={(e) => onStatusChange?.(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="active">Active Only</option>
          <option value="banned">Banned Only</option>
        </select>
      )}

      {/* فلتر التخصص (يظهر في صفحة الدكاترة) */}
      {showSpecialtyFilter && (specialties ?? []).length > 0 && (
        <select
          className="p-3 border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-[#8B7E7E]"
          value={selectedSpecialty}
          onChange={(e) => onSpecialtyChange?.(e.target.value)}
        >
          {specialties?.map((s) => (
            <option key={s} value={s}>
              {s === "All"
                ? "All Specialties"
                : s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};
