import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { menuConfig } from "../../constants/menuConfig";
import { useSettings } from "../../hooks/admin/useSettings";
import { BiLogOutCircle } from "react-icons/bi";

export const Sidebar = () => {
  const { profile, logout } = useAuth();
  const {settings} = useSettings()
  const location = useLocation();

  // الحصول على القائمة بناءً على الدور الحالي
  const currentMenu = menuConfig[profile?.role as keyof typeof menuConfig] || [];
  return (
    <aside className="w-64 bg-primary text-white flex flex-col h-full shadow-xl">
      <div className="p-8">
        <Link to='/' className="text-2xl font-bold tracking-tight">{settings?.clinic_name}</Link>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {currentMenu.map((item) => {
          // فحص هل الرابط الحالي هو النشط؟
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                isActive
                  ? "bg-shadow text-white shadow-lg translate-x-1"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* تسجيل الخروج */}
      <div className="p-4 border-t border-white/10 bg-black/5">
        <div className="flex items-center gap-3 px-4 py-3 mb-2">
           <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-primary font-bold text-xs">
             {profile?.name?.charAt(0).toUpperCase()}
           </div>
           <span className="text-sm font-medium truncate">{profile?.name}</span>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-4 px-4 py-3 text-white/60 hover:text-red-500 hover:bg-shadow rounded-xl transition-all cursor-pointer"
        >
          
          <BiLogOutCircle  size="1.5rem"/>
          Logout

        </button>
      </div>
    </aside>
  );
};