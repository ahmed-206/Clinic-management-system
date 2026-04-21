import { useAdminDashboard } from "../../hooks/admin/useAdminStats";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {FaSpinner} from "react-icons/fa";
import {
  LuCalendarDays,
  LuStethoscope,
   LuCircleDollarSign,
  LuUsersRound
} from "react-icons/lu";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { formatDisplayDate } from "../../utils/dateTimeFormate";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  iconBgColor: string; // لون خلفية الأيقونة (موحد أو متغير)
  accentColor: string; // لون الخط الجانبي
}

const StatCard = ({ title, value, icon, iconBgColor, accentColor }: StatCardProps) => (
  <div className="bg-white rounded-xl p-6 shadow-sm  flex flex-col gap-4 relative overflow-hidden hover:shadow-md hover:translate-y-1 transition-all duration-300">
    
  
    <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${accentColor}`} />
    
    <div className="flex justify-between items-start">
      
      <div className={`p-3 rounded-xl ${iconBgColor} text-primary`}>
        {icon}
      </div>
    </div>

    <div className="space-y-1">
      <p className="text-[11px] text-secondary font-bold uppercase tracking-wider">
        {title}
      </p>
      <h3 className="text-3xl font-semibold text-primary">
        {value}
      </h3>
    </div>
  </div>
);

export const AdminDashboard = () => {
  const { stats, activities, isActivityLoading, statsError, isStatsLoading } =
    useAdminDashboard();

  // 1. حالة التحميل
  if (isStatsLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <LoadingSpinner size="lg" />
        
      </div>
    );
  }

  // 1. حالة الخطأ
  if (statsError) {
    return (
      <div className="flex justify-center items-center h-screen bg-red-50 text-red-700">
        <p className="text-lg">Error: {statsError.message}</p>
      </div>
    );
  }
  return (
    <div className="p-4 md:p-8 bg-neutral-100 min-h-screen rounded-xl">
<div className="mb-6 md:mb-8 text-center md:text-left">
        <h1 className="text-2xl md:text-3xl font-bold text-primary mb-6 md:mb-2 text-center md:text-left">Welcome back, Admin</h1>
<p className="text-sm md:text-base text-secondary font-medium">
    {formatDisplayDate(new Date().toISOString())}
  </p>
  </div>      {/* --- القسم الأول: الكروت الإحصائية الأربعة (Grid Layout) --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <StatCard
          title="Total Doctors"
          value={stats?.mainStats.doctors || 0}
          icon={<LuStethoscope size={24} />}
          iconBgColor="bg-blue-50"   
    accentColor="bg-primary"
        />
        <StatCard
          title="Total Patients"
          value={stats?.mainStats.patients || 0}
          icon={<LuUsersRound size={24} />}
         iconBgColor="bg-blue-50"   
    accentColor="bg-primary-200"
        />
        <StatCard
          title="Appointments Today"
          value={stats?.mainStats.todayAppointments || 0}
          icon={<LuCalendarDays size={24} />}
         iconBgColor="bg-blue-50"   
    accentColor="bg-primary"
        />
        <StatCard
          title="Total Revenue"
          value={`${(stats?.mainStats.revenue || 0).toLocaleString()} EGP`} // تنسيق العملة
          icon={<LuCircleDollarSign size={24} />}
         iconBgColor="bg-tertiary-100"  
    accentColor="bg-tertiary-200"
        />
      </div>

      {/* --- القسم الثاني: الرسم البياني وقائمة النشاطات (Flex / Grid) --- */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* الرسم البياني (سيتخذ 2/3 المساحة على الشاشات الكبيرة) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100 h-64 md:h-80 lg:h-96">
          <h2 className="text-lg md:text-xl font-medium text-primary mb-4 md:mb-6">
            Appointments Trend (Last 7 Days)
          </h2>
          <ResponsiveContainer width="100%" height="80%">
            <LineChart data={stats?.chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#004A7C"
              />
              <XAxis dataKey="date" tick={{ fill: "#004A7C"}} />
              <YAxis tick={{ fill: "#004A7C" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #004A7C",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "#004A7C", fontWeight: "bold" }}
                itemStyle={{ color: "#004A7C" }}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#004A7C"
                strokeWidth={3}
                dot={{ r: 5 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* قائمة النشاطات الأخيرة (سيتخذ 1/3 المساحة) */}
        <div className="bg-primary rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-primary-200 mb-6">
            Recent Activity
          </h2>
          {isActivityLoading ? (
            <div className="flex justify-center items-center h-full">
              <FaSpinner className="animate-spin text-2xl text-secondary/50" />
            </div>
          ) : (
            <ul className="space-y-4">
              {!activities || activities.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  No recent activity.
                </p>
              ) : (
                activities.map((activity) => {
                  const patientName =
                    activity.patients?.full_name ??
                    activity.profiles?.name ??
                    "Unknown";
                  return (
                    <li key={activity.id} className="flex items-center gap-3 bg-primary-200 text-white p-2 rounded-[8px]">
                      <div className="w-10 h-10 bg-primary-200 rounded-full flex items-center justify-center text-primary text-sm font-semibold shrink-0">
                        {patientName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-light">
                          <span className="font-bold">
                            {patientName}
                          </span>{" "}
                          booked an appointment.
                        </p>
                        <p className="text-xs text-white">
                          {new Date(activity.appointment_date).toLocaleString()}
                        </p>
                      </div>
                    </li>
                  );
                })
              )}
            </ul>
          )}
        </div>
      </div>

      {/* --- القسم الثالث: Top Doctors (أو أي إحصائية أخرى) --- */}
      <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm">
        <h2 className="text-xl font-medium text-primary mb-6">
          Top 3 Doctors by Appointments
        </h2>
        {stats?.topDoctors?.length === 0 ? (
          <p className="text-secondary text-center py-4">
            No doctors with appointments yet.
          </p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stats?.topDoctors?.map((doctor, index) => (
              <li
                key={doctor.name}
                className="flex items-center bg-neutral-100 p-4 rounded-xl shadow-inner border border-primary-100"
              >
                <span className="text-3xl font-bold text-primary mr-4">
                  {index + 1}.
                </span>
                <div>
                  <p className="text-lg font-bold text-secondary">
                    {doctor.name}
                  </p>
                  <p className="text-sm text-secondary/50">
                    {doctor.count} Appointments
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
