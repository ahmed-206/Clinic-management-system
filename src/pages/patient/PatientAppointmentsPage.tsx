import { AppointmentCard } from "../../features/patient/AppointmentCard";
import { usePatientAppointments } from "../../hooks/usePatientAppointments";
export const PatientAppointmentsPage = () => {
  const { data: appointments, error, isLoading } = usePatientAppointments();
  if (isLoading)
    return <div className="p-8 text-center">Loading your appointments...</div>;
  if (error)
    return (
      <div className="p-8 text-red-500 text-center">
        Error loading appointments
      </div>
    );
  return (
    <div className="max-w-6xl mx-auto p-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-gray-700 mb-12">
        My Appointments
      </h1>

      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Upcoming</h2>

        {appointments && appointments.length > 0 ? (
          <div className="space-y-4">
            {appointments.map((app) => {
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
          <div className="bg-gray-50 rounded-[30px] p-12 text-center border-2 border-dashed border-gray-200">
            <p className="text-gray-500 text-lg">
              No upcoming appointments found.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};
