import { Outlet } from "react-router-dom"
export const DoctorLayout = () => {
    return (
       <div className="animate-fade-in">
      
      <Outlet /> 
    </div>
)
}