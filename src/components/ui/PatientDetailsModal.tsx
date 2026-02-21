import { type AppointmentData } from "../../types/types";

interface Props {
  appointment: AppointmentData | null;
  onClose: () => void;
}

const PatientDetailsModal = ({ appointment, onClose }: Props) => {
  if (!appointment) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden transform transition-all scale-100">
        {/* Header */}
        <div className="bg-primary p-4 text-white flex justify-between items-center">
          <h3 className="text-lg font-bold">Patient Information</h3>
          <button onClick={onClose} className="hover:text-red-500  text-2xl ">
            &times;
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="flex flex-col border-b pb-2">
            <span className="text-gray-500 text-sm">Full Name</span>
            <span className="text-gray-900 font-semibold text-lg">
              {appointment.profiles?.name || "Unknown"}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <span className="text-gray-500 text-sm">Status</span>
              <span
                className={`font-bold ${
                  appointment.status === "confirmed"
                    ? "text-primary"
                    : "text-yellow-600"
                }`}
              >
                {appointment.status.toUpperCase()}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500 text-sm">Patient ID</span>
              <span className="text-xs text-gray-400 truncate">
                {appointment.patient_id}
              </span>
            </div>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-xs">Date & Time</p>
              <p className="font-medium">
                {new Date(appointment.appointment_date).toLocaleDateString()}
              </p>
            </div>
            <p className="font-medium text-primary">
              {new Date(appointment.appointment_date).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 text-right">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:scale-105 transition-colors shadow-md cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientDetailsModal;
