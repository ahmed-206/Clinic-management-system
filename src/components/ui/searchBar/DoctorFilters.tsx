interface Props {
  selectedSpecialty: string;
  onSpecialtyChange: (value: string) => void;
  specialties: string[];
}

export const DoctorFilters = ({
  selectedSpecialty,
  onSpecialtyChange,
  specialties,
}: Props) => {
  if (specialties.length === 0) return null;

  return (
    <select
      className="p-3 border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-primary/20"
      value={selectedSpecialty}
      onChange={(e) => onSpecialtyChange(e.target.value)}
    >
      {specialties.map((s) => (
        <option key={s} value={s}>
          {s === "All" ? "All Specialties" : s.charAt(0).toUpperCase() + s.slice(1)}
        </option>
      ))}
    </select>
  );
};