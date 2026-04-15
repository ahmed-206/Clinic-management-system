import { useState } from "react";
import {type DoctorCreateInput} from "../../types/types.ts";
import { Button } from "../../components/ui/Button.tsx";
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
        <h2 className="text-xl font-bold mb-6 text-primary">Add New Doctor</h2>
        <div className="space-y-4">
          <input type="text" placeholder="Full Name" className=    "w-full h-11 rounded-xl border border-secondary/30 bg-white/5 px-4 text-secondary text-sm  focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all duration-200"
 onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          <input type="email" placeholder="Email" className=    "w-full h-11 rounded-xl border border-secondary/30 bg-white/5 px-4 text-secondary text-sm  focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all duration-200"
 onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          <input type="password" placeholder="Password" className=    "w-full h-11 rounded-xl border border-secondary/30 bg-white/5 px-4 text-secondary text-sm  focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all duration-200"
 onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
          <input type="text" placeholder="Specialty" className=    "w-full h-11 rounded-xl border border-secondary/30 bg-white/5 px-4 text-secondary text-sm  focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all duration-200"
 onChange={(e) => setFormData({ ...formData, specialty: e.target.value })} />
        </div>
        <div className="flex justify-end gap-3 mt-8">
          <Button onClick={onClose} variant="danger">Cancel</Button>
          <Button
          disabled={isPending || !formData.email || !formData.name} 
            variant="primary"
            onClick={() => onAdd(formData)}
          >
            {isPending ? "Creating..." : "Create Account"}
          </Button>
        </div>
      </div>
    </div>
  );
};