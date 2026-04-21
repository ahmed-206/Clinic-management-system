import { useState, useEffect, useMemo, useCallback } from "react";
import { useAuth } from "../../hooks/useAuth";
import type { AppointmentData, AppointmentStatus } from "../../types/types";
import { doctorService } from "../../api/doctor/doctorService";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { SearchBar } from "../../components/ui/SearchBar";
import PrescriptionModal from "../../features/doctor/PrescriptionModal";
import { toast } from "sonner";
import PatientDetailsModal from "../../components/ui/PatientDetailsModal";
import { Button } from "../../components/ui/Button";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { formatDisplayDate, formatDisplayTime } from "../../utils/dateTimeFormate";

// Statuses that belong in the "upcoming" tab
const UPCOMING_STATUSES: AppointmentStatus[] = [
  "pending",
  "confirmed",
  "reschedule_needed",
];
// Statuses that belong in the "past/history" tab regardless of date
const HISTORY_STATUSES: AppointmentStatus[] = [
  "completed",
  "cancelled",
  "no_show",
  "expired",
];

const DoctorAppointmentPage = () => {
  const { user } = useAuth();
  
  const [appointments, setAppointments] = useState<AppointmentData[]>([]);
  // للموعد المختار
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentData | null>(null);
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  // فلاتر البحث
  const [searchTerm, setSearchTerm] = useState("");

  const loadData = useCallback(async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const data = await doctorService.getAllAppointments(user.id);
      setAppointments(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleStatusUpdate = async (id: string, status: AppointmentStatus) => {
    try {
      await doctorService.updateStatus(id, status);
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status } : a)),
      );
    } catch (err) {
      toast.error("Failed to update status" + err);
    }
  };

  const counts = useMemo(
    () => ({
      // Use explicit status sets — date-only comparison misclassified
      // reschedule_needed, no_show, expired into the wrong tab
      upcomingAppointments: appointments.filter((app) =>
        UPCOMING_STATUSES.includes(app.status),
      ).length,

      pastAppointments: appointments.filter((app) =>
        HISTORY_STATUSES.includes(app.status),
      ).length,
    }),
    [appointments],
  );

  // مصفوفات العرض (القادمة - الارشيف)
  const filteredList = useMemo(() => {
    return appointments.filter((app) => {
      const matchesTab =
        activeTab === "upcoming"
          ? UPCOMING_STATUSES.includes(app.status)
          : HISTORY_STATUSES.includes(app.status);
          const patientName = app.patients?.full_name ?? app.profiles?.name ?? "";
      const matchesSearch = patientName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [appointments, activeTab, searchTerm]);

  if (loading)
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  return (
    <div className="p-4 md:p-6 bg-white min-h-screen rounded-xl">
      <div className="flex flex-col gap-6 mb-8 lg:flex-row lg:justify-between lg:items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-primary">My Appointments</h1>

        <div className="flex flex-col gap-4 w-full md:flex-row md:items-center lg:w-auto"> 

        
        <div className="flex bg-neutral-200 p-1 rounded-lg w-full sm:w-auto">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-md text-sm font-medium transition ${
              activeTab === "upcoming"
                ? "bg-white shadow text-primary"
                : "text-gray-700 hover:text-gray-800"
            }`}
          >
            Upcoming ({counts.upcomingAppointments})
          </button>
          <button
            onClick={() => setActiveTab("past")}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-md text-sm font-medium transition ${
              activeTab === "past"
                ? "bg-white shadow text-primary"
                : "text-gray-700 hover:text-gray-800"
            }`}
          >
            History ({counts.pastAppointments})
          </button>
        </div>
        </div>
        {/* أزرار التبويب (Tabs) */}
      </div>
<div className="relative w-full">
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            showAppointmentFilters={false}
          />
        </div>
      <div className="bg-white rounded-xl shadow overflow-hidden">
      <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
          <thead className="bg-primary text-white uppercase text-xs md:text-sm font-semibold">
            <tr>
              <th className="py-4 px-4 md:px-6">Patient</th>
              <th className="py-4 px-4 md:px-6">Date</th>
              <th className="py-4 px-4 md:px-6">Time</th>
              <th className="py-4 px-4 md:px-6 text-center">Status</th>
              <th className="py-4 px-4 md:px-6 ">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredList.length > 0 ? (
              filteredList.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50 transition">
                  <td className="py-4 px-4 md:px-6 font-medium text-secondary/70">
                    {app.patients?.full_name ?? app.profiles?.name ?? "—"}
                  </td>
                  <td className="py-4 px-4 md:px-6 text-secondary/70 text-sm">
                    {formatDisplayDate(app.appointment_date)}
                  </td>
                  <td className="py-4 px-4 md:px-6 text-primary font-semibold text-sm">
                    {formatDisplayTime(app.appointment_date)}
                  </td>
                  <td className="py-4 px-4 md:px-6 text-center">
                    <StatusBadge status={app.status} />
                  </td>
                  <td className="py-4 px-4 md:px-6 text-right">
                    
                    {/* أزرار التحكم تظهر فقط في التبويب القادم وللمواعيد غير المنتهية */}
                    {activeTab === "upcoming" ? (
                      <div className="flex flex-col sm:flex-row gap-2 justify-end items-end sm:items-center">
                        <Button
                          onClick={() => {
                            setSelectedAppointment(app); // تخزين الموعد الحالي لفتح الروشتة له
                            setIsPrescriptionModalOpen(true);
                          }}
                          variant="primary"
                          className="text-[10px] md:text-xs py-1 px-2 h-auto w-full sm:w-auto flex items-center justify-center gap-1"
                        >
                          
                          Complete & Prescribe
                        </Button>
                        <Button
                          variant="danger"
                          className="text-[10px] md:text-xs py-1 px-2 h-auto w-full sm:w-auto"
                          onClick={() =>
                            handleStatusUpdate(app.id!, "cancelled")
                          }
                        >
                          Cancel
                        </Button>
                        <button
                          onClick={() => {
                            setSelectedAppointment(app);
                            setIsDetailsModalOpen(true);
                          }}
                          className="text-primary hover:text-primary/80 font-medium text-sm transition-colors cursor-pointer"
                        >
                          View medical history
                        </button>
                      </div>
                    ) : (
                      <button className="text-gray-400 hover:text-primary">
                        View medical history
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
        <PatientDetailsModal
          appointment={isDetailsModalOpen ? selectedAppointment : null}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setSelectedAppointment(null);
          }}
        />
        {isPrescriptionModalOpen && selectedAppointment && (
          <PrescriptionModal
            appointment={selectedAppointment}
            onClose={() => {
              setIsPrescriptionModalOpen(false);
              setSelectedAppointment(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default DoctorAppointmentPage;
