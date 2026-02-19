import supabase from "../../supabase";
import type {
   DoctorDashboardStats,
   AppointmentData, AppointmentStatus, DoctorAvailability
} from "../../types/types";

export const doctorService = {
  async getAllDoctor() {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("role", "doctor");

    if (error) throw new Error(error.message);
    return data;
  },

  // جلب بيانات طبيب واحد فقط بالاسم والتخصص
async getDoctorBasicInfo(doctorId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("name, specialty, bio, price_per_session")
    .eq("id", doctorId)
    .single();

  if (error) throw error;
  return data;
},

  // عرض الصفحة الرئيسة فى داش بورد الدكتور
  async getDashboardState(doctorId: string): Promise<DoctorDashboardStats> {
    // انشاء نص يمثل تاريخ اليوم
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    const localISOTime = new Date(now.getTime() - offset)
      .toISOString()
      .split("T")[0];

    const { data, error } = await supabase
      .from("appointments")
      .select(
        `
      id,
      status,
      appointment_date,
      patient_id,
      profiles:patient_id (
        name
      )
    `,
      )
      .eq("doctor_id", doctorId)
      .returns<AppointmentData[]>();

    if (error) {
      console.error("Database Error Detail:", error.message, error.hint);
      throw error;
    }

    return {
      todayCount:
        data?.filter((a) => a.appointment_date?.startsWith(localISOTime))
          .length || 0,
      upcomingCount:
        data?.filter((a) => new Date(a.appointment_date) > new Date()).length ||
        0,
      cancelledCount: data?.filter((a) => a.status === "cancelled").length || 0,
      nextPatients:
        data
          ?.filter((a) => {
            const appointmentDate = a.appointment_date?.split("T")[0];
            return (
              appointmentDate === localISOTime &&
              (a.status?.toLowerCase() === "confirmed" ||
                a.status?.toLowerCase() === "pending")
            );
          })
          .slice(0, 2) || [],
    };
  },

  // جلب كل المواعيد
  async getAllAppointments(doctorId: string): Promise<AppointmentData[]> {
    const { data, error } = await supabase
      .from("appointments")
      .select(
        `
      id,
      status,
      appointment_date,
      patient_id,
      profiles:patient_id ( name )
    `,
      )
      .eq("doctor_id", doctorId).neq("status", "cancelled")
      .order("appointment_date", { ascending: false })
      .returns<AppointmentData[]>();

    if (error) throw error;
    return data || [];
  },

  // تحديث الحالة 
  async updateStatus(
    appointmentId: string,
    status: AppointmentStatus,
  ) {
    const { error } = await supabase
      .from("appointments")
      .update({ status })
      .eq("id", appointmentId);

    if (error) throw error;
  },

  // دالة ارسال الجدول الاسبوعى للدكتور 
  async saveWeeklyAvailability(availability: DoctorAvailability[]) {
  const { data, error } = await supabase
    .from("doctor_availability")
    .upsert(availability, { onConflict: 'doctor_id,day_of_week'}); // يمنع تكرار نفس اليوم للدكتور

  if (error) throw error;
  return data;
},


// دالة ارسال ايام التى لا يعمل فيها الدكتور
async addTimeOff(payload: { doctor_id: string; off_date: string }) {
  const { error } = await supabase.from("doctor_time_off").insert(payload);
  if (error) throw error;
},

// دالة تجلب الإجازات الحالية
async getTimeOff(doctorId: string) {
  const { data, error } = await supabase
    .from("doctor_time_off")
    .select("*")
    .eq("doctor_id", doctorId);
  if (error) throw error;
  return data;
},

// دالة لحذف إجازة إذا غير الطبيب رأيه
async removeTimeOff(id: string) {
  const { error } = await supabase.from("doctor_time_off").delete().eq("id", id);
  if (error) throw error;
},

// قراءة جدول الدكتور 
async getWeeklyAvailability(doctorId: string) {
  const { data, error } = await supabase
    .from("doctor_availability")
    .select("*")
    .eq("doctor_id", doctorId);

  if (error) throw error;
  return data as DoctorAvailability[];
}
};



