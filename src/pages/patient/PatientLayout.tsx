import { Outlet } from "react-router-dom";

export const PatientLayout = () => {
 
    return (
    <div className="animate-fade-in">
      
      <Outlet /> 
    </div>
  );
};
