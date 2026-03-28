import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useSettings } from "../../hooks/admin/useSettings"; 
import { HashLink } from "react-router-hash-link";
import { LuCircleUser, LuMenu, LuX } from "react-icons/lu"; 
import { Button } from "../ui/Button";

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { logout, user, profile } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();

  const getDashboardPath = () => {
    if (profile?.role === 'doctor') return '/doctor';
    if (profile?.role === 'admin') return '/admin';
    return '/dashboard';
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <nav className="w-full bg-primary border-b border-white/10 sticky top-0 z-[60] shadow-md">
      <div className="container mx-auto px-4 h-18 flex items-center justify-between">
        
        {/* 1. Logo */}
        <div className="shrink-0">
          <Link to="/" className="text-xl md:text-2xl font-bold text-white tracking-tight">
            {settings?.clinic_name}
          </Link>
        </div>

        {/* 2. Desktop Links (تختفي في الموبايل) */}
        <div className="hidden md:flex items-center gap-8 text-white">
          <Link to='/' className="font-medium hover:text-backG transition-colors">Home</Link>
          <HashLink smooth to="/#features" className="font-medium hover:text-backG transition-colors">Features</HashLink>
          <HashLink smooth to="/#how-it-works" className="font-medium hover:text-backG transition-colors">How it works</HashLink>
        </div>

        {/* 3. Actions (البروفايل أو الدخول) */}
        <div className="flex items-center gap-2 md:gap-4">
          {user ? (
            <div className="flex items-center gap-2">
              <Link to={getDashboardPath()} className="p-2 text-white hover:bg-white/10 rounded-full transition-all">
                <LuCircleUser size={26} />
              </Link>
              <Button
                onClick={handleLogout}
                className="hidden md:block bg-red-500 text-white hover:bg-red-600 px-4 py-2"
              >
                Logout
              </Button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <Link to="/login" className="text-white font-medium hover:opacity-80">Login</Link>
              <Link to="/signup" className="bg-white text-primary px-5 py-2 rounded-lg font-bold hover:bg-backG transition-colors">
                Sign up
              </Link>
            </div>
          )}

          {/* 4. Mobile Menu Toggle (يظهر في الموبايل فقط) */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-white"
          >
            {isMobileMenuOpen ? <LuX size={28} /> : <LuMenu size={28} />}
          </button>
        </div>
      </div>

      {/* 5. Mobile Menu Overlay (القائمة التي تظهر عند الضغط في الموبايل) */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-primary border-t border-white/10 p-4 space-y-4 animate-fade-in">
          <Link to='/' onClick={() => setIsMobileMenuOpen(false)} className="block text-white text-lg py-2 border-b border-white/5">Home</Link>
          <HashLink smooth to="/#features" onClick={() => setIsMobileMenuOpen(false)} className="block text-white text-lg py-2 border-b border-white/5">Features</HashLink>
          <HashLink smooth to="/#how-it-works" onClick={() => setIsMobileMenuOpen(false)} className="block text-white text-lg py-2">How it works</HashLink>
          
          {!user && (
            <div className="pt-4 flex flex-col gap-3">
              <Link to="/login" className="w-full text-center py-3 text-white border border-white/30 rounded-lg">Login</Link>
              <Link to="/signup" className="w-full text-center py-3 bg-white text-primary rounded-lg font-bold">Sign up</Link>
            </div>
          )}
          {user && (
             <Button onClick={handleLogout} className="w-full bg-red-500 text-white py-3">Logout</Button>
          )}
        </div>
      )}
    </nav>
  );
};