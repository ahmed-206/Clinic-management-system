import supabase from "../supabase";

import type{ BaseAppointment } from "../types/types";



export const appointmentService = {

 async markAppointmentsForReschedule(doctorId: string, date: string) {
  const { data, error } = await supabase
    .from("appointments")
    .update({ status: "reschedule_needed" })
    .eq("doctor_id", doctorId)
    .in("status", ["pending", "confirmed"])
    .gte("appointment_date", `${date}T00:00:00.000`)
    .lte("appointment_date", `${date}T23:59:59.999`);

  if (error) throw error;
  return data;
},
  //  دالةاضافة حجز 
  async createAppointment(data: BaseAppointment) {
    const { data: result, error } = await supabase
      .from("appointments")
      .insert([
        {
          doctor_id: data.doctor_id,
          patient_id: data.patient_id,
          appointment_date: data.appointment_date,
          status: data.status || "pending",
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return result;
  },

 // في ملف appointmentService.ts

async updateAppointment(data: { id: string } & Partial<BaseAppointment>) {
  // 1. جلب بيانات الموعد الحالية للتحقق من حالته وتوقيته
  const { data: existingApp, error: fetchError } = await supabase
    .from("appointments")
    .select("appointment_date, status")
    .eq("id", data.id)
    .single();

  if (fetchError) throw fetchError;

  // 2. تطبيق منطق الـ 24 ساعة
  if (existingApp) {
    const appointmentTime = new Date(existingApp.appointment_date).getTime();
    const currentTime = new Date().getTime();
    const hoursLeft = (appointmentTime - currentTime) / (1000 * 60 * 60);

    // المنع يطبق فقط إذا كان الموعد مؤكداً (Confirmed)
    // أما إذا كان reschedule_needed فنسمح بالتعديل بغض النظر عن الوقت
    if (existingApp.status === 'confirmed' && hoursLeft < 24) {
      throw new Error("Cannot modify confirmed appointments within 24 hours.");
    }
  }

  // 3. تنفيذ التحديث إذا اجتاز الفحص
  const { data: result, error } = await supabase
    .from("appointments")
    .update({
      appointment_date: data.appointment_date,
      status: data.status,
    })
    .eq("id", data.id)
    .select()
    .single();

  if (error) throw error;
  return result;
},

  //  دالة جلب حجوزات المريض
  async getPatientAppointments(patientId: string) {
    const { data, error } = await supabase
      .from("appointments")
      .select(
        `
      id,
      appointment_date,
      status,
      doctor_id,
      doctor:doctor_id (
        name,
        specialty
      )
    `,
      )
      .eq("patient_id", patientId)
      .order("appointment_date", { ascending: true });

    if (error) {
      console.error("Supabase SQL Error:", error.message);
      throw error;
    }
    return data;
  },

  //دالة الغاء الحجز

  async cancelAppointment(appointmentId: string) {
    const { data, error } = await supabase
      .from("appointments")
      .update({ status: "cancelled" })
      .eq("id", appointmentId);
      if(error) throw error;
      return data;
  },
};
