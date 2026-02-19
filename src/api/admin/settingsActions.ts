import supabase from "../../supabase";
import { type ClinicSettings } from "../../types/types";


export const settingsActions = {

  async getSettings(): Promise<ClinicSettings> {
    const { data, error } = await supabase
      .from("clinic_settings")
      .select("*")
      .eq("id", 1) // نضمن جلب الصف رقم 1 فقط
      .single(); 

    if (error) {
      console.error("Error fetching settings:", error.message);
      throw error;
    }
    return data;
  },

  /* تحديث الإعدادات*/
  async updateSettings(updates: Partial<ClinicSettings>) {
    const { data, error } = await supabase
      .from("clinic_settings")
      .update(updates)
      .eq("id", 1); // نحدث دائماً الصف رقم 1

    if (error) {
      console.error("Error updating settings:", error.message);
      throw error;
    }
    return data;
  }
};