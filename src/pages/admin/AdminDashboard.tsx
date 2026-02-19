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

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode; // الأيقونة
  color: string; // لون الكارت
}

const StatCard = ({ title, value, icon, color }: StatCardProps) => (
  <div
    className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center gap-4 ${color}`}
  >
    <div className="text-primary">
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500 font-medium">{title}</p>
      <h3 className="text-2xl font-bold text-gray-700">{value}</h3>
    </div>
  </div>
);

export const AdminDashboard = () => {
  const { stats, isActivityLoading, statsError, isStatsLoading } =
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
    <div className="p-8 bg-gray-50 min-h-screen rounded-xl">
      <h1 className="text-3xl font-bold text-gray-700 mb-8">Admin Dashboard</h1>
      {/* --- القسم الأول: الكروت الإحصائية الأربعة (Grid Layout) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Doctors"
          value={stats?.mainStats.doctors || 0}
          icon={<LuStethoscope size={24} />}
          color="bg-blue-50"
        />
        <StatCard
          title="Total Patients"
          value={stats?.mainStats.patients || 0}
          icon={<LuUsersRound size={24} />}
          color="bg-green-50"
        />
        <StatCard
          title="Appointments Today"
          value={stats?.mainStats.todayAppointments || 0}
          icon={<LuCalendarDays size={24} />}
          color="bg-white"
        />
        <StatCard
          title="Total Revenue"
          value={`$${(stats?.mainStats.revenue || 0).toLocaleString()}`} // تنسيق العملة
          icon={<LuCircleDollarSign size={24} />}
          color="bg-purple-50"
        />
      </div>

      {/* --- القسم الثاني: الرسم البياني وقائمة النشاطات (Flex / Grid) --- */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* الرسم البياني (سيتخذ 2/3 المساحة على الشاشات الكبيرة) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-96">
          <h2 className="text-xl font-bold text-gray-700 mb-6">
            Appointments Trend (Last 7 Days)
          </h2>
          <ResponsiveContainer width="100%" height="80%">
            <LineChart data={stats?.chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e0e0e0"
              />
              <XAxis dataKey="date" tick={{ fill: "#6b7280" }} />
              <YAxis tick={{ fill: "#6b7280" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #17B890",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "#17B890", fontWeight: "bold" }}
                itemStyle={{ color: "#555" }}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#17B890"
                strokeWidth={3}
                dot={{ r: 5 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* قائمة النشاطات الأخيرة (سيتخذ 1/3 المساحة) */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-700 mb-6">
            Recent Activity
          </h2>
          {isActivityLoading ? (
            <div className="flex justify-center items-center h-full">
              <FaSpinner className="animate-spin text-2xl text-gray-500" />
            </div>
          ) : (
            <ul className="space-y-4">
              {stats?.recentActivity?.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  No recent activity.
                </p>
              ) : (
                stats?.recentActivity?.map((activity) => (
                  <li key={activity.id} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-primary text-sm font-semibold shrink-0">
                      {activity.profiles?.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-gray-700 font-medium">
                        <span className="font-bold">
                          {activity.profiles?.name}
                        </span>{" "}
                        booked an appointment.
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(activity.created_at).toLocaleString()}
                      </p>
                    </div>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
      </div>

      {/* --- القسم الثالث: Top Doctors (أو أي إحصائية أخرى) --- */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-700 mb-6">
          Top 3 Doctors by Appointments
        </h2>
        {stats?.topDoctors?.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            No doctors with appointments yet.
          </p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stats?.topDoctors?.map((doctor, index) => (
              <li
                key={doctor.name}
                className="flex items-center bg-gray-50 p-4 rounded-xl shadow-inner"
              >
                <span className="text-3xl font-bold text-primary mr-4">
                  {index + 1}.
                </span>
                <div>
                  <p className="text-lg font-bold text-gray-700">
                    {doctor.name}
                  </p>
                  <p className="text-sm text-gray-600">
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
