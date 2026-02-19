# Clinic Management System
A full-featured clinic management system that connects 'Admins, Doctors, and Patients' in one unified platform to streamline appointment booking and medical schedule management.

## Overview
This system is designed to simplify clinic operations by providing:

- Centralized management for administrators
- Flexible scheduling tools for doctors
- Real-time appointment booking for patients

Built with a modern full-stack architecture using React and Supabase.

## Core Features

### Admin Dashboard
- Manage doctors
- Manage patients
- Monitor appointments
- View system statistics

###  Doctor Dashboard
- Set weekly availability
- Manage time-off days
- View and manage booked appointments

###  Patient Booking System
- Real-time appointment booking
- Dynamic availability based on doctor's schedule
- Prevent double booking

- ## Tech Stack

### Frontend
- React.js
- TypeScript
- Tailwind CSS

### Backend & Database
- Supabase (PostgreSQL + Edge Functions + Auth)

### State Management
- TanStack Query (React Query)



Create a `.env` file in the root directory and add:

VITE_APP_SUPABASE_URL=your_supabase_url
VITE_APP_SUPABASE_KEY=your_anon_public_key


> Make sure you use the **anon public key**, not the service role key.

---

##  Installation & Setup

1. Install dependencies:
  
   pnpm install
Add your Supabase environment variables.

Run the development server:


pnpm run dev
Open:
http://localhost:5173

