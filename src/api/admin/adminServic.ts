import supabase from "../../supabase";
import type { UserProfile, AppointmentData } from "../../types/types";
import { toLocalISODate } from "../../utils/dateTimeFormate";

export interface AdminDashboardData {
  mainStats: {
    doctors: number;
    patients: number;
    todayAppointments: number;
    revenue: number;
  };
  chartData: { date: string; count: number }[];
  topDoctors: { name: string; count: number }[];
  recentActivity: AppointmentData[];
}

class AdminService {
  async getDashboardStats(): Promise<AdminDashboardData> {
    // Use local date — toISOString() gives UTC which is wrong for UTC+ clinics
    const today = toLocalISODate(new Date());

    // 1. جلب الأدوار (استخدام نوع UserProfile للحصول على التلميحات)
    const { data: profilesData } = await supabase
      .from("profiles")
      .select("role");
    const profiles = profilesData as Pick<UserProfile, "role">[]; // نأخذ فقط الـ role من النوع الأصلي

    // عدد الدكاترة والمرضى
    const doctorsCount =
      profiles?.filter((p) => p.role === "doctor").length || 0;
    const patientsCount =
      profiles?.filter((p) => p.role === "patient").length || 0;
    
    
    // 2. جلب الحجوزات (استخدام AppointmentData التي تملكها)
    const { data, error } = await supabase.from("appointments").select(`
        id,
        appointment_date,
        status,
        created_at,
        doctor_id,
        patient_id,
        profiles!doctor_id (name, price_per_session)
      `);

    if (error) throw error;

   
    const appointments = data as unknown as (AppointmentData & {
      profiles: UserProfile | null;
    })[];

    // Compare using LOCAL date of appointment, not the raw ISO string prefix
    const todayAppsCount = appointments.filter(
      (a) => toLocalISODate(a.appointment_date) === today,
    ).length;

    // حساب الدخل من الحجوزات المؤكدة والمكتملة
    
    const revenue = appointments
      .filter((a) => a.status === "confirmed" || a.status === "completed")
      .reduce(
        (sum, a) => sum + (Number(a.profiles?.price_per_session) || 0),
        0,
      );

    return {
      mainStats: {
        doctors: doctorsCount,
        patients: patientsCount,
        todayAppointments: todayAppsCount,
        revenue: revenue,
      },
      chartData: this.prepareChartData(appointments),
      topDoctors: this.getTopDoctors(appointments),
      // Sort by created_at descending 
      recentActivity: [...appointments]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5),
    };
  }

  // 2. دالة النشاطات الأخيرة (مدمجة داخل الـ Class)
  async getRecentActivity(): Promise<AppointmentData[]> {
    const { data, error } = await supabase
      .from("appointments")
      .select(
        `
        id,
        status,
        appointment_date,
        doctor_id,
        patient_id,
        profiles:patient_id ( name )
      `,
      )
      .order("created_at", { ascending: false })
      .limit(5);

    if (error) throw error;

    return data as unknown as AppointmentData[];
  }
  // استخدام الأنواع الممررة في البارامترات لضمان التوافق
  private prepareChartData(appointments: { appointment_date: string }[]) {
    const last7Days = [...Array(7)]
      .map((_, i) => {
        const day = new Date();
        // getDate => هات رقم اليوم من الشهر
        day.setDate(day.getDate() - i);
        return day.toISOString().split("T")[0];
      })
      .reverse();

    return last7Days.map((date) => ({
      date: date.split("-").slice(1).join("/"),
      // Use local date comparison — startsWith(date) breaks for UTC-stored timestamps
      count: appointments.filter(
        (a) => toLocalISODate(a.appointment_date) === date,
      ).length,
    }));
  }

  private getTopDoctors(
    appointments: (AppointmentData & { profiles: UserProfile | null })[],
  ) {
    // منطق التجميع... (يبقى كما هو لكن بضمان أن الـ profiles تتبع UserProfile)
    const doctorCounts: Record<string, { name: string; count: number }> = {};
    appointments.forEach((a) => {
      const docName = a.profiles?.name || "Unknown";
      if (!doctorCounts[a.doctor_id])
        doctorCounts[a.doctor_id] = { name: docName, count: 0 };
      doctorCounts[a.doctor_id].count++;
    });
    return Object.values(doctorCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);
  }
}

export const adminService = new AdminService();
