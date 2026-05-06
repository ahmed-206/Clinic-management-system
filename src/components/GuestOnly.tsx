import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ROLE_REDIRECTS: Record<string, string> = {
  patient: "/dashboard",
  doctor: "/doctor",
  admin: "/admin",
};


export const GuestOnly = () => {
  const { user, profile, loading } = useAuth();

  if (loading) return null; // wait until auth state is resolved

  if (user && profile) {
    const redirect =
      (profile?.role && ROLE_REDIRECTS[profile.role]) ?? "/dashboard";
    return <Navigate to={redirect} replace />;
  }

  if (user && !profile) return null;


  return <Outlet />;
};
