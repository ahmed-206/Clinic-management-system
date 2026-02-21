interface StatCardProps {
  label: string;
  value: string | number | undefined;
  icon: React.ReactNode;
  colorClass?: string;
}

export const StatCard = ({ label, value, icon, colorClass = "hover:bg-primary" }: StatCardProps) => (
  <div className={`bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center flex-col text-center gap-5 transition-all duration-300 hover:shadow-lg group ${colorClass} hover:text-white`}>
    <div className="p-4 bg-gray-50 rounded-xl group-hover:bg-white/20 transition-colors">
      {icon}
    </div>
    <div>
      <span className="text-3xl font-black block leading-none mb-1">
        {value ?? 0}
      </span>
      <span className="text-sm font-medium opacity-70">{label}</span>
    </div>
  </div>
);