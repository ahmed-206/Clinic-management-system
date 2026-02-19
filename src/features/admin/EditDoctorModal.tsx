import { useState, useEffect } from "react";
import {type UserProfile } from "../../types/types";

interface EditDoctorModalProps {
  doctor: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, data: Partial<UserProfile>) => void;
  isUpdating: boolean;
}

export const EditDoctorModal = ({ 
  doctor, 
  isOpen, 
  onClose, 
  onSave, 
  isUpdating 
}: EditDoctorModalProps) => {
  // استخدام State داخلية للتحكم في الحقول داخل المودال
  const [formData, setFormData] = useState({
    name: doctor.name,
    specialty: doctor.specialty || "",
    price_per_session: doctor.price_per_session || 0,
  });

  // تحديث البيانات لو تغير الدكتور المختار
  useEffect(() => {
    setFormData({
      name: doctor.name,
      specialty: doctor.specialty || "",
      price_per_session: doctor.price_per_session || 0,
    });
  }, [doctor]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
        <h2 className="text-xl font-bold mb-6 text-gray-800">Edit Profile: {doctor.name}</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input 
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#8B7E7E]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Specialty</label>
            <input 
              type="text" 
              value={formData.specialty}
              onChange={(e) => setFormData({...formData, specialty: e.target.value})}
              className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#8B7E7E]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price per Session</label>
            <input 
              type="number" 
              value={formData.price_per_session}
              onChange={(e) => setFormData({...formData, price_per_session: Number(e.target.value)})}
              className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#8B7E7E]"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <button 
            onClick={onClose}
            className="px-6 py-2 text-gray-500 hover:bg-gray-100 rounded-xl transition"
          >
            Cancel
          </button>
          <button 
            disabled={isUpdating}
            className="px-6 py-2 bg-[#8B7E7E] text-white rounded-xl hover:bg-[#6D6161] transition disabled:opacity-50"
            onClick={() => onSave(doctor.id, formData)}
          >
            {isUpdating ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};