import { AppointmentCard } from "../../features/patient/AppointmentCard";
import { usePatientAppointments } from "../../hooks/usePatientAppointments";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { LuCalendarX } from "react-icons/lu";

import { useState } from "react";
export const PatientAppointmentsPage = () => {
  const { data: appointments, error, isLoading } = usePatientAppointments();
  const [activeTab, setActiveTab] = useState<"upcoming" | "history">(
    "upcoming",
  );
  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  if (error)
    return (
      <div className="p-8 text-red-500 text-center">
        Error loading appointments
      </div>
    );

  const upcomingStatuses = ["pending", "confirmed", "reschedule_needed"];
  const historyStatuses = ["cancelled", "expired", "completed", "no_show"];

  const upcomingAppointments =
    appointments?.filter((app) => upcomingStatuses.includes(app.status)) || [];
  const historyAppointments =
    appointments?.filter((app) => historyStatuses.includes(app.status)) || [];

  // تحديد أي قائمة سنعرض بناءً على التبويب
  const displayedAppointments =
    activeTab === "upcoming" ? upcomingAppointments : historyAppointments;
  return (
    <div className="max-w-6xl mx-auto p-8 animate-fade-in">
     <div className="flex items-center justify-between">
       <h1 className="text-3xl font-bold text-gray-700 mb-12">
        My Appointments
      </h1>
    <div className="flex p-1.5 bg-gray-100 rounded-lg w-fit shadow-inner">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${
              activeTab === 'upcoming' 
                ? "bg-white text-primary shadow-sm scale-100" 
                : "text-gray-500 hover:text-gray-700 scale-95"
            }`}
          >
            Upcoming ({upcomingAppointments.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${
              activeTab === 'history' 
                ? "bg-white text-primary shadow-sm scale-100" 
                : "text-gray-500 hover:text-gray-700 scale-95"
            }`}
          >
            History ({historyAppointments.length})
          </button>
        </div>
     </div>
      <section>
        

        {displayedAppointments && displayedAppointments.length > 0 ? (
          <div className="space-y-4">
            {displayedAppointments.map((app) => {
              const doctorData = Array.isArray(app.doctor)
                ? app.doctor[0]
                : app.doctor;

              return (
                <AppointmentCard
                  key={app.id}
                  // نمرر نسخة من الموعد مع استبدال مصفوفة الدكتور بالكائن الأول فيها
                  appointment={{ ...app, doctor: doctorData }}
                />
              );
            })}
          </div>
        ) : (
          <div className="bg-white/50 rounded-[40px] py-20 text-center border-2 border-dashed border-gray-200 shadow-inner flex flex-col items-center justify-center">
            <div className="text-5xl mb-4">
              {activeTab === 'upcoming' ? <LuCalendarX className="text-red-500"/> : "📜"}
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">
              No {activeTab} appointments
            </h3>
            <p className="text-gray-400 max-w-xs mx-auto text-sm">
              {activeTab === 'upcoming' 
                ? "You don't have any appointments scheduled at the moment." 
                : "Your appointment history is currently empty."}
            </p>
          </div>
        )}
      </section>
    </div>
  );
};
