import { useState} from "react";
import { useSettings } from "../../../../hooks/admin/useSettings";
import type { SettingsFormsProps, ClinicSettings } from "../../../../types/types";
import { LoadingSpinner } from "../../../../components/ui/LoadingSpinner";
import { Button } from "../../../../components/ui/Button";

const GeneralForm = ({ settings, updateSettings, isUpdating }: SettingsFormsProps) => {
  const [formData, setFormData] = useState({
    clinic_name: settings.clinic_name || "",
    clinic_email: settings.clinic_email || "",
    clinic_phone: settings.clinic_phone || "",
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-lg md:text-xl font-bold text-secondary">Clinic Profile</h2>
      <div className="grid grid-cols-1 gap-4 md:gap-6 max-w-lg">
        <div>
          <label htmlFor="clinic_name" className="block text-sm font-medium text-secondary/80 mb-2">Clinic Name</label>
          <input
          id="clinic_name"
            type="text"
            value={formData.clinic_name}
            onChange={(e) => setFormData({ ...formData, clinic_name: e.target.value })}
            className="w-full p-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
          />
        </div>
        <div>
          <label htmlFor="clinic_email" className="block text-sm font-medium text-secondary/80 mb-2">Clinic Email</label>
          <input
          id="clinic_email"
            type="email" 
            value={formData.clinic_email || ""}
            onChange={(e) => setFormData({...formData, clinic_email: e.target.value})}
            className="w-full p-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
          />
        </div>
        <div>
          <label htmlFor="clinic_phone" className="block text-sm font-medium text-secondary/80 mb-2">Phone Number</label>
          <input 
          id="clinic_phone"
            type="text" 
            value={formData.clinic_phone || ""}
            onChange={(e) => setFormData({...formData, clinic_phone: e.target.value})}
            className="w-full p-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
          />
        </div>
      </div>
      <Button
      variant="primary"
        onClick={() => updateSettings(formData)}
        disabled={isUpdating}
        className="w-full md:w-auto"
      >
        {isUpdating ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
};
export const GeneralSettings = () => {
  const { isLoading, isUpdating, settings, updateSettings } = useSettings();
  
  

      if(isLoading) return <div className="flex justify-center items-center h-screen bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>;
      if (!settings) return null;
  return (
    <GeneralForm 
      key={settings.id} 
      settings={settings as ClinicSettings} 
      updateSettings={updateSettings} 
      isUpdating={isUpdating} 
    />
  );
};
