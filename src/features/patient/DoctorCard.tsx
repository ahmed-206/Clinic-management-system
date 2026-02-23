import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
interface DoctorProps {
  id: string
  name: string;
  specialty: string;
  price_per_session?: number;
}

export const DoctorCard = ({id, name, specialty, price_per_session}: DoctorProps) => {
  const navigate = useNavigate();
  return (
    <div className="bg-white rounded-lg p-6 flex flex-col items-center shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-50">
      
      {/* دائرة الصورة الشخصية */}
      <div className="relative mb-4 group">
        <div className="w-24 h-24 bg-linear-to-br from-[#C5B4B4] to-[#8B7E7E] rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-md group-hover:shadow-primary/20 transition-all">
          {name.charAt(0).toUpperCase()}
        </div>
        {/* السعر كـ Badge أنيق */}
        <div className="absolute -bottom-1 -right-1 bg-primary text-white text-[11px] px-3 py-1 rounded-full font-bold shadow-lg border-2 border-white">
          {price_per_session} EGP
        </div>
      </div>
      
      {/* اسم الدكتور والتخصص */}
      <div className="text-center mb-6">
        <h3 className="text-gray-800 font-black text-lg leading-tight">{name}</h3>
        <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">{specialty}</p>
      </div>
    
      {/* زر الحجز باستخدام المكون الموحد */}
      <Button 
        onClick={() => navigate(`/dashboard/book/${id}`)} 
        className="w-full text-sm py-2.5" // هنا الـ Button هيستخدم تنسيقاته الأساسية الـ Rounded-2xl والـ Shadow
      >
        Book now
      </Button>
    </div>
  );
};