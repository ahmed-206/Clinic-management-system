# 🏥 Clinic Management System

A full-featured clinic management system that connects **Admins, Doctors, and Patients** in one unified platform to streamline appointment booking and medical schedule management.

---

## 🌟 Overview
This system is designed to simplify clinic operations by providing:
- **Centralized management** for administrators.
- **Flexible scheduling tools** for doctors.
- **Real-time appointment booking** for patients.

Built with a modern full-stack architecture focusing on speed, security, and type safety.

## 🚀 Core Features

### 🔑 Admin Dashboard
- Manage doctors (Add/Edit/Verify).
- Manage patients database.
- Monitor real-time clinic statistics and revenue.

### 👨‍⚕️ Doctor Dashboard
- **Smart Scheduling:** Set weekly availability with custom time slots.
- **Time-off Management:** Select vacation days via an interactive calendar.
- View and manage upcoming appointments.

### 📅 Patient Booking System
- Dynamic availability based on doctor's real-time schedule.
- Instant booking confirmation.
- Prevention of double-booking and schedule conflicts.

## 🛠 Tech Stack

| Category           | Technology                               |
|--------------------|------------------------------------------|
| **Frontend** | React.js, TypeScript, Tailwind CSS      |
| **Backend/DB** | Supabase (Postgres, Auth, Edge Functions)|
| **State Management**| TanStack Query (React Query)            |
| **Icons & UI** | Lucide React, React Icons               |

---

## ⚙️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone 
   cd Clinic-management-system
Install dependencies:
   ```bash
   pnpm install
Environment Variables:
Create a .env file in the root directory and add:

VITE_APP_SUPABASE_URL=your_supabase_url
VITE_APP_SUPABASE_KEY=your_anon_public_key


Run the development server:

pnpm run dev
Open http://localhost:5173 in your browser.

