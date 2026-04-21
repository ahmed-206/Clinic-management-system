
import supabase from "../supabase";
import type { Patient } from "../types/types";

export const patientService = {

  // جلب كل patients اللي الـ user حجزهم
  async getMyPatients(userId: string): Promise<Patient[]> {
    const { data, error } = await supabase
      .from("patients")
      .select("*")
      .eq("booked_by", userId)
      .order("created_at", { ascending: true });
    if (error) throw error;
    return data || [];
  },

  // إنشاء patient جديد
  async createPatient(payload: Omit<Patient, "id" | "created_at">): Promise<Patient> {
    const { data, error } = await supabase
      .from("patients")
      .insert(payload)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};