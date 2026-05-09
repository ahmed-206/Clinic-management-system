import { useAdminDashboard } from "../../hooks/admin/useAdminStats";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  
} from "recharts";


import { FaSpinner } from "react-icons/fa";
import {
  LuCalendarDays,
  LuStethoscope,
  LuCircleDollarSign,
  LuUsersRound,
  LuTrendingUp,
  
} from "react-icons/lu";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { formatDisplayDate } from "../../utils/dateTimeFormate";
import { useDashboardT, useCommonT } from "../../hooks/useT";
import type { TooltipProps } from 'recharts';
import type { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  gradient: string;
  trend?: string;
}

const StatCard = ({ title, value, icon, gradient, trend }: StatCardProps) => (
  <div className={`relative rounded-2xl p-5 overflow-hidden text-white ${gradient} shadow-lg`}>
    {/* background circle decoration */}
    <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/10" />
    <div className="absolute -right-1 -top-1 w-14 h-14 rounded-full bg-white/10" />

    <div className="relative z-10 flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm">
          {icon}
        </div>
        {trend && (
          <span className="flex items-center gap-1 text-[10px] font-bold bg-white/20 px-2 py-1 rounded-full">
            <LuTrendingUp size={10} />
            {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-white/70 mb-1">
          {title}
        </p>
        <h3 className="text-3xl font-bold tracking-tight">{value}</h3>
      </div>
    </div>
  </div>
);
interface CustomTooltipProps extends TooltipProps<ValueType, NameType> {
  payload?: Array<{
    value: ValueType;
    name: NameType;
    color?: string;
    dataKey?: string | number;
  }>;
  label?: string;
  active?: boolean;
}
const CustomTooltip = ({
  active,
  payload,
  label,
}: CustomTooltipProps) => {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-xl">
      <p className="text-xs font-bold text-secondary/50 uppercase tracking-wider mb-1">
        {label}
      </p>
      <p className="text-2xl font-bold text-primary">{payload[0].value}</p>
      <p className="text-xs text-secondary/50">appointments</p>
    </div>
  );
};

export const AdminDashboard = () => {
  const { stats, activities, isActivityLoading, statsError, isStatsLoading } =
    useAdminDashboard();
  const td = useDashboardT();
  const  tc  = useCommonT();

  if (isStatsLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (statsError) {
    return (
      <div className="flex justify-center items-center h-screen bg-red-50 text-red-700">
        <p className="text-lg">{tc('error')}: {statsError.message}</p>
      </div>
    );
  }

  const maxCount = Math.max(...(stats?.chartData?.map((d) => d.count) ?? [1]));

  return (
    <div className="p-4 md:p-8 bg-neutral-100 min-h-screen rounded-xl space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary">
            {td('dashboard.admin.welcomeBack')}
          </h1>
          <p className="text-sm text-secondary/60 font-medium mt-0.5">
            {formatDisplayDate(new Date().toISOString())}
          </p>
        </div>
        
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={td('dashboard.admin.totalDoctors')}
          value={stats?.mainStats.doctors || 0}
          icon={<LuStethoscope size={20} />}
          gradient="bg-gradient-to-br from-primary to-primary/70"
        />
        <StatCard
          title={td('dashboard.admin.totalPatients')}
          value={stats?.mainStats.patients || 0}
          icon={<LuUsersRound size={20} />}
          gradient="bg-gradient-to-br from-blue-500 to-blue-400"
        />
        <StatCard
          title={td('dashboard.admin.appointmentsToday')}
          value={stats?.mainStats.todayAppointments || 0}
          icon={<LuCalendarDays size={20} />}
          gradient="bg-gradient-to-br from-violet-500 to-violet-400"
        />
        <StatCard
          title={td('dashboard.admin.totalRevenue')}
          value={`${(stats?.mainStats.revenue || 0).toLocaleString()} ${tc('currency')}`}
          icon={<LuCircleDollarSign size={20} />}
          gradient="bg-gradient-to-br from-emerald-500 to-emerald-400"
        />
      </div>

      {/* ── Chart + Activity ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-secondary">
                {td('dashboard.admin.appointmentsTrend')}
              </h2>
              <p className="text-xs text-secondary/50 mt-0.5">Last 7 days</p>
            </div>
            <div className="p-2 bg-primary/5 rounded-xl">
              <LuCalendarDays size={18} className="text-primary" />
            </div>
          </div>

          <div className="h-56 md:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats?.chartData}
                barCategoryGap="30%"
                barGap={4}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f0f0f0"
                />
                <XAxis
                  dataKey="date"
                  tick={{ fill: "#888", fontSize: 11, fontWeight: 500 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#888", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={24}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "rgba(0,74,124,0.04)", radius: 8 }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]} maxBarSize={48}>
                  {stats?.chartData?.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.count === maxCount
                          ? "#004A7C"
                          : `rgba(0,74,124,${0.2 + (entry.count / maxCount) * 0.6})`
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-secondary">
              {td('dashboard.admin.recentActivity')}
            </h2>
            <span className="text-[10px] font-bold bg-primary/5 text-primary px-2.5 py-1 rounded-full uppercase tracking-wider">
              Live
            </span>
          </div>

          {isActivityLoading ? (
            <div className="flex justify-center items-center h-40">
              <FaSpinner className="animate-spin text-2xl text-secondary/30" />
            </div>
          ) : !activities || activities.length === 0 ? (
            <div className="text-center py-10 text-secondary/40 text-sm">
              {td('dashboard.admin.noRecentActivity')}
            </div>
          ) : (
            <ul className="space-y-3">
              {activities.map((activity) => {
                const patientName =
                  activity.patients?.full_name ??
                  activity.profiles?.name ??
                  tc('unknown');
                return (
                  <li
                    key={activity.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-primary/5 transition-colors"
                  >
                    <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center text-primary text-sm font-bold shrink-0">
                      {patientName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-secondary truncate">
                        {patientName}
                      </p>
                      <p className="text-xs text-secondary/50">
                        {td('dashboard.admin.bookedAppointment')}
                      </p>
                    </div>
                    <span className="text-[10px] text-secondary/40 shrink-0">
                      {new Date(activity.appointment_date).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {/* ── Top Doctors ── */}
      <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-secondary">
            {td('dashboard.admin.topDoctors')}
          </h2>
          <LuStethoscope size={18} className="text-primary/40" />
        </div>

        {!stats?.topDoctors?.length ? (
          <p className="text-secondary/40 text-center py-4 text-sm">
            {td('dashboard.admin.noDoctors')}
          </p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.topDoctors.map((doctor, index) => {
              const medals = ["1", "2", "3"];
              return (
                <li
                  key={doctor.name}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-primary/20 hover:bg-primary/5 transition-all"
                >
                  <span className="text-2xl font-bold">{medals[index] ?? `#${index + 1}`}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-secondary text-sm truncate">
                      {doctor.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {/* progress bar */}
                      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{
                            width: `${(doctor.count / (stats.topDoctors[0]?.count || 1)) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs font-bold text-primary shrink-0">
                        {doctor.count} {td('dashboard.admin.appointmentsCount')}
                      </span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};
