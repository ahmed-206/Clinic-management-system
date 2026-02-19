import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth"



export const RequireRole = ({allowedRole}: {allowedRole: string}) => {
    const { profile, loading, user} = useAuth();
    if (loading) return <p>Loading...</p>;
    if (!user) return <Navigate to="/login" replace />;
    if (user && !profile) return <p>Loading Profile...</p>;
     

   if (profile?.role !== allowedRole) {
    console.warn("Role Mismatch! Redirecting to unauthorized...");
    return <Navigate to="/unauthorized" replace />;
  }
  return <Outlet />
}