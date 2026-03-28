import { HashLink } from "react-router-hash-link";
import { useSettings } from "../../hooks/admin/useSettings";
import { Link } from "react-router-dom";

export const Footer = () => {
  const { settings } = useSettings();
  const currentYear = new Date().getFullYear(); // لإظهار السنة الحالية تلقائياً

  return (
    <footer className="w-full py-12 md:py-16 bg-primary mt-auto text-white border-t  border-white/10">
      <div className="container mx-auto px-6 lg:px-12 text-center">
        {/* شبكة العناصر المتجاوبة */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 text-center md:text-left">
          
          {/* العمود الأول: الشعار والوصف */}
          <div className="flex flex-col gap-4">
            <Link to="/" className="text-2xl md:text-3xl font-black tracking-tight hover:opacity-90 transition-opacity">
              {settings?.clinic_name}
            </Link>
            <p className="text-white/60 text-sm leading-relaxed max-w-xs mx-auto md:mx-0">
              Providing world-class healthcare services with the best specialists in the field.
            </p>
          </div>

          {/* العمود الثاني: روابط سريعة */}
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-bold uppercase tracking-wider text-white/40">Quick Links</h3>
            <nav className="flex flex-col gap-3">
              <Link to="/" className="text-base font-medium hover:text-white/70 transition-colors">Home</Link>
              <HashLink smooth to="/#features" className="text-base font-medium hover:text-white/70 transition-colors">Features</HashLink>
              <HashLink smooth to="/#how-it-works" className="text-base font-medium hover:text-white/70 transition-colors">How it works</HashLink>
            </nav>
          </div>

          {/* العمود الثالث: قانوني وتواصل */}
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-bold uppercase tracking-wider text-white/40">Legal & Support</h3>
            <nav className="flex flex-col gap-3">
              <Link to="/terms" className="text-base font-medium hover:text-white/70 transition-colors">Terms of Service</Link>
              <Link to="/privacy" className="text-base font-medium hover:text-white/70 transition-colors">Privacy Policy</Link>
              <a href="mailto:support@clinic.com" className="text-base font-medium hover:text-white/70 transition-colors">Contact Us</a>
            </nav>
          </div>
        </div>

        {/* خط الفصل وحقوق الملكية */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-center items-center gap-4 text-white/40 text-sm">
          <p>© {currentYear} {settings?.clinic_name}. All rights reserved.</p>
          
        </div>
      </div>
    </footer>
  );
};