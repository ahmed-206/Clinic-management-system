import { useState, useMemo } from "react";
import { useAdminAppointments } from "../../hooks/admin/useAdminAppointments";
import { SearchBar } from "../../components/ui/SearchBar";
import { exportToExcel } from "../../utils/exportUtils";
import { Button } from "../../components/ui/Button";
import {
  formatDisplayDate,
  formatDisplayTime,
  toLocalISODate,
} from "../../utils/dateTimeFormate";
import { StatusBadge } from "../../components/ui/StatusBadge";
import type { AppointmentStatus } from "../../types/types";
import { toast } from "sonner";
import { useDashboardT, useCommonT } from "../../hooks/useT";

export const AppointmentsManagementPage = () => {
  const { appointmentsQuery, updateStatusMutation } = useAdminAppointments();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
const td = useDashboardT();
  const tc = useCommonT();
  const filteredData = useMemo(() => {
    let result = appointmentsQuery.data || [];

    // Use local date — toISOString() gives UTC which is wrong for UTC+ clinics
    const todayStr = toLocalISODate(new Date());
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = toLocalISODate(tomorrow);
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    // فلترة البحث (اسم المريض أو الدكتور)
    if (searchTerm) {
      result = result.filter(
        (a) =>
          a.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          a.patients?.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          a.doctor?.name?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // فلترة الحالة
    if (statusFilter !== "all") {
      result = result.filter((a) => a.status === statusFilter);
    }

    // فلترة التاريخ — compare local dates, not raw ISO string prefixes
    switch (dateFilter) {
      case "today":
        result = result.filter(
          (a) => toLocalISODate(a.appointment_date) === todayStr,
        );
        break;
      case "tomorrow":
        result = result.filter(
          (a) => toLocalISODate(a.appointment_date) === tomorrowStr,
        );
        break;
      case "this-week":
        result = result.filter((a) => {
          const appDate = new Date(a.appointment_date);
          return appDate >= new Date() && appDate <= nextWeek;
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
  // Final statuses that should not allow further action
  const FINAL_STATUSES: AppointmentStatus[] = [
    "completed",
    "cancelled",
    "expired",
    "no_show",
  ];

  return (
    <div className="p-4 md:p-6 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-xl md:text-2xl font-bold mb-6 text-primary">
          {td('dashboard.admin.appointmentsManagement')}
        </h1>
        <Button
        variant="primary"
          onClick={handleExportToExcel}
        >
          {td('dashboard.admin.exportToExcel')}
        </Button>
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
        <div className="overflow-x-auto">
           <table className="w-full text-start border-collapse min-w-[700]">
          <thead>
            <tr className="bg-primary text-white">
              <th className="p-4 text-sm font-semibold  text-start">{tc('patient')}</th>
              <th className="p-4 text-sm font-semibold  text-start">{tc('doctor')}</th>
              <th className="p-4 text-sm font-semibold  text-start">{tc('schedule')}</th>
              <th className="p-4 text-sm font-semibold  text-start">{tc('status')}</th>
              <th className="p-4 text-sm font-semibold  text-start">{tc('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((app) => (
              <tr key={app.id} className="shadow-sm">
                <td className="p-4">
                  <div className="font-bold text-secondary">
                    {app.patients?.full_name ?? app.patient?.name ?? "—"}
                  </div>
                  <div className="text-xs text-secondary">
                    {app.patients?.phone ?? "—"}
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-secondary/90 font-medium">
                    {app.doctor?.name}
                  </div>
                  <div className="text-[10px] bg-gray-100 inline-block px-1 rounded">
                    {app.doctor?.specialty}
                  </div>
                </td>
                <td className="p-4 text-sm text-secondary/90">
                  <div className="font-semibold">
                    {formatDisplayDate(app.appointment_date)}
                  </div>
                  <div className="text-secondary/90">
                    {formatDisplayTime(app.appointment_date)}
                  </div>
                </td>
                <td className="p-4">
                  <StatusBadge status={app.status} />
                </td>
                <td className="p-4  flex flex-nowrap gap-2">
                  {app.status === "pending" && (
                    <Button
                    variant="primary"
                      onClick={(e) => {
                        e.preventDefault();

                        updateStatusMutation.mutate({
                          id: app.id,
                          status: "confirmed",
                        });
                      }}
                    >
                      Confirm
                    </Button>
                  )}
                  {/* Hide Cancel for final statuses — cancelled/completed/expired/no_show */}
                  {!FINAL_STATUSES.includes(app.status as AppointmentStatus) && (
                    <Button variant="danger"
                      onClick={() =>
                        updateStatusMutation.mutate({
                          id: app.id,
                          status: "cancelled",
                        })
                      }
                      className=" cursor-pointer"
                    >
                      Cancel
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
       
      </div>
    </div>
  );
};
