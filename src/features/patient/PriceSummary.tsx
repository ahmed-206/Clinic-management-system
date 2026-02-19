import { useSettings } from "../../hooks/admin/useSettings";

interface PriceSummaryProps {
  basePrice: number; // سعر كشف الدكتور القادم من قاعدة البيانات
}

export const PriceSummary = ({ basePrice }: PriceSummaryProps) => {
  const { settings, isLoading } = useSettings();

  if (isLoading) return <div className="animate-pulse h-20 bg-gray-100 rounded-xl"></div>;

  // الحسبة البرمجية
  const serviceFee = settings?.service_fee || 0;
  const vatRate = (settings?.vat_percentage || 0) / 100;
  
  const vatAmount = basePrice * vatRate;
  const totalPrice = basePrice + serviceFee + vatAmount;
  const currency = settings?.currency || "EGP";

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
      <h3 className="text-lg font-bold text-gray-800 border-b pb-3">Booking Summary</h3>
      
      <div className="space-y-2">
        <div className="flex justify-between text-gray-600">
          <span>Session Price</span>
          <span>{basePrice} {currency}</span>
        </div>
        
        <div className="flex justify-between text-gray-600">
          <span>Service Fee</span>
          <span>+ {serviceFee} {currency}</span>
        </div>

        <div className="flex justify-between text-gray-600">
          <span>VAT ({settings?.vat_percentage}%)</span>
          <span>+ {vatAmount.toFixed(2)} {currency}</span>
        </div>
      </div>

      <div className="pt-4 border-t border-dashed flex justify-between items-center">
        <span className="font-bold text-gray-900 text-xl">Total Amount</span>
        <span className="font-black text-blue-600 text-2xl">
          {totalPrice.toFixed(2)} {currency}
        </span>
      </div>
    </div>
  );
};