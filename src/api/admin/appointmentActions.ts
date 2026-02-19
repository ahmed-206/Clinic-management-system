import  supabase  from "../../supabase";


export const appointmentActions = {
  // Relational Queries
  async getAllAppointments() {
    const { data, error } = await supabase
      .from("appointments")
      .select(`
        *,
        patient:patient_id ( name, email),
        doctor:doctor_id ( name, specialty )
      `)
      .order("appointment_date", { ascending: true });

    if (error) throw error;
    return data;
  },

  async updateStatus(id: string, status: string) {
    const { error } = await supabase
      .from("appointments")
      .update({ status })
      .eq("id", id);

    if (error) throw error;
    return { success: true };
  }
};