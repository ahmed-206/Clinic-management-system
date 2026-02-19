import supabase from "../../supabase";
import type { UserProfile, AppointmentData } from "../../types/types";

export interface AdminDashboardData {
  mainStats: {
    doctors: number;
    patients: number;
    todayAppointments: number;
    revenue: number;
  };
  chartData: { date: string; count: number }[];
  // نستخدم AppointmentData التي عرفتها أنت مسبقاً بدلاً من تعريف جديد
  topDoctors: { name: string; count: number }[];
  recentActivity: AppointmentData[];
}

class AdminService {
  async getDashboardStats(): Promise<AdminDashboardData> {
    const today = new Date().toISOString().split("T")[0];

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
    console.log("Total Profiles Found:", profiles.length);
    console.log("Patients Counted:", patientsCount);
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

    // هنا تكمن القوة: نستخدم نوعك الجاهز مباشرة
    const appointments = data as unknown as (AppointmentData & {
      profiles: UserProfile | null;
    })[];

    const todayAppsCount = appointments.filter((a) =>
      a.appointment_date.startsWith(today),
    ).length;

    //  حساب الدخل من الحجوزات المؤكدة
    const revenue = appointments
      .filter((a) => a.status === "confirmed")
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
      recentActivity: appointments.slice(0, 5), // استغلال نفس البيانات للنشاطات الأخيرة
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
      count: appointments.filter((a) => a.appointment_date.startsWith(date))
        .length,
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
