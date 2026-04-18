import supabase from "../../supabase";
import type{  UserProfile, DoctorCreateInput } from "../../types/types";


export const doctorActions = {
  async toggleStatus(id: string, currentStatus: boolean) {
    console.log("Updating ID:", id, "New Status:", !currentStatus);
    const { error } = await supabase
      .from("profiles")
      .update({ is_active: !currentStatus })
      .eq("id", id);
    if (error) throw error;
  },

  async toggleVerification(id: string, currentStatus: boolean) {
    const { error } = await supabase
      .from("profiles")
      .update({ is_verified: !currentStatus })
      .eq("id", id);
    if (error) throw error;
  },

  async updateDoctor(id: string, data: Partial<UserProfile>) {
    const { error } = await supabase
      .from("profiles")
      .update(data)
      .eq("id", id);
    if (error) throw error;
  },

  // اضافة دكتور عن طريق الادمن
  async createDoctor(formData: DoctorCreateInput):Promise<{ message: string; userId: string }> {
const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  
  if (sessionError || !session) {
    console.error("لا توجد جلسة نشطة");
    throw new Error("Session expired, please login again");
  }

  // 2. استدعاء الفانكشن (الطريقة الصحيحة والآمنة)
 
  const { data, error } = await supabase.functions.invoke('create-doctor', {
    body: formData,
  });

  if (error) {
    
    const errorMsg = error instanceof Error ? error.message : "خطأ غير معروف";
    console.error("تفاصيل الخطأ:", error);
    throw new Error(errorMsg);
  }

  return data;
  }
};