import { type User } from "@supabase/supabase-js";

export interface AppointmentCardProps {
  appointment: {
    id: string;
    doctor_id?: string;
    appointment_date: string;
    status: string;
    doctor: {
      name: string;
      specialty: string;
    };
  };
}

// اخطاء قاعدة البيانات
export interface SupabaseDBError {
  code: string;
  message: string;
}
// تعريف البروفايل
export type UserProfile = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "doctor" | "patient";
  specialty?: string;
  bio?: string; 
  price_per_session?: number;
  is_verified? : boolean,
  is_active? :boolean
};

// محتوى الـ context المقدم لاى صفحة فى الموقع
export type AuthContextType = {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

export interface PatientProfile {
  name: string;
}
// تعريف الموعد الأساسي
// 1. الأساس (الحقول المشتركة)
export interface BaseAppointment {
  doctor_id: string;
  patient_id: string;
  appointment_date: string; 
  status: AppointmentStatus;
}

// 2. البيانات عند الجلب من الداتا بيز (دائماً بها ID وعلاقات)
export interface AppointmentData extends BaseAppointment {
  id: string;
  created_at: string;
  profiles?: { name: string };
  patient: PatientProfile | null;
  doctor?: { name: string; specialty: string }; // للإظهار في كرت المريض
  
}

// 3. البيانات عند الإرسال (Mutation Input) - الحل اللي يغنينا عن any
export type AppointmentMutationInput = 
  | (BaseAppointment & { id?: never }) // حالة الحجز الجديد
  | (Partial<BaseAppointment> & { id: string }); // حالة التعديل


  // تعريف حالة الداشبورد للدكتور

export interface DoctorDashboardStats {
  todayCount: number;
  upcomingCount: number;
  cancelledCount: number;
  nextPatients: AppointmentData[];
}



export type AppointmentStatus = "pending" | "confirmed" | "cancelled" | "completed" | "reschedule_needed";
// ايام الاسبوع المتاحة للدكتور
export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

// بيانات جدول الايام المتاحة للدكتور
export interface DoctorAvailability {
  id?: string;
  doctor_id: string;
  day_of_week: DayOfWeek;
  start_time: string; 
  end_time: string;  
  slot_duration: number; 
  is_available: boolean;
}

// بيانات جدول ايام الغير متاح بها الدكتور
export interface TimeOff {
  id?: string;
  doctor_id: string;
  off_date: string; 
}

// البيانات المرسلة عند اضافة دكتور جديد
export interface DoctorCreateInput {
  email: string;
  name: string;
  specialty: string;
  password?: string;
}


// تعريف واجهة البيانات (Interface) بناءً على جدول SQL
export interface ClinicSettings {
  id: number;
  clinic_name: string;
  clinic_email: string | null;
  clinic_phone: string | null;
  currency: string;
  vat_percentage: number;
  service_fee: number;
  is_maintenance_mode: boolean;
}