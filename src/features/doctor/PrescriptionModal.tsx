import { useState } from 'react';
import type { AppointmentData, Medicine } from '../../types/types';
import { useDoctorPrescription } from '../../hooks/doctor/useDoctordPrescription';
import { FaPlus, FaTrash, FaTimes } from 'react-icons/fa';

interface Props {
  appointment: AppointmentData;
  onClose: () => void;
}

const PrescriptionModal = ({ appointment, onClose }: Props) => {
    const [diagnosis, setDiagnosis] = useState('');
  const [medicines, setMedicines] = useState<Medicine[]>([
    { name: '', dosage: '', frequency: '', duration: '' }
  ]);
  const [notes, setNotes] = useState('');

  const { savePrescription, isSaving } = useDoctorPrescription(appointment.patient_id, onClose);

  const addMedicineField = () => {
    setMedicines([...medicines, { name: '', dosage: '', frequency: '', duration: '' }]);
  };

  const removeMedicineField = (index: number) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const handleMedicineChange = (index: number, field: keyof Medicine, value: string) => {
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
      notes
    };
    savePrescription(payload);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-800">Write Prescription</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500"><FaTimes /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Patient Info Summary */}
          <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800">
            Patient: <strong>{appointment.profiles?.name}</strong> | Date: {new Date().toLocaleDateString()}
          </div>

          {/* Diagnosis */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Diagnosis</label>
            <textarea 
              required
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-primary outline-none"
              rows={2}
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              placeholder="Enter patient diagnosis..."
            />
          </div>

          {/* Medicines Dynamic List */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-700">Medicines</label>
              <button 
                type="button" 
                onClick={addMedicineField}
                className="text-xs bg-green-500 text-white px-2 py-1 rounded flex items-center gap-1 hover:bg-green-600"
              >
                <FaPlus /> Add Medicine
              </button>
            </div>
            
            <div className="space-y-3">
              {medicines.map((med, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 p-3 border rounded-lg bg-gray-50 relative">
                  <div className="col-span-5">
                    <input 
                      placeholder="Medicine Name"
                      className="w-full text-sm border p-1.5 rounded"
                      value={med.name}
                      onChange={(e) => handleMedicineChange(index, 'name', e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-span-3">
                    <input 
                      placeholder="Dosage"
                      className="w-full text-sm border p-1.5 rounded"
                      value={med.dosage}
                      onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)}
                    />
                  </div>
                  <div className="col-span-3">
                    <input 
                      placeholder="Duration"
                      className="w-full text-sm border p-1.5 rounded"
                      value={med.duration}
                      onChange={(e) => handleMedicineChange(index, 'duration', e.target.value)}
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
            <textarea 
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-primary outline-none"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSaving}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:bg-gray-400"
            >
              {isSaving ? 'Saving...' : 'Save & Complete Appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


export default PrescriptionModal;