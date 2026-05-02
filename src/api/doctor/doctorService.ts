import supabase from "../../supabase";
import type {
   DoctorDashboardStats,
   AppointmentData, AppointmentStatus, DoctorAvailability,
   Prescription
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
      actual_patient_id,
      profiles:patient_id (
        name
      ),
      patients!fk_actual_patient (
      full_name,
      phone
    )
    `,
      )
      .eq("doctor_id", doctorId);

    if (error) {
      console.error("Database Error Detail:", error.message, error.hint);
      throw error;
    }
     const appointments = data as unknown as AppointmentData[];

    return {
      todayCount:
        appointments?.filter((a) => a.appointment_date?.startsWith(localISOTime))
          .length || 0,
      upcomingCount:
        appointments?.filter((a) => new Date(a.appointment_date) > new Date()).length ||
        0,
      cancelledCount: appointments?.filter((a) => a.status === "cancelled").length || 0,
      nextPatients:
        appointments
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
      actual_patient_id,
      profiles:patient_id ( name ),
      patients!fk_actual_patient (
        id,
        full_name,
        phone,
        gender,
        date_of_birth
      )
    `,
      )
      .eq("doctor_id", doctorId)
      .order("appointment_date", { ascending: false });

    if (error) throw error;

    const appointments = (data as unknown as AppointmentData[]) || [];

    // Auto-cancel any reschedule_needed appointments whose date has already passed.
    // This handles the case where the patient never rescheduled before the original slot passed.
    const now = new Date();
    const expiredRescheduleIds = appointments
      .filter(
        (a) =>
          a.status === "reschedule_needed" &&
          new Date(a.appointment_date) < now,
      )
      .map((a) => a.id!);

    if (expiredRescheduleIds.length > 0) {
      await supabase
        .from("appointments")
        .update({ status: "cancelled" })
        .in("id", expiredRescheduleIds);

      // Reflect the change locally so the caller gets the updated statuses
      return appointments.map((a) =>
        expiredRescheduleIds.includes(a.id!)
          ? { ...a, status: "cancelled" as AppointmentStatus }
          : a,
      );
    }

    return appointments;
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
    const toUpdate = availability.filter((row) => !!row.id);
    const toInsert = availability.filter((row) => !row.id);

    // Update existing rows one-by-one (or batch via upsert with id)
    if (toUpdate.length > 0) {
      const { error } = await supabase
        .from("doctor_availability")
        .upsert(toUpdate, { onConflict: "id" });
      if (error) throw error;
    }

    // Insert brand-new rows
    if (toInsert.length > 0) {
      const { error } = await supabase
        .from("doctor_availability")
        .upsert(toInsert, { onConflict: "doctor_id,day_of_week" });
      if (error) throw error;
    }
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
},



// كتابة الروشتة للمريض
async getPatientHistory(actualPatientId: string){
const { data: history,error } = await supabase
  .from('prescriptions')
  .select(`
  *,
  profiles!fk_doctor ( name )
`) // لجلب اسم الدكتور اللي كتب الروشتة السابقة
  .eq('actual_patient_id', actualPatientId)
  .order('created_at', { ascending: false });
  if (error) {
    console.error("Error fetching patient history:", error.message);
    throw error;
  }
  return history;
},


// دالة إضافية: حفظ روشتة جديدة
async createPrescription(payload: Prescription) {
  const { data: { user } } = await supabase.auth.getUser();
   let actualPatientId = payload.actual_patient_id;
  if (!actualPatientId && payload.appointment_id) {
    const { data: appt } = await supabase
      .from('appointments')
      .select('actual_patient_id')
      .eq('id', payload.appointment_id)
      .single();
    actualPatientId = appt?.actual_patient_id ?? null;
  }
  const { data, error } = await supabase
    .from('prescriptions')
    .insert({
      ...payload,
      doctor_id: user!.id,  //  override with real auth UID
      actual_patient_id: actualPatientId,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}
};



