import { useState } from "react";
import {type DoctorCreateInput} from "../../types/types.ts";
interface AddDoctorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: DoctorCreateInput) => void;
  isPending: boolean;
}
export const AddDoctorModal = ({ isOpen, onClose, onAdd , isPending}: AddDoctorModalProps) => {
  const [formData, setFormData] = useState<DoctorCreateInput>({
    name: "",
    email: "",
    password: "",
    specialty: ""
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
        <h2 className="text-xl font-bold mb-6 text-gray-700">Add New Doctor</h2>
        <div className="space-y-4">
          <input type="text" placeholder="Full Name" className="w-full border p-3 rounded-xl outline-none" onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          <input type="email" placeholder="Email" className="w-full border p-3 rounded-xl outline-none" onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          <input type="password" placeholder="Password" className="w-full border p-3 rounded-xl outline-none" onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
          <input type="text" placeholder="Specialty" className="w-full border p-3 rounded-xl outline-none" onChange={(e) => setFormData({ ...formData, specialty: e.target.value })} />
        </div>
        <div className="flex justify-end gap-3 mt-8">
          <button onClick={onClose} className="px-6 py-2 text-gray-500 hover:text-red-500 cursor-pointer">Cancel</button>
          <button
          disabled={isPending || !formData.email || !formData.name} 
            className="px-6 py-2 bg-primary text-white rounded-xl cursor-pointer"
            onClick={() => onAdd(formData)}
          >
            {isPending ? "Creating..." : "Create Account"}
          </button>
        </div>
      </div>
    </div>
  );
};