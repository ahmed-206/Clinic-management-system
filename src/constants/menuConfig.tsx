import {
  LuCalendarDays,
  LuCalendarPlus,
  LuChartColumnDecreasing,
  LuCalendarClock,
  LuUserRound,
  LuStethoscope,
  LuSettings, 
  LuUsersRound
} from "react-icons/lu";

export interface MenuItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}
export const menuConfig: Record<string, MenuItem[]> = {
  patient: [
    { name: "My Appointments", path: "/dashboard", icon: <LuCalendarDays /> },
    {
      name: "Book Appointment",
      path: "/dashboard/book",
      icon: <LuCalendarPlus />,
    },
  ],
  doctor: [
    { name: "Dashboard", path: "/doctor", icon: <LuChartColumnDecreasing /> },
    {
      name: "My Appointments",
      path: "/doctor/appointments",
      icon: <LuCalendarDays />,
    },
    {
      name: "My Schedule",
      path: "/doctor/schedule",
      icon: <LuCalendarClock />,
    },
    { name: "Profile", path: "/doctor/profile", icon: <LuUserRound /> },
  ],
  admin: [
    { name: "Dashboard", path: "/admin", icon: <LuChartColumnDecreasing /> },
    { name: "Doctors", path: "/admin/doctors", icon: <LuStethoscope /> },
    { name: "Patients", path: "/admin/patient", icon: <LuUsersRound/> },
    { name: "Appointments", path: "/admin/adminappointments", icon: <LuCalendarDays /> },
    { name: "Settings", path: "/admin/settings", icon: <LuSettings /> },
  ],
};
