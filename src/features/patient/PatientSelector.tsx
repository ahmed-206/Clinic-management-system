// features/patient/PatientSelector.tsx
import { LuPhone, LuUserRound } from "react-icons/lu";
import { FaTransgender } from "react-icons/fa";
import type { Patient } from "../../types/types";

interface NewPatientForm {
  full_name: string;
  phone: string;
  gender: string;
  is_self: boolean;
}

interface Props {
  patients: Patient[];
  selectedPatientId: string | null;
  showNewPatientForm: boolean;
  newPatient: NewPatientForm;
  isCreating: boolean;
  isUpdating: boolean;
  isCreatingPatient: boolean;
  rescheduleId: string | null;
  onSelectPatient: (id: string) => void;
  onShowNewForm: () => void;
  onNewPatientChange: (
    field: keyof NewPatientForm,
    value: string | boolean,
  ) => void;
  onConfirm: () => void;
}

export const PatientSelector = ({
  patients,
  selectedPatientId,
  showNewPatientForm,
  newPatient,
  isCreating,
  isUpdating,
  isCreatingPatient,
  rescheduleId,
  onSelectPatient,
  onShowNewForm,
  onNewPatientChange,
  onConfirm,
}: Props) => {
  return (
    <div className="animate-in fade-in slide-in-from-top-4 duration-500 bg-white border border-blue-100 rounded-2xl p-4 md:p-6 space-y-4">
      <h3 className="font-bold text-secondary text-lg">
        Who is this appointment for?
      </h3>
      <p className="text-sm text-secondary/60">
        You can book for yourself or a family member.
      </p>

      {/* قائمة الـ patients الموجودين */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {patients.map((p) => (
          <button
            key={p.id}
            onClick={() => onSelectPatient(p.id)}
            className={`text-left p-3 rounded-xl border transition-all ${
              selectedPatientId === p.id
                ? "border-primary bg-white ring-2 ring-primary/20"
                : "border-gray-200 bg-white hover:border-primary/40"
            }`}
          >
            <p className="font-semibold text-sm text-secondary">
              {p.full_name}
            </p>
            <p className="text-xs text-gray-400">{p.phone}</p>
            {p.is_self && (
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full mt-1 inline-block">
                Myself
              </span>
            )}
          </button>
        ))}

        {/* زرار إضافة patient جديد */}
        <button
          onClick={onShowNewForm}
          className={`text-left p-3 rounded-xl border-2 border-dashed transition-all ${
            showNewPatientForm
              ? "border-primary bg-white"
              : "border-gray-300 hover:border-primary/40"
          }`}
        >
          <p className="font-semibold text-sm text-primary">
            + Add new patient
          </p>
          <p className="text-xs text-gray-400">Family member or someone else</p>
        </button>
      </div>

      {/* فورم الـ patient الجديد */}
      {showNewPatientForm && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-blue-100">
          <div className="flex items-center gap-3 border-b border-secondary/30 py-1 focus-within:border-primary transition-colors">
            <LuUserRound className="text-secondary shrink-0" size={20} />
            <input
              type="text"
              value={newPatient.full_name}
              onChange={(e) => onNewPatientChange("full_name", e.target.value)}
              placeholder="Enter full patient name"
              className="w-full bg-transparent p-2 outline-none text-secondary placeholder:text-secondary/40"
            />
          </div>
          <div className="flex items-center gap-3 border-b border-secondary/30 py-1 focus-within:border-primary transition-colors">
            <LuPhone className="text-secondary shrink-0" size={20} />
            <input
              type="tel"
              value={newPatient.phone}
              onChange={(e) => onNewPatientChange("phone", e.target.value)}
              placeholder="Mobile number"
              className="w-full bg-transparent p-2 outline-none text-secondary placeholder:text-secondary/40"
            />
          </div>
          <div className="flex items-center gap-3 border-b border-secondary/30 py-1 focus-within:border-primary transition-colors">
           <FaTransgender className="text-secondary shrink-0" size={20}/>
            <select
              value={newPatient.gender}
              onChange={(e) => onNewPatientChange("gender", e.target.value)}
              className="w-full bg-transparent p-2 outline-none text-secondary placeholder:text-secondary/40"
            >
              <option value="" className="text-secondary">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div className="flex items-center gap-2 pt-5">
            <input
              type="checkbox"
              id="is_self"
              checked={newPatient.is_self}
              onChange={(e) => onNewPatientChange("is_self", e.target.checked)}
              className="w-4 h-4 accent-primary"
            />
            <label htmlFor="is_self" className="text-sm text-secondary">
              This is me (account holder)
            </label>
          </div>
        </div>
      )}

      {/* زرار الـ confirm */}
      <div className="pt-4 border-t border-blue-100">
        <button
          onClick={onConfirm}
          disabled={
            (!selectedPatientId && !showNewPatientForm) ||
            isCreating ||
            isUpdating ||
            isCreatingPatient
          }
          className="w-full py-4 text-lg font-bold bg-primary text-white rounded-2xl hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
        >
          {isCreating || isUpdating || isCreatingPatient
            ? "Processing..."
            : rescheduleId
              ? "Confirm New Time"
              : "Confirm My Appointment"}
        </button>
      </div>
    </div>
  );
};
