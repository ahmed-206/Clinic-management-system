import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { useDashboardT } from "@/hooks/useT";
import { useSpecialtyTranslation } from '@/hooks/language/useSpecialtyTranslation';

interface DoctorProps {
  id: string
  name: string;
  specialty: string;
  price_per_session?: number;
}

export const DoctorCard = ({id, name, specialty, price_per_session}: DoctorProps) => {
    const { translateSpecialty } = useSpecialtyTranslation();

  const td = useDashboardT();
  const navigate = useNavigate();
  return (
    <div className="bg-white rounded-lg p-6 flex flex-col items-center  shadow-md  hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-secondary/10">
      
     
      <div className="relative mb-4 group">
        <div className="w-24 h-24 bg-linear-to-br border border-primary  rounded-full flex items-center justify-center text-primary text-3xl font-bold shadow-md group-hover:shadow-primary/20 transition-all">
          {name.charAt(0).toUpperCase()}
        </div>
        
       
      </div>
      
      
      <div className="text-center mb-6">
        <h3 className="text-heading font-bold text-lg leading-tight">{name}</h3>
        <p className="text-primary text-sm font-light uppercase tracking-wider">{translateSpecialty(specialty)}</p>
      </div>

       <div className="flex mb-2">
          <p className="text-heading">Price: </p> <span className="text-secondary">{price_per_session} EGP</span>
        </div>
    
      {/* زر الحجز باستخدام المكون الموحد */}
      <Button 
        onClick={() => navigate(`/dashboard/book/${id}`)} 
        className="w-full text-sm py-2.5" 
      >
        {td('dashboard.patient.bookNow')}
      </Button>
    </div>
  );
};