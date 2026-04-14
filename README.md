# 🏥 Clinic Management System

> Small clinics lose patients every day to missed calls, double-bookings, and paper schedules. This system replaces that with real-time appointment booking, role-based dashboards, and digital prescriptions — all in one platform.
---

## Overview

The Clinic Management System connects three types of users — Admins, Doctors, and Patients — on a single unified platform. Each role gets a focused dashboard that eliminates the friction in their daily workflow:

- **Admins** get full visibility over the clinic: staff, patients, revenue, and real-time statistics.
- **Doctors** control their own schedule, manage appointments, and issue digital prescriptions without leaving the dashboard.
- **Patients** can book appointments instantly based on live doctor availability, with zero risk of double-booking.



## Features

### Admin dashboard
- Add, edit, and verify doctor accounts
- Manage the full patient database
- Monitor real-time clinic statistics and revenue

### Doctor dashboard
- **Digital prescriptions** — issue prescriptions directly from the dashboard; appointments are automatically marked as `Completed` once submitted
- **Smart scheduling** — set weekly availability with custom time slots per day
- **Time-off management** — mark vacation days via an interactive calendar
- View and manage all upcoming appointments

### Patient booking
- Dynamic availability — slots update in real time based on the doctor's current schedule
- Instant booking confirmation
- Conflict prevention — double-booking and scheduling clashes are blocked automatically


## 🛠 Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Frontend | React.js, TypeScript | Type-safe component architecture |
| Styling | Tailwind CSS | Utility-first, consistent design system |
| Backend & DB | Supabase (Postgres + Auth + Edge Functions) | Real-time subscriptions and built-in row-level security |
| Data fetching | TanStack Query (React Query) | Server-state caching and background refetching |
| Icons & UI | Lucide React, React Icons | |
| Testing | Vitest, React Testing Library | Component and integration tests |



## Getting started

### Prerequisites

- Node.js 18+
- pnpm (`npm install -g pnpm`)
- A [Supabase](https://supabase.com) account (free tier works)

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/ahmed-206/clinic-management-system.git
cd clinic-management-system
```

**2. Install dependencies**

```bash
pnpm install
```

**3. Set up environment variables**

Create a `.env` file in the root directory:

```env
VITE_APP_SUPABASE_URL=your_supabase_project_url
VITE_APP_SUPABASE_KEY=your_supabase_anon_public_key
```

You can find both values in your Supabase project under **Settings → API**.

**4. Run the development server**

```bash
pnpm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.



## Running tests

```bash
pnpm run test
```

Tests are written with Vitest and React Testing Library, covering core booking flows and role-based access logic.

---

## What I learned

- Designing a role-based access system where three different user types share the same database but see completely different UIs
- Using Supabase Row Level Security (RLS) policies to enforce data access rules at the database level rather than the application layer
- Managing complex scheduling state (availability windows, conflict detection, time-off) with TanStack Query
- Writing integration tests for booking flows that depend on real-time data


