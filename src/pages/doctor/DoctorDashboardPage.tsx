import { useAuth } from "../../hooks/useAuth";
import { useDoctorDashboard } from "../../hooks/useDoctorDashboard";
import { type AppointmentData } from "../../types/types";
import PatientDetailsModal from "../../components/ui/PatientDetailsModal";
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
    return <div className="p-8 text-center">Loading Dashboard...</div>;
  if (isError)
    return (
      <div className="p-8 text-red-500">Error fetching dashboard data.</div>
    );

  return (
    <div className="p-6 bg-white min-h-screen rounded-xl">
      <h1 className="text-2xl font-bold mb-8 text-gray-700">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-12">
        <div className="bg-white p-8 rounded-lg text-center flex flex-col justify-center shadow-lg  border border-gray-200  hover:bg-primary hover:text-white">
          <span className="text-4xl font-bold block mb-2">
            {stats?.todayCount}
          </span>
          <span className="text-lg font-semibold">Today's Appointments</span>
        </div>

        {/* Upcoming */}
        <div className="bg-white p-8 rounded-lg text-center flex flex-col justify-center shadow-lg border border-gray-200  hover:bg-primary hover:text-white">
          <span className="text-4xl font-bold block mb-2">
            {stats?.upcomingCount}
          </span>
          <span className="text-lg font-semibold">Upcoming</span>
        </div>

        {/* Canceled */}
        <div className="bg-white p-8 rounded-lg text-center flex flex-col justify-center shadow-lg  border border-gray-200  hover:bg-primary hover:text-white">
          <span className="text-4xl font-bold block mb-2">
            {stats?.cancelledCount}
          </span>
          <span className="text-lg font-semibold">Canceled</span>
        </div>

        {/* Rating - ثابت حالياً كما اتفقنا */}
        <div className="bg-white p-8 rounded-lg text-center flex flex-col justify-center shadow-lg border border-gray-200 hover:bg-primary hover:text-white ">
          <span className="text-4xl font-bold block mb-2">4.7</span>
          <span className="text-lg font-semibold">Rating</span>
        </div>
      </div>

      {/* 2. جدول المرضى القادمين (Next Patients Today) */}
      <div className="mt-12">
        <h2 className="text-xl font-bold mb-4">Next Patients Today</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
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
