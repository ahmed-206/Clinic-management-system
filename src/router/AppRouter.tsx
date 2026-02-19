import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { PublicLayout } from "../components/layout/PublicLayout";
import { Signup } from "../pages/SignupPage";
import { Login } from "../pages/LoginPage";
import { RequireRole } from "../components/RequireRole";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { PatientAppointmentsPage } from "../pages/patient/PatientAppointmentsPage";
import { BookAppointmentPage } from "../pages/patient/BookAppointmentPage";
import { HomePage } from "../pages/Home";
import { BookingDetails } from "../pages/patient/BookingDetails";
import { DoctorDashboardPage } from "../pages/doctor/DoctorDashboardPage";
import { Unauthorized } from "../pages/Unauthorized";
import DoctorAppointment from "../pages/doctor/DoctorAppointmentPage";
import DoctorSchedulePage from "../pages/doctor/DoctorSchedulePage";
import { DoctorProfilePage } from "../pages/doctor/DoctorProfile";
import { AdminDashboard } from "../pages/admin/AdminDashboard";
import { DoctorsMangementPage } from "../pages/admin/DoctorsManagementPage";
import { PatientsManagementPage } from "../pages/admin/PatientsManagementPage";
import { AppointmentsManagementPage } from "../pages/admin/AppointmentsManagementPage";
import SettingsPage from "../pages/admin/SettingsPage/SettingsPage";

const rout = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      {index: true, element: <HomePage /> },
      { path: "signup", element: <Signup /> },
      { path: "login", element: <Login /> },
      { path: "unauthorized", element: <Unauthorized /> },
    ],
  },
  {
    path: "/dashboard", // المسار الأب للمريض
    element: <DashboardLayout />,
    children: [
      {
        path: "",
        element: <RequireRole allowedRole="patient" />,
        children: [
          { index: true, element: <PatientAppointmentsPage /> },
          { path: "book", element: <BookAppointmentPage /> },
          { path: "book/:doctorId", element: <BookingDetails /> },
          
        ],
      },
    ],
  },
  {
    path: "/doctor",
    element: <DashboardLayout />,
    children: [
      {
        path: "",
        element: <RequireRole allowedRole="doctor" />,
        children: [
          { index: true, element: <DoctorDashboardPage /> },
          { path: "appointments", element: <DoctorAppointment /> },
          {path : "schedule", element : <DoctorSchedulePage /> },
          {path: "profile", element : <DoctorProfilePage />}
        ],
      },
    ],
  },
  {
    path : "/admin",
    element : <DashboardLayout /> ,
    children : [
      {
        path: "",
        element: <RequireRole allowedRole="admin"/>,
        children : [
          {index : true, element: <AdminDashboard />},
          {path : "doctors", element: <DoctorsMangementPage />},
          {path : "patient", element : <PatientsManagementPage />},
          {path : "adminappointments", element : <AppointmentsManagementPage />},
          {path : "settings", element: <SettingsPage />}
        ]
      }
    ]
  }
]);

const AppRouter = () => {
  return <RouterProvider router={rout} />;
};

export default AppRouter;
