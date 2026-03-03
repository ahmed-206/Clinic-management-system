import { useSettings } from "../../../../hooks/admin/useSettings";
import { LoadingSpinner } from "../../../../components/ui/LoadingSpinner";
import type {  ClinicSettings, SettingsFormsProps } from "../../../../types/types";
import { useState} from "react";


const FinancialForm = ({ settings, updateSettings, isUpdating }: SettingsFormsProps) => {
  const [formData, setFormData] = useState({
    vat_percentage: settings.vat_percentage || 0,
    service_fee: settings.service_fee || 0,
    currency: settings.currency || "EGP",
  });

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-700">Pricing & Taxes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 border border-blue-100 bg-blue-50 rounded-2xl">
          <label htmlFor="clinic_vat" className="block text-sm font-semibold text-primary mb-2">
            Value Added Tax (VAT) %
          </label>
          <input
          id="clinic_vat"
            type="number"
            value={formData.vat_percentage}
            onChange={(e) => setFormData({...formData, vat_percentage: parseFloat(e.target.value) || 0})}
            className="w-full p-3 border border-blue-200 rounded-xl outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="p-4 border border-green-100 bg-green-50 rounded-2xl">
          <label htmlFor="clinic_fee" className="block text-sm font-semibold text-green-800 mb-2">
            Service Fee ({formData.currency})
          </label>
          <input
          id="clinic_fee"
            type="number" 
            value={formData.service_fee}
            onChange={(e) => setFormData({...formData, service_fee: parseFloat(e.target.value) || 0})}
            className="w-full p-3 border border-green-200 rounded-xl outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
      <button 
        onClick={() => updateSettings(formData)}
        disabled={isUpdating}
        className="bg-primary text-white px-10 py-3 rounded-xl font-bold disabled:bg-gray-400 transition-all shadow-lg cursor-pointer"
      >
        {isUpdating ? "Processing..." : "Save Financial Rules"}
      </button>
    </div>
  );
};
export const FinancialSettings = () => {
  const { settings, isLoading, updateSettings, isUpdating } = useSettings();


 

  if (isLoading) return  <div className="flex justify-center items-center h-screen bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>;

  if (!settings) return null;
  return (
    <FinancialForm 
      key={settings.id} 
      settings={settings as ClinicSettings} 
      updateSettings={updateSettings} 
      isUpdating={isUpdating} 
    />
  );
};
// parseFloat نضمن أن البيانات تذهب كأرقام صحيحة
