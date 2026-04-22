// hooks/useNotifications.ts
import { useEffect, useState } from "react";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { notificationService} from "../../api/notification/notificationService";
import { useAuth } from "../useAuth";
import supabase from "../../supabase";

export const useNotifications = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [hasNew, setHasNew] = useState(false);

  // جلب الـ notifications
  const { data: notifications = [] } = useQuery({
    queryKey: ["notifications", user?.id],
    queryFn: notificationService.getMyNotifications,
    enabled: !!user?.id,
  });

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  // ✅ Supabase Realtime — بيسمع أي notification جديدة
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel("notifications-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          // حدّث الـ cache وورّي إن في حاجة جديدة
          queryClient.invalidateQueries({ queryKey: ["notifications", user.id] });
          setHasNew(true);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, queryClient]);

  const markAsReadMutation = useMutation({
    mutationFn: notificationService.markAsRead,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["notifications", user?.id] }),
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: notificationService.markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", user?.id] });
      setHasNew(false);
    },
  });

  return {
    notifications,
    unreadCount,
    hasNew,
    markAsRead: markAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
  };
};