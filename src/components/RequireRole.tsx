import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth"



export const RequireRole = ({allowedRole}: {allowedRole: string}) => {
    const { profile, loading, user} = useAuth();

    if (loading) return null;
    if (!user) return <Navigate to="/login" replace />;
    if (!profile) return null;
     

   if (profile?.role !== allowedRole) {
    
    return <Navigate to="/unauthorized" replace />;
  }
  return <Outlet />
}