import { lazy, Suspense } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { PublicLayout } from "../components/layout/PublicLayout";
import { Signup } from "../pages/SignupPage";
import { Login } from "../pages/LoginPage";
import { RequireRole } from "../components/RequireRole";
import { GuestOnly } from "../components/GuestOnly";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { HomePage } from "../pages/Home";
import { Unauthorized } from "../pages/Unauthorized";

// import patient pages
const PatientAppointmentsPage = lazy(() =>
  import("../pages/patient/PatientAppointmentsPage").then((m) => ({
    default: m.PatientAppointmentsPage,
  })),
);

const BookAppointmentPage = lazy(() =>
  import("../pages/patient/BookAppointmentPage").then((m) => ({
    default: m.BookAppointmentPage,
  })),
);

const BookingDetails = lazy(() =>
  import("../pages/patient/BookingDetails").then((m) => ({
    default: m.BookingDetails,
  })),
);

// import doctor pages
const DoctorDashboardPage = lazy(() =>
  import("../pages/doctor/DoctorDashboardPage").then((m) => ({
    default: m.DoctorDashboardPage,
  })),
);

const DoctorAppointment = lazy(() => import("../pages/doctor/DoctorAppointmentPage"));
const DoctorSchedulePage = lazy(() => import("../pages/doctor/DoctorSchedulePage"));
const DoctorProfilePage = lazy(() =>
  import("../pages/doctor/DoctorProfile").then((m) => ({
    default: m.DoctorProfilePage,
  })),
);

// import admin pages
const AdminDashboard = lazy(() =>
  import("../pages/admin/AdminDashboard").then((m) => ({
    default: m.AdminDashboard,
  })),
);
const DoctorsMangementPage = lazy(() =>
  import("../pages/admin/DoctorsManagementPage").then((m) => ({
    default: m.DoctorsMangementPage,
  })),
);
const PatientsManagementPage = lazy(() =>
  import("../pages/admin/PatientsManagementPage").then((m) => ({
    default: m.PatientsManagementPage,
  })),
);
const AppointmentsManagementPage = lazy(() =>
  import("../pages/admin/AppointmentsManagementPage").then((m) => ({
    default: m.AppointmentsManagementPage,
  })),
);

const SettingsPage = lazy(() => import("../pages/admin/SettingsPage/SettingsPage"));


import PrivacyPolicy from "../pages/PrivacyPolicy";
import TermsOfService from "../pages/TermsOfService";
import ContactUs from "../pages/ContactUs";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";

const rout = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: "",
        element: <GuestOnly />,
        children: [
          { path: "signup", element: <Signup /> },
          { path: "login", element: <Login /> },
        ],
      },
      { path: "unauthorized", element: <Unauthorized /> },
      { path: "privacy", element: <PrivacyPolicy /> },
      { path: "terms", element: <TermsOfService /> },
      { path: "contactus", element: <ContactUs /> },
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
          { path: "schedule", element: <DoctorSchedulePage /> },
          { path: "profile", element: <DoctorProfilePage /> },
        ],
      },
    ],
  },
  {
    path: "/admin",
    element: <DashboardLayout />,
    children: [
      {
        path: "",
        element: <RequireRole allowedRole="admin" />,
        children: [
          { index: true, element: <AdminDashboard /> },
          { path: "doctors", element: <DoctorsMangementPage /> },
          { path: "patient", element: <PatientsManagementPage /> },
          {
            path: "adminappointments",
            element: <AppointmentsManagementPage />,
          },
          { path: "settings", element: <SettingsPage /> },
        ],
      },
    ],
  },
]);
const AppRouter = () => {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner size="lg" />
        </div>
      }
    >
      <RouterProvider router={rout} />
    </Suspense>
  );
};

export default AppRouter;
