
import  supabase  from "../../supabase";

export const patientActions = {
  // جلب كل المرضى
  async getAllPatients() {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("role", "patient")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  // تغير حالة المريض
 async togglePatientActiveStatus(id: string, currentStatus: boolean) {
    const { error } = await supabase
      .from("profiles")
      .update({ is_active: !currentStatus }) // تعكس الحالة الحالية
      .eq("id", id);

    if (error) throw error;
    return { success: true };
  }
};