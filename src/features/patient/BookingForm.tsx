import { LiaMoneyBillWaveSolid } from "react-icons/lia";
import { Button } from "../../components/ui/Button";
import { LuPhone, LuUserRound  } from "react-icons/lu";

interface BookingFormProps {
  patientName: string;
  patientPhone: string;
  setPatientName: (val: string) => void;
  setPatientPhone: (val: string) => void;
  onSubmit: () => void; 
  isPending: boolean;
  price_per_session?: number;
  
}
export const BookingForm  = ({ 
  patientName, 
  patientPhone, 
  setPatientName, 
  setPatientPhone,
  onSubmit,
  isPending,
  price_per_session
  
}: BookingFormProps) => {
   
    return (
<div className=" bg-white rounded-xl shadow-2xl w-full  max-h-fit overflow-hidden relative z-10">
  <div className="text-center p-4 border-b sticky top-0 z-10 text-white bg-primary">
    <h3 className="font-semibold text-white text-center">Appointment Information</h3>
  </div>
  <div className="flex flex-col items-center text-center border-b border-secondary/50 pb-2.5 m-2">
    <LiaMoneyBillWaveSolid className="text-primary" size={28} />
  <span className="text-secondary">Session price {price_per_session} EGP</span>

  </div>

 <div className="felx felx-col gap-6 p-6">
    <p className="text-xl text-secondary text-center m-3">
    Enter booking details
  </p>
    <div className="flex items-center gap-3 border-b border-secondary/30 py-1 focus-within:border-primary transition-colors">
        <LuUserRound className="text-secondary shrink-0" size={20} />
        <input
          type="text"
          value={patientName}
          onChange={(e) => setPatientName(e.target.value)}
          placeholder="Full patient name"
          className="w-full bg-transparent p-2 outline-none text-secondary placeholder:text-secondary/40"
          required
        />
      </div>

  <div className="flex items-center gap-3 border-b border-secondary/30 py-1 focus-within:border-primary transition-colors">
        <LuPhone className="text-secondary shrink-0" size={20} />
        <input
          type="tel"
          value={patientPhone}
          onChange={(e) => setPatientPhone(e.target.value)}
          placeholder="Phone number"
          className="w-full bg-transparent p-2 outline-none text-secondary placeholder:text-secondary/40"
          required
        />
      </div>
  <Button
        onClick={onSubmit}
        variant="primary"
        disabled={!patientName.trim() || !patientPhone.trim() || isPending}
        className="w-full py-4 text-lg rounded-xl shadow-md transition-all active:scale-95 mt-3"
      >
        {isPending ? "Booking in progress..." : "Book Now"}
      </Button>
 </div>
</div>
    )
}

