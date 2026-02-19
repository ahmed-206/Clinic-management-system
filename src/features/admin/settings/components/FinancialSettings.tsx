import { useSettings } from "../../../../hooks/admin/useSettings";
import { useState, useEffect } from "react";
export const FinancialSettings = () => {
  const { settings, isLoading, updateSettings, isUpdating } = useSettings();

  const [formData, setFormData] = useState({
    vat_percentage: 0,
    service_fee: 0,
    currency: "EGP",
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        vat_percentage: settings.vat_percentage,
        service_fee: settings.service_fee,
        currency: settings.currency,
      });
    }
  }, [settings]);

  if (isLoading) return <div className="p-8">Loading Financials...</div>;
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-700">Pricing & Taxes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 border border-blue-100 bg-blue-50 rounded-2xl">
          <label className="block text-sm font-semibold text-primary mb-2">
            Value Added Tax (VAT) %
          </label>
          <input
            type="number"
            value={formData.vat_percentage}
            onChange={(e) =>
              setFormData({
                ...formData,
                vat_percentage: parseFloat(e.target.value) || 0,
              })
            }
            className="w-full p-3 border border-blue-200 rounded-xl"
            defaultValue="14"
          />
          <p className="text-xs text-primary mt-2">
            Calculated on the base session price.
          </p>
        </div>
        <div className="p-4 border border-green-100 bg-green-50 rounded-2xl">
          <label className="block text-sm font-semibold text-green-800 mb-2">
            Service Fee ({formData.currency})
          </label>
          <input
            type="number" 
            value={formData.service_fee}
            onChange={(e) => setFormData({...formData, service_fee: parseFloat(e.target.value) || 0})}
            className="w-full p-3 border border-green-200 rounded-xl"
            defaultValue="50"
          />
          <p className="text-xs text-primary mt-2">
            Fixed administrative fee per booking.
          </p>
        </div>
        <div className="max-w-xs">
        <label className="block text-sm font-medium text-gray-700 mb-2">System Currency</label>
        <select 
          value={formData.currency}
          onChange={(e) => setFormData({...formData, currency: e.target.value})}
          className="w-full p-3 border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="EGP">EGP - Egyptian Pound</option>
          <option value="SAR">SAR - Saudi Riyal</option>
          <option value="USD">USD - US Dollar</option>
        </select>
      </div>
      </div>
      <button 
        onClick={() => updateSettings(formData)}
        disabled={isUpdating}
        className="bg-primary text-white px-10 py-3 rounded-xl font-bold  disabled:bg-gray-400 transition-all shadow-lg cursor-pointer"
      >
        {isUpdating ? "Processing..." : "Save Financial Rules"}
      </button>
    </div>
  );
};
// parseFloat نضمن أن البيانات تذهب كأرقام صحيحة
