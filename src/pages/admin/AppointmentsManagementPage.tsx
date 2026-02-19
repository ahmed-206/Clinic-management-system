import { useState, useMemo } from "react";
import { useAdminAppointments } from "../../hooks/admin/useAdminAppointments";
import { SearchBar } from "../../components/ui/SearchBar";
import { exportToExcel } from "../../utils/exportUtils";
import {
  formatDisplayDate,
  formatDisplayTime,
} from "../../utils/dateTimeFormate";
import { toast } from "sonner";
export const AppointmentsManagementPage = () => {
  const { appointmentsQuery, updateStatusMutation } = useAdminAppointments();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  const filteredData = useMemo(() => {
    let result = appointmentsQuery.data || [];

    // إعداد التواريخ للمقارنة
    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];

    const tomorrow = new Date();
    tomorrow.setDate(now.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split("T")[0];

    const nextWeek = new Date();
    nextWeek.setDate(now.getDate() + 7);

    // فلترة البحث (اسم المريض أو الدكتور)
    if (searchTerm) {
      result = result.filter(
        (a) =>
          a.patient?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          a.doctor?.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // فلترة الحالة
    if (statusFilter !== "all") {
      result = result.filter((a) => a.status === statusFilter);
    }

    // فلترة التاريخ
    switch (dateFilter) {
      case "today":
        result = result.filter((a) => a.appointment_date === todayStr);
        break;
      case "tomorrow":
        result = result.filter((a) => a.appointment_date === tomorrowStr);
        break;
      case "this-week":
        result = result.filter((a) => {
          const appDate = new Date(a.appointment_date);
          return appDate >= now && appDate <= nextWeek;
        });
        break;
      default:
        break;
    }

    return result;
  }, [searchTerm, statusFilter, dateFilter, appointmentsQuery.data]);

  const handleExportToExcel = () => {
    if (filteredData.length === 0) {
      toast.error("No data to export!");
      return;
    }
    exportToExcel(filteredData, "Clinic_Appointments");
  };
  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: "text-amber-700",
      confirmed: "text-primary",
      cancelled: " text-red-500",
      reschedule_needed: " text-red-700 animate-pulse",
    };
    return styles[status] || "bg-blue-100 text-blue-700";
  };

  return (
    <div className="p-6 bg-[#FAF9F9] min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-700">
          Appointments Mangement
        </h1>
        <button
          onClick={handleExportToExcel}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl hover:scale-105 transition shadow-sm font-medium cursor-pointer"
        >
          Export to Excel
        </button>
      </div>
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        showAppointmentFilters={true}
        statusAppointmentFilter={statusFilter}
        onStatusAppointmentFilter={setStatusFilter}
        dateFilter={dateFilter}
        onDateChange={setDateFilter}
      />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-primary text-white">
              <th className="p-4 text-sm font-semibold ">Patient</th>
              <th className="p-4 text-sm font-semibold ">Doctor</th>
              <th className="p-4 text-sm font-semibold ">Schedule</th>
              <th className="p-4 text-sm font-semibold ">Status</th>
              <th className="p-4 text-sm font-semibold ">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((app) => (
              <tr key={app.id} className="shadow-sm">
                <td className="p-4">
                  <div className="font-bold text-gray-800">
                    {app.patient?.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {app.patient?.email}
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-[#8B7E7E] font-medium">
                    {app.doctor?.name}
                  </div>
                  <div className="text-[10px] bg-gray-100 inline-block px-1 rounded">
                    {app.doctor?.specialty}
                  </div>
                </td>
                <td className="p-4 text-sm text-gray-700">
                  <div className="font-semibold">
                    {formatDisplayDate(app.appointment_date)}
                  </div>
                  <div className="text-gray-500">
                    {formatDisplayTime(app.appointment_date)}
                  </div>
                </td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusBadge(app.status)}`}
                  >
                    {app.status.replace("_", " ")}
                  </span>
                </td>
                <td className="p-4 flex gap-2">
                  {app.status === "pending" && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();

                        updateStatusMutation.mutate({
                          id: app.id,
                          status: "confirmed",
                        });
                      }}
                      className="bg-primary text-white px-3 py-1 rounded-lg text-xs transition cursor-pointer"
                    >
                      Confirm
                    </button>
                  )}
                  <button
                    onClick={() =>
                      updateStatusMutation.mutate({
                        id: app.id,
                        status: "cancelled",
                      })
                    }
                    className="bg-white border border-red-200 text-red-500 px-3 py-1 rounded-lg text-xs hover:bg-red-50 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
