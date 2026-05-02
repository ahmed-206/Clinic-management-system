import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { HashLink } from "react-router-hash-link";
import { LuCircleUser, LuMenu, LuX } from "react-icons/lu";
import { Button } from "../ui/Button";
import { AnimatePresence, motion } from "framer-motion";
import logo from '../../assets/heroImg/doctori.png';
import { NotificationBell } from "../ui/NotificationBell";
import { LanguageToggle } from "../ui/LanguageToggle";
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

  return (
    <nav className="fixed w-full max-w-full  z-100 transition-all duration-300 bg-neutral-100 backdrop-blur-md border-b border-white/5">
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
        <div className="hidden md:flex items-center gap-8 text-sm lg:text-base font-semibold  text-secondary">
          <Link
            to="/"
            className="hover:text-primary transition-colors duration-200"
          >
            {t('home')}
          </Link>
          <HashLink
            smooth
            to="/#features"
            className="hover:text-primary transition-colors duration-200"
          >
            {t('features')}
          </HashLink>
          <HashLink
            smooth
            to="/#how-it-works"
            className="hover:text-primary transition-colors duration-200"
          >
            {t('howItWorks')}
          </HashLink>
        </div>

        {/* 3. Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          {user ? (
            <div className="flex items-center gap-2">
              <NotificationBell />
              <Link
                to={getDashboardPath()}
                className="p-2 text-secondary/80 hover:text-white hover:bg-secondary/30 rounded-full transition-all duration-400"
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
              <LanguageToggle />
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-4">
              <Link
                to="/login"
                className="text-sm font-medium text-secondary hover:text-primary transition-colors duration-200 px-3 py-2"
              >
                {t('login')}
              </Link>
              <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="primary" className="w-full text-primary">
                  {t('signUp')}
                </Button>
              </Link>
              <LanguageToggle />
            </div>
          )}

          {/* 4. Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-primary hover:bg-white/8 rounded-lg transition-all duration-200"
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
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-primary backdrop-blur-md border-t border-white/5 px-6 py-5 space-y-1"
          >
            {[
              { label: "Home", to: "/", isHash: false },
              { label: "Features", to: "/#features", isHash: true },
              { label: "How it works", to: "/#how-it-works", isHash: true },
            ].map(({ label, to, isHash }) =>
              isHash ? (
                <HashLink
                  key={label}
                  smooth
                  to={to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center text-white  text-sm font-medium py-3 border-b border-white/5 transition-colors duration-200"
                >
                  {label}
                </HashLink>
              ) : (
                <Link
                  key={label}
                  to={to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center text-white/60 hover:text-white text-sm font-medium py-3 border-b border-white/5 transition-colors duration-200"
                >
                  {label}
                </Link>
              ),
            )}

            <div className="pt-4 space-y-2">
              {!user ? (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center w-full py-3 text-sm font-medium text-white/70 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all duration-200"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center w-full py-3 text-sm font-bold text-primary bg-white  rounded-xl shadow-[0_4px_16px_rgba(37,99,235,0.3)] transition-all duration-200"
                  >
                    Sign up
                  </Link>
                </>
              ) : (
                <Button
                  variant="danger"
                  onClick={handleLogout}
                  className="w-full py-3 text-sm font-medium "
                >
                  Logout
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
