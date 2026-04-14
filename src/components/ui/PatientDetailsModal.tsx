import { motion, AnimatePresence } from "framer-motion";
import type{  AppointmentData, Medicine } from "../../types/types";
import { useDoctorPrescription } from "../../hooks/doctor/useDoctordPrescription"; 
import { LuHistory, LuStethoscope, LuPill,LuX } from "react-icons/lu";
import { Button } from "./Button";

interface Props {
  appointment: AppointmentData | null;
  onClose: () => void;
}

const PatientDetailsModal = ({ appointment, onClose }: Props) => {
  const { history, isLoadingHistory } = useDoctorPrescription(appointment?.patient_id);
  // تذكير مهم 
  // لا تستدعي الـ Hooks داخل شروط أو بعد Return
 

 return (
    <AnimatePresence>
      {appointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
       
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-[2px]"
          />

          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden relative z-10 flex flex-col max-h-[85vh]"
          >
            {/* Header */}
            <div className="bg-primary p-4 text-white flex justify-between items-center">
              <h3 className="text-lg font-bold flex items-center gap-2">
                Patient Medical Profile
              </h3>
              <button 
                onClick={onClose} 
                className="hover:bg-white/20 p-1 rounded-full transition-colors"
              >
                <LuX size={24} />
              </button>
            </div>

            {/* Content Container */}
            <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
              
              {/* Patient Basic Info Card */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl ">
                <div>
                  <p className="text-secondary text-md uppercase font-bold">Patient Name : <span className="text-primary font-bold">{appointment.profiles?.name}</span></p>
                </div>
                <div className="text-right">
                  <p className="text-secondary text-md uppercase font-black">Status : <span className="text-xs font-bold text-primary px-2 py-0.5 bg-white border border-primary/20 rounded-md">
                    {appointment.status.toUpperCase()}
                  </span>
                  </p>
                  
                </div>
              </div>

              {/* History Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-secondary border-b border-secondary/50 pb-2">
                  <LuHistory className="text-primary" />
                  <h4 className="font-bold">Medical History</h4>
                </div>

                {isLoadingHistory ? (
                  <div className="flex justify-center py-10">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : history && history.length > 0 ? (
                  <div className="space-y-4">
                    {history.map((record) => (
                      <motion.div 
                        layout
                        key={record.id} 
                        className="border border-gray-100 rounded-xl p-4 bg-neutral-100"
                      >
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-sm text-primary bg-white px-2 py-1 rounded shadow-sm font-medium">
                            Dr. {record.profiles?.name}
                          </span>
                          <span className="text-xs font-medium text-secondary bg-white px-2 py-1 rounded shadow-sm">
                            {record.created_at && new Date(record.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex gap-3">
                            <LuStethoscope className="text-blue-400 mt-1 shrink-0" size={16} />
                            <div>
                              <p className="text-[10px] font-bold text-secondary/50 uppercase">Diagnosis</p>
                              <p className="text-sm text-secondary">{record.diagnosis}</p>
                            </div>
                          </div>

                          <div className="flex gap-3">
                            <LuPill className="text-green-400 mt-1 shrink-0" size={16} />
                            <div>
                              <p className="text-[10px] font-bold text-secondary/50 uppercase">Medicines</p>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {record.medicines.map((med: Medicine, i: number) => (
                                  <span key={i} className="text-[11px] bg-white border border-green-100 text-green-700 px-2 py-1 rounded-lg shadow-sm">
                                    <span className="font-bold">{med.name}</span> • {med.dosage}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 text-secondary/50 bg-neutral-100 rounded-xl border-2 border-dashed border-gray-100">
                    <p className="text-sm">No previous medical records found.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-neutral-100 border-t border-secondary/50 flex justify-end">
              <Button
              variant="primary"
                onClick={onClose}
              >
                Done
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PatientDetailsModal;
