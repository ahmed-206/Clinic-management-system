import { useAuth } from "../../hooks/useAuth";
import { useDoctorDashboard } from "../../hooks/useDoctorDashboard";
import { StatCard } from "../../features/doctor/StateCard";
import { type AppointmentData } from "../../types/types";
import PatientDetailsModal from "../../components/ui/PatientDetailsModal";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { LuCalendar, LuClock3, LuCircleX, LuStar, LuUsersRound } from "react-icons/lu";
import { useState } from "react";


export const DoctorDashboardPage = () => {
  const [selectedApp, setSelectedApp] = useState<AppointmentData | null>(null);
  const { user } = useAuth();
  const {
    data: stats,
    isLoading,
    isError,
  } = useDoctorDashboard(user?.id || "");

 if (isLoading)
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
        <LoadingSpinner size="lg" />
        <p className="text-gray-500 animate-pulse font-medium">Preparing your dashboard...</p>
      </div>
    );
  if (isError)
    return (
      <div className="p-8 text-center text-red-500 bg-red-50 rounded-xl border border-red-100 m-6">
        <LuCircleX className="mx-auto mb-2" />
        <p className="font-bold">Error fetching dashboard data. Please try again.</p>
      </div>
    );
  return (
    <div className="p-6 bg-white min-h-screen rounded-xl">
      <div className="flex flex-col">
        <h1 className="text-3xl font-black text-gray-800">Welcome Back,</h1>
        <p className="text-gray-500 font-medium">Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Today's Appointments" 
          value={stats?.todayCount} 
          icon={<LuClock3 className="text-primary group-hover:text-white" size={28} />}
        />
        <StatCard 
          label="Upcoming Total" 
          value={stats?.upcomingCount} 
          icon={<LuCalendar className="text-primary group-hover:text-white" size={28} />}
        />
        <StatCard 
          label="Canceled" 
          value={stats?.cancelledCount} 
          icon={<LuCircleX className="text-primary group-hover:text-white" size={28} />}
        />
        <StatCard 
          label="Doctor Rating" 
          value="4.7" 
          icon={<LuStar className="text-primary group-hover:text-white fill-primary group-hover:fill-white" size={28} />}
        />
      </div>

      {/* 2. جدول المرضى القادمين (Next Patients Today) */}
      <div className="mt-12">
      <div className="p-6 border-b border-gray-50 flex justify-between items-center">
          <div className="flex items-center gap-2">
             <h2 className="text-xl font-bold text-gray-800">Next Patients Today</h2>
             <LuUsersRound className="text-primary" size={20} />
          </div>
          <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
             Live Updates
          </span>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-primary text-white">
              <tr className="border-b-2 border-gray-200">
                <th className="py-3 px-4 font-bold">Time</th>
                <th className="py-3 px-4 font-bold">Patient</th>
                <th className="py-3 px-4 font-bold">Action</th>
              </tr>
            </thead>
            <tbody>
              {stats?.nextPatients && stats.nextPatients.length > 0 ? (
                stats.nextPatients.map((app: AppointmentData) => {
                  console.log("بيانات الموعد بالكامل:", app);
                  return (
                    <tr
                      key={app.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        {new Date(app.appointment_date).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="py-4 px-4 font-medium">
                        {app.profiles?.name || "Unknown"}
                      </td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => setSelectedApp(app)}
                          className="bg-gray-200 px-4 py-1 rounded hover:bg-gray-300 transition-colors"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={3}
                    className="py-8 text-center text-gray-500 italic"
                  >
                    No confirmed patients for today.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <PatientDetailsModal
          appointment={selectedApp}
          onClose={() => setSelectedApp(null)}
        />
      </div>
    </div>
  );
};
