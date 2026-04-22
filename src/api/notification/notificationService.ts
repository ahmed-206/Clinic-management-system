// api/notificationService.ts
import supabase from "../../supabase";

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  body: string;
  type: string;
  channel: string;
  is_read: boolean;
  metadata: Record<string, string>;
  created_at: string;
}

export const notificationService = {
  async getMyNotifications(): Promise<Notification[]> {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);
    if (error) throw error;
    return data || [];
  },

  async markAsRead(id: string) {
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", id);
    if (error) throw error;
  },

  async markAllAsRead() {
    const { error } = await supabase.rpc("mark_all_notifications_read");
    if (error) throw error;
  },
};