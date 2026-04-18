import { useState } from "react";
import type { AppointmentData, Medicine } from "../../types/types";
import { useDoctorPrescription } from "../../hooks/doctor/useDoctordPrescription";
import { FaPlus, FaTrash, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Button } from "../../components/ui/Button";

interface Props {
  appointment: AppointmentData;
  onClose: () => void;
}

const PrescriptionModal = ({ appointment, onClose }: Props) => {
  const [diagnosis, setDiagnosis] = useState("");
  const [medicines, setMedicines] = useState<Medicine[]>([
    { name: "", dosage: "", frequency: "", duration: "" },
  ]);
  const [notes, setNotes] = useState("");

  const { savePrescription, isSaving } = useDoctorPrescription(
    appointment.patient_id,
    onClose,
  );

  const addMedicineField = () => {
    setMedicines([
      ...medicines,
      { name: "", dosage: "", frequency: "", duration: "" },
    ]);
  };

  const removeMedicineField = (index: number) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const handleMedicineChange = (
    index: number,
    field: keyof Medicine,
    value: string,
  ) => {
    const newMedicines = [...medicines];
    newMedicines[index][field] = value;
    setMedicines(newMedicines);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      appointment_id: appointment.id!,
      patient_id: appointment.patient_id,
      doctor_id: appointment.doctor_id,
      diagnosis,
      medicines,
      notes,
    };
    savePrescription(payload);
  };

  const backdropVariants : Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants : Variants = {
    hidden: {
      opacity: 0,
      scale: 0.9,
      y: 20,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: 20,
      transition: { duration: 0.2, ease: "easeIn" },
    },
  };
  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <motion.div
          className="fixed inset-0 bg-black/50"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={backdropVariants}
          onClick={onClose}
        />
        <motion.div
          className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-fit overflow-hidden relative z-10"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={modalVariants}
        >
          <div className="flex justify-between items-center p-4 border-b sticky top-0 z-10 text-white bg-primary">
            <h2 className="text-xl font-bold">Write Prescription</h2>
            <button onClick={onClose} className="text-white hover:text-red-500">
              <FaTimes />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            {/* Patient Info Summary */}
            <div className="bg-neutral-200 p-3 rounded-lg text-sm text-primary flex justify-between">
              <span>
                Patient: <strong>{appointment.profiles?.name}</strong>
              </span>
              <span>Date: {new Date().toLocaleDateString()}</span>
            </div>

            {/* Diagnosis */}
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">
                Diagnosis
              </label>
              <textarea
                required
                className="w-full   bg-neutral-200 rounded-lg p-2 focus:ring-2 focus:ring-primary outline-none"
                rows={2}
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                placeholder="Enter patient diagnosis..."
              />
            </div>

            {/* Medicines Dynamic List */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-secondary">
                  Medicines
                </label>
                <button
                  type="button"
                  onClick={addMedicineField}
                  className="text-xs bg-primary text-white px-2 py-1 rounded flex items-center gap-1 "
                >
                  <FaPlus /> Add Medicine
                </button>
              </div>

              <div className="space-y-3">
                {medicines.map((med, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-12 gap-2 p-3  rounded-lg bg-neutral-200 relative focus:ring-2 focus:ring-primary outline-none"
                  >
                    <div className="col-span-5">
                      <input
                        placeholder="Medicine Name"
                        className="w-full text-sm border border-secondary/50 focus:ring-2 focus:ring-primary outline-none p-1.5 rounded"
                        value={med.name}
                        onChange={(e) =>
                          handleMedicineChange(index, "name", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div className="col-span-3">
                      <input
                        placeholder="Dosage"
                        className="w-full text-sm border border-secondary/50 p-1.5 rounded focus:ring-2 focus:ring-primary outline-none"
                        value={med.dosage}
                        onChange={(e) =>
                          handleMedicineChange(index, "dosage", e.target.value)
                        }
                      />
                    </div>
                    <div className="col-span-3">
                      <input
                        placeholder="Duration"
                        className="w-full text-sm border border-secondary/50 focus:ring-2 focus:ring-primary outline-none p-1.5 rounded"
                        value={med.duration}
                        onChange={(e) =>
                          handleMedicineChange(
                            index,
                            "duration",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                    <div className="col-span-1 flex items-center justify-center">
                      {medicines.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeMedicineField(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTrash size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">
                Additional Notes
              </label>
              <textarea
                className="w-full bg-neutral-200 rounded-lg p-2 focus:ring-2 focus:ring-primary outline-none"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-primary/50">
              <Button
              variant="danger"
                type="button"
                onClick={onClose}
               
              >
                Cancel
              </Button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:bg-gray-400"
              >
                {isSaving ? "Saving..." : "Save & Complete Appointment"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PrescriptionModal;
