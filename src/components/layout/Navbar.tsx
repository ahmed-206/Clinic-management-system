import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useSettings } from "../../hooks/admin/useSettings"; 
import { HashLink } from "react-router-hash-link";
import { LuCircleUser } from "react-icons/lu";

export const Navbar = () => {
  const { logout, user, profile } = useAuth();
  const {settings} = useSettings()
const navigate = useNavigate();
const getDashboardPath = () => {
  if (profile?.role === 'doctor') return '/doctor';
  if (profile?.role === 'admin') return '/admin';
  return '/dashboard'; // للمريض أو كافتراضي
};

  const handleLogout = async() => {
    try {
      await logout();
      navigate('/login',{ replace: true });
    } catch (error) {
      console.error("Logout failed", error);
    }
  }
  return (
    <nav className="w-full h-18 bg-primary border-b border-gray-200 flex items-center sticky top-0 z-50">
      <div className="container mx-auto px-4 lg:px-12 grid grid-cols-12 items-center w-full">
        <div className="col-span-3">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {settings?.clinic_name}
          </h1>
        </div>

        <div className="col-span-6 flex justify-center gap-12 text-white">
          <Link to='/' className=" text-lg font-medium hover:opacity-70 transition-opacity">
            Home
          </Link>
          <HashLink smooth to="/#features" className=" text-lg font-medium hover:opacity-70 transition-opacity">
            Features
          </HashLink>
          <HashLink smooth 
            to="/#how-it-works" className=" text-lg font-medium hover:opacity-70 transition-opacity">
            How it work
          </HashLink>
        </div>
        <div className="col-span-3 flex justify-end gap-3">
           {user ? (
          <div className="flex items-center gap-3">
            <Link to={getDashboardPath()} className="px-4 py-2 font-medium text-white">
              <LuCircleUser size={24} />
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors cursor-pointer"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="col-span-3 flex justify-end gap-3">
            <Link
              to="/login"
              className="px-6 py-2 rounded-lg text-sm font-semibold text-white transition-colors"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-6 py-2  bg-white text-primary rounded-lg text-sm font-semibold hover:bg-backG transition-colors"
            >
              Sign up
            </Link>
          </div>
        )}
        </div>
       
      </div>
    </nav>
  );
};
