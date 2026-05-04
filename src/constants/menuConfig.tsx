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

import { type DashboardKeys } from "../i18n/types";
export interface MenuItem {
  name: DashboardKeys;
  path: string;
  icon: React.ReactNode;
}
export const menuConfig: Record<string, MenuItem[]> = {
    
  patient: [
    { name: "dashboard.sidebar.myAppointments", path: "/dashboard", icon: <LuCalendarDays /> },
    {
      name: "dashboard.sidebar.bookAppointment",
      path: "/dashboard/book",
      icon: <LuCalendarPlus />,
    },
  ],
  doctor: [
    { name: "dashboard.sidebar.dashboard", path: "/doctor", icon: <LuChartColumnDecreasing /> },
    {
      name: "dashboard.sidebar.appointments",
      path: "/doctor/appointments",
      icon: <LuCalendarDays />,
    },
    {
      name: "dashboard.sidebar.schedule",
      path: "/doctor/schedule",
      icon: <LuCalendarClock />,
    },
    { name: "dashboard.sidebar.profile", path: "/doctor/profile", icon: <LuUserRound /> },
  ],
  admin: [
    { name: "dashboard.sidebar.dashboard", path: "/admin", icon: <LuChartColumnDecreasing /> },
    { name: "dashboard.sidebar.doctors", path: "/admin/doctors", icon: <LuStethoscope /> },
    { name: "dashboard.sidebar.patients", path: "/admin/patient", icon: <LuUsersRound/> },
    { name: "dashboard.sidebar.appointments", path: "/admin/adminappointments", icon: <LuCalendarDays /> },
    { name: "dashboard.sidebar.settings", path: "/admin/settings", icon: <LuSettings /> },
  ],
};
