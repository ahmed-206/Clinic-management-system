import { useState, useEffect } from "react";
import { useSettings } from "../../../../hooks/admin/useSettings";

export const GeneralSettings = () => {
  const { isLoading, isUpdating, settings, updateSettings } = useSettings();
  const [formData, setFormData] = useState({
    clinic_name: "",
    clinic_email: "",
    clinic_phone: ""
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        clinic_name: settings.clinic_name || "",
        clinic_email: settings.clinic_email || "",
        clinic_phone: settings.clinic_phone || "",
      });
    }
  }, [settings]);

  if (isLoading) return <div>Loading settings...</div>;
  return (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-xl font-bold text-gray-700">Clinic Profile</h2>
      <div className="grid grid-cols-1 gap-6 max-w-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Clinic Name
          </label>
          <input
            type="text"
            value={formData.clinic_name}
            onChange={(e) =>
              setFormData({ ...formData, clinic_name: e.target.value })
            }
           className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
            placeholder="e.g. Hope Dental Clinic"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Clinic Email
          </label>
          <input
            type="email" 
            value={formData.clinic_email}
            onChange={(e) => setFormData({...formData, clinic_email: e.target.value})}
            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input 
            type="text" 
            value={formData.clinic_phone}
            onChange={(e) => setFormData({...formData, clinic_phone: e.target.value})}
           className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
          />
        </div>
      </div>
      <button
        onClick={() => updateSettings(formData)}
        disabled={isUpdating}
        className="bg-primary text-white px-6 py-2 rounded-xl cursor-pointer"
      >
        {isUpdating ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
};
