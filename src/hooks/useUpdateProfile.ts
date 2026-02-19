import { useMutation, useQueryClient } from "@tanstack/react-query";
import supabase from "../supabase";
import { toast } from "sonner";
import {type UserProfile } from "../types/types";
import { getErrorMessage } from "../utils/getErrorMessage";

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updatedData: Partial<UserProfile>) => {
     const { data: { session } } = await supabase.auth.getSession();
     const user = session?.user;
      if (!user) throw new Error("لم يتم العثور على جلسة مستخدم نشطة");

      const { data, error } = await supabase
        .from("profiles")
        .upsert({
      id: user.id,          // المفتاح الأساسي
      email: user.email,    // نرسل الإيميل القادم من Auth لضمان عدم تركه فارغاً
      ...updatedData,       // باقي البيانات (الاسم، التخصص، إلخ)
      
    }).select();
        

      if (error) throw error;

      if (!data || data.length === 0) {
        throw new Error("فشل التحديث: لم يتم العثور على بروفايل مطابق في قاعدة البيانات");

      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["auth-user"] });
      toast.success("تم تحديث البروفايل بنجاح");
    },
    onError: (error: unknown) => {
      const friendlyMessage = getErrorMessage(error);
      toast.error(friendlyMessage);
    }
  });
};