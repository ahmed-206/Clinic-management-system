import { useState } from "react";
import { type UserProfile } from "../../types/types";
import { Button } from "../../components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
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
  isUpdating,
}: EditDoctorModalProps) => {
  // استخدام State داخلية للتحكم في الحقول داخل المودال
  const [formData, setFormData] = useState({
    name: doctor.name,
    specialty: doctor.specialty || "",
    price_per_session: doctor.price_per_session || 0,
  });

  // استخدام Key لتجنب rerender
  // // تحديث البيانات لو تغير الدكتور المختار
  // useEffect(() => {
  //   setFormData({
  //     name: doctor.name,
  //     specialty: doctor.specialty || "",
  //     price_per_session: doctor.price_per_session || 0,
  //   });
  // }, [doctor]);

  if (!isOpen) return null;
  const inputStyle =
    "w-full h-11 rounded-xl border border-secondary/30 bg-white/5 px-4 text-secondary text-sm placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all duration-200";

  const labelStyle =
    "text-xs font-medium text-secondary uppercase tracking-widest";
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden">
        <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose} // إغلاق عند الضغط على الخلفية
        className="absolute inset-0 bg-neutral-800/10 backdrop-blur-sm"
      />
        <motion.div
         initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ 
          type: "spring", 
          damping: 25, 
          stiffness: 300,
          duration: 0.3 
        }}
        className="relative bg-white rounded-3xl p-8 w-full max-w-md shadow-xl z-10"
        >
          <h2 className="text-xl font-bold mb-6 text-secondary">
            Edit Profile: {doctor.name}
          </h2>

          <div className="space-y-4">
            <div>
              <label htmlFor="full_name" className={labelStyle}>
                Full Name
              </label>
              <input
                id="full_name"
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className={inputStyle}
              />
            </div>

            <div>
              <label htmlFor="specialty" className={labelStyle}>
                Specialty
              </label>
              <input
                id="specialty"
                type="text"
                value={formData.specialty}
                onChange={(e) =>
                  setFormData({ ...formData, specialty: e.target.value })
                }
                className={inputStyle}
              />
            </div>

            <div>
              <label htmlFor="price_per_session" className={labelStyle}>
                Price per Session
              </label>
              <input
                id="price_per_session"
                type="number"
                value={formData.price_per_session}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price_per_session: Number(e.target.value),
                  })
                }
                className={inputStyle}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <Button onClick={onClose} variant="danger">
              Cancel
            </Button>
            <Button
              disabled={isUpdating}
              variant="primary"
              isLoading={isUpdating}
              onClick={() => onSave(doctor.id, formData)}
            >
              {isUpdating ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
