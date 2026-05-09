import { useAuth } from "../../hooks/useAuth";
import { useDoctorDashboard } from "../../hooks/useDoctorDashboard";
import { StatCard } from "../../features/doctor/StateCard";
import { type AppointmentData } from "../../types/types";
import PatientDetailsModal from "../../components/ui/PatientDetailsModal";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { LuCalendar, LuClock3, LuCircleX, LuStar, LuUsersRound } from "react-icons/lu";
import { useState } from "react";
import { useDashboardT,useCommonT } from "../../hooks/useT";

export const DoctorDashboardPage = () => {
  const td = useDashboardT();
const tc = useCommonT();
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
    <div className="p-4 md:p-8 bg-white min-h-screen rounded-xl">
      <div className="flex flex-col mb-2">
        <h1 className="text-2xl md:text-3xl font-bold text-primary">{td('dashboard.doctor.welcomeBack')}</h1>
        <p className="text-secondary font-medium">{td('dashboard.doctor.whatsHappening')}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard 
          label={td('dashboard.doctor.todaysAppointments')}
          value={stats?.todayCount} 
          icon={<LuClock3 className="text-primary group-hover:text-white" size={28} />}
        />
        <StatCard 
          label={td('dashboard.doctor.upcomingTotal')} 
          value={stats?.upcomingCount} 
          icon={<LuCalendar className="text-primary group-hover:text-white" size={28} />}
        />
        <StatCard 
          label={td('dashboard.doctor.canceled')}
          value={stats?.cancelledCount} 
          icon={<LuCircleX className="text-primary group-hover:text-white" size={28} />}
        />
        <StatCard 
          label={td('dashboard.doctor.doctorRating')}
          value="4.7" 
          icon={<LuStar className="text-primary group-hover:text-white fill-primary group-hover:fill-white" size={28} />}
        />
      </div>

      {/* 2. جدول المرضى القادمين (Next Patients Today) */}
      <div className="mt-10 md:mt-12">
      <div className="p-6 border-b border-gray-50 flex justify-between items-center">
          <div className="flex items-center gap-2">
             <h2 className="text-lg md:text-xl font-bold text-secondary">{td('dashboard.doctor.nextPatients')}</h2>
             <LuUsersRound className="text-primary" size={20} />
          </div>
          <span className="text-xs font-bold text-primary bg-primary-100 px-3 py-1 rounded-full">
             {td('dashboard.doctor.liveUpdates')}
          </span>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
          <table className="w-full text-start border-collapse min-w-[500px]">
            <thead className="bg-primary text-white">
              <tr className="border-b-2 border-gray-200">
                <th className="py-3 px-4 font-bold text-start">{tc('time')}</th>
                <th className="py-3 px-4 font-bold text-start">{tc('patient')}</th>
                <th className="py-3 px-4 font-bold text-start">{tc('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {stats?.nextPatients && stats.nextPatients.length > 0 ? (
                stats.nextPatients.map((app: AppointmentData) => {
                  
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
                        {app.patients?.full_name || "Unknown"}
                      </td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => setSelectedApp(app)}
                          className="text-primary hover:text-primary/80 font-medium text-sm transition-colors cursor-pointer"
                        >
                          {td('dashboard.doctor.viewDetails')}
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
                   {td('dashboard.doctor.noConfirmedPatients')}
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
