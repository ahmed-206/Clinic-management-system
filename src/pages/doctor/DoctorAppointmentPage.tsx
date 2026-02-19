import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../../hooks/useAuth";
import type { AppointmentData, AppointmentStatus } from "../../types/types";
import { doctorService } from "../../api/doctor/doctorService";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";

const DoctorAppointmentPage = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<AppointmentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const [searchTerm, setSearchTerm] = useState("");

  const loadData = async () => {
    if (!user) return;

    try {
      const data = await doctorService.getAllAppointments(user.id);
      setAppointments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleStatusUpdate = async (id: string, status: AppointmentStatus) => {
    try {
      await doctorService.updateStatus(id, status);
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status } : a)),
      );
    } catch (err) {
      alert("Failed to update status" + err);
    }
  };

  const counts = useMemo(() => (
    {
     upcomingAppointments : appointments.filter(
    (app) =>
      new Date(app.appointment_date) >= new Date() &&
      app.status !== "completed" &&
      app.status !== "cancelled",
  ).length,

   pastAppointments : appointments.filter(
    (app) =>
      new Date(app.appointment_date) < new Date() ||
      app.status === "completed" ||
      app.status === "cancelled",
  ).length
  }
  ),[appointments])

  // مصفوفات العرض (القادمة - الارشيف)
  const filteredList = useMemo(() => {
    return appointments.filter(app => {
      const isPast = new Date(app.appointment_date) < new Date() || app.status === 'completed' || app.status === 'cancelled';
      const matchesTab = activeTab === 'upcoming' ? !isPast : isPast;
      const matchesSearch = app.patient?.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [appointments, activeTab, searchTerm]);

  if (loading) return <div className="h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>;
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-700">My Appointments</h1>

        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search by patient name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
        </div>
        {/* أزرار التبويب (Tabs) */}
        <div className="flex bg-gray-200 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              activeTab === "upcoming"
                ? "bg-white shadow text-primary"
                : "text-gray-700 hover:text-gray-800"
            }`}
          >
            Upcoming ({counts.upcomingAppointments})
          </button>
          <button
            onClick={() => setActiveTab("past")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              activeTab === "past"
                ? "bg-white shadow text-primary"
                : "text-gray-700 hover:text-gray-800"
            }`}
          >
            History ({counts.pastAppointments})
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-primary text-white uppercase text-sm font-semibold">
            <tr>
              <th className="py-4 px-6">Patient</th>
              <th className="py-4 px-6">Date</th>
              <th className="py-4 px-6">Time</th>
              <th className="py-4 px-6 text-center">Status</th>
              <th className="py-4 px-6">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredList.length > 0 ? (
              filteredList.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50 transition">
                  <td className="py-4 px-6 font-medium text-gray-700">
                    {app.profiles?.name}
                  </td>
                  <td className="py-4 px-6 text-gray-600 text-sm">
                    {new Date(app.appointment_date).toLocaleDateString("en-GB")}
                  </td>
                  <td className="py-4 px-6 text-primary font-semibold text-sm">
                    {new Date(app.appointment_date).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        app.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : app.status === "cancelled"
                            ? " text-red-700"
                            : " text-yellow-700"
                      }`}
                    >
                      {app.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    {/* أزرار التحكم تظهر فقط في التبويب القادم وللمواعيد غير المنتهية */}
                    {activeTab === "upcoming" ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            handleStatusUpdate(app.id!, "completed")
                          }
                          className="bg-primary text-white px-3 py-1.5 rounded-md text-sm "
                        >
                          Complete
                        </button>
                        <button
                          onClick={() =>
                            handleStatusUpdate(app.id!, "cancelled")
                          }
                          className="border border-red-200 text-red-600 px-3 py-1.5 rounded-md text-sm hover:bg-red-50"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button className="text-gray-400 hover:text-primary">
                        View Details
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="py-10 text-center text-gray-400 italic"
                >
                  No {activeTab} appointments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DoctorAppointmentPage;
