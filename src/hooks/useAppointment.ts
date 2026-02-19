import { useMutation, useQueryClient } from "@tanstack/react-query";
import { appointmentService } from "../api/appointmentService";
import type{  AppointmentMutationInput, BaseAppointment } from "../types/types";


export const useAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AppointmentMutationInput) => {
      if (data.id) {
        // هنا نقوم بعمل Cast لأننا متأكدين أن الـ ID موجود
        return appointmentService.updateAppointment(data as { id: string } & Partial<BaseAppointment>);
      }
      // هنا نقوم بعمل Cast للـ BaseAppointment لأنها لا تحتوي على ID
      return appointmentService.createAppointment(data as BaseAppointment);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["doctor-schedule"] });
    },
  });
};