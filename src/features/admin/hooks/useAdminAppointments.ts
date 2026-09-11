import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { appointmentActions } from "@/features/admin/api/appointmentActions";

export const useAdminAppointments = () => {
  const queryClient = useQueryClient();

  const appointmentsQuery = useQuery({
    queryKey: ["admin-appointments"],
    queryFn: appointmentActions.getAllAppointments,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => 
      appointmentActions.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-appointments"] });
    },
  });

  return { appointmentsQuery, updateStatusMutation };
};