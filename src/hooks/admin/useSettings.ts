import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { settingsActions} from "../../api/admin/settingsActions";
import { type ClinicSettings } from "../../types/types";
import { toast } from "sonner"; 

export const useSettings = () => {
  const queryClient = useQueryClient();

  // 1. جلب البيانات
  const { data: settings, isLoading } = useQuery({
    queryKey: ["clinic-settings"],
    queryFn: settingsActions.getSettings,
  });

  // 2. تحديث البيانات
  const updateMutation = useMutation({
    mutationFn: (updates: Partial<ClinicSettings>) =>
      settingsActions.updateSettings(updates),
    onSuccess: () => {
     
      queryClient.invalidateQueries({ queryKey: ["clinic-settings"] });
      toast.success("Settings updated successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update settings");
    },
  });

  return {
    settings,
    isLoading,
    updateSettings: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
  };
};
