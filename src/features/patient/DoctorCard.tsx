import { useNavigate } from "react-router-dom";
interface DoctorProps {
  id: string
  name: string;
  specialty: string;
  price_per_session?: number;
}

export const DoctorCard = ({id, name, specialty, price_per_session}: DoctorProps) => {
  const navigate = useNavigate();
  return (
    <div className="bg-white rounded-lg p-6 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-all h-62.5 w-full">
      {/* دائرة الصورة الشخصية */}
      <div className="relative mb-4">
        <div className="w-24 h-24 bg-linear-to-br from-[#C5B4B4] to-[#8B7E7E] rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg transition-transform group-hover:scale-110 duration-300">
          {name.charAt(0).toUpperCase()}
        </div>
        <div className="absolute -bottom-1 -right-1 bg-green-500 text-white text-[10px] px-2 py-1 rounded-full font-bold shadow-sm">
          EGP{price_per_session}
        </div>
      </div>
      
      {/* اسم الدكتور والتخصص */}
      <h3 className="text-gray-700 font-bold text-lg mb-1">{name}</h3>
      <p className="text-gray-500 text-sm mb-6">{specialty}</p>
    
      {/* زر الحجز */}
      <button onClick={() => navigate(`/dashboard/book/${id}`)} className="bg-primary text-white px-8 py-2 rounded-lg text-sm font-semibold  transition-colors shadow-inner cursor-pointer">
        Book now
      </button>
    </div>
  );
};