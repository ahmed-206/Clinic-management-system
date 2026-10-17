import { LuTrendingUp } from "react-icons/lu";

interface StatCardProps {
  title: string;
  value: number | string | undefined;
  icon: React.ReactNode;
  
  trend?: string;
}

export const StatCard = ({ title, value, icon,  trend }: StatCardProps) => (
  <div className={`relative rounded-2xl bg-white p-3 overflow-hidden  border border-secondary/20 shadow-lg`}>
    <div className="z-10 flex flex-col gap-2">
      <div className="flex  items-center gap-2">
        <div className="p-2.5 bg-secondary/10 rounded-full text-primary backdrop-blur-sm">
          {icon}
        </div>
        {trend && (
          <span className="flex items-center gap-1 text-[10px] font-bold bg-white/20 px-2 py-1 rounded-full">
            <LuTrendingUp size={10} />
            {trend}
          </span>
        )}
        <p className="text-xs font-semibold  tracking-widest text-secondary mb-1">
          {title}
        </p>
      </div>
      <div>
        <h3 className="text-2xl font-bold  text-primary">{value}</h3>
      </div>
    </div>
  </div>
);