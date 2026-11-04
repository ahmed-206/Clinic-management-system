import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { HashLink } from "react-router-hash-link";
import { LuCircleUser, LuMenu, LuX } from "react-icons/lu";
import { Button } from "@/components/ui/Button";
import { AnimatePresence, motion } from "framer-motion";
import logo from '@/assets/heroImg/doctori2.png';
import { NotificationBell } from "@/components/ui/NotificationBell";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { useTranslation } from 'react-i18next';
export const Navbar = () => {
  const {t} = useTranslation("nav")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { logout, user, profile } = useAuth();
 
  const navigate = useNavigate();

  const getDashboardPath = () => {
    if (profile?.role === "doctor") return "/doctor";
    if (profile?.role === "admin") return "/admin";
    return "/dashboard";
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/" && location.hash === "";
    return location.pathname + location.hash === path;
  };
  return (
    <nav className="fixed w-full max-w-full  z-100 transition-all duration-300 bg-primary backdrop-blur-md border-b border-white/5">
      <div className="container mx-auto px-4 md:px-10 h-16 md:h-18 flex items-center justify-between">
        {/* 1. Logo */}
        <div className="shrink-0">
          <Link
            to="/"
          >
            <img src={logo} height={124} width={124}/>
          </Link>
        </div>

        {/* 2. Desktop Links */}
      <div className="hidden md:flex items-center gap-1 bg-white/25 backdrop-blur-md border border-white/40 rounded-full  text-sm lg:text-base font-medium text-white">
          <Link
            to="/"
            className={`px-5 py-2 rounded-full transition-all duration-200 ${
              isActive("/") 
                ? "bg-white/40 text-white shadow-sm font-semibold" 
                : "hover:bg-white/20 text-white/80"
            }`}
          >
            {t('home')}
          </Link>

          <HashLink
            smooth
            to="/#features"
            className={`px-5 py-2 rounded-full transition-all duration-200 ${
              isActive("/#features") 
                ? "bg-white/40 text-white shadow-sm font-semibold" 
                : "hover:bg-white/20 text-white/80"
            }`}
          >
            {t('features')}
          </HashLink>

          <HashLink
            smooth
            to="/#how-it-works"
            className={`px-5 py-2 rounded-full transition-all duration-200 ${
              isActive("/#how-it-works") 
                ? "bg-white/40 text-white shadow-sm font-semibold" 
                : "hover:bg-white/20 text-white/80"
            }`}
          >
            {t('howItWorks')}
          </HashLink>
        </div>

        {/* 3. Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          {user ? (
            <div className="flex items-center">
              <LanguageToggle />
              <NotificationBell />
              <Link
                to={getDashboardPath()}
                className="p-2 mr-1 text-white hover:text-white hover:bg-secondary/30 rounded-full transition-all duration-400"
              >
                <LuCircleUser size={22} />
              </Link>
              <Button
                variant="danger"
                onClick={handleLogout}
                className="hidden sm:inline-flex px-4 py-2 text-xs md:text-sm font-bold"
              >
                {t('logout')}
              </Button>
            </div>
          ) : (
            <div className="hidden md:flex items-center">
              <LanguageToggle />
              <Link

                to="/login"
                className="text-md font-bold text-white  transition-colors duration-200 "
              >
                <Button variant="">
                {t('login')}
                </Button>
              </Link>
              <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="secondary" className="w-full text-primary">
                  {t('signUp')}
                </Button>
              </Link>
            </div>
          )}

          {/* 4. Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-white hover:bg-white/8 rounded-lg transition-all duration-200"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <LuX size={22} /> : <LuMenu size={22} />}
          </button>
        </div>
      </div>

      {/* 5. Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="md:hidden mt-3 bg-white/30 backdrop-blur-md border border-white/30 rounded-2xl shadow-xl px-6 py-5 space-y-2 overflow-hidden"
          >
            {[
              { label: t('home'), to: "/", isHash: false },
              { label: t('features'), to: "/#features", isHash: true },
              { label: t('howItWorks'), to: "/#how-it-works", isHash: true },
            ].map(({ label, to, isHash }) =>
              isHash ? (
                <HashLink
                  key={label}
                  smooth
                  to={to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-white text-sm font-medium py-2.5 border-b border-white/20 transition-colors duration-200"
                >
                  {label}
                </HashLink>
              ) : (
                <Link
                  key={label}
                  to={to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-white text-sm font-medium py-2.5 border-b border-white/20 transition-colors duration-200"
                >
                  {label}
                </Link>
              )
            )}

            <div className="pt-3 space-y-2">
              {!user ? (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center w-full py-2.5 text-sm font-medium text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all duration-200"
                  >
                    {t('login')}
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center w-full py-2.5 text-sm font-bold text-gray-900 bg-white rounded-xl shadow-md transition-all duration-200"
                  >
                    {t('signUp')}
                  </Link>
                </>
              ) : (
                <Button
                  variant="danger"
                  onClick={handleLogout}
                  className="w-full py-2.5 text-sm font-medium"
                >
                  {t('logout')}
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
