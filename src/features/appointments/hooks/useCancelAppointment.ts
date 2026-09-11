import { useMutation, useQueryClient } from "@tanstack/react-query";

import { appointmentService } from "@/features/appointments/api/appointmentService";

export const useCancelAppointment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn : (id: string) => appointmentService.cancelAppointment(id),
        onSuccess : () => {
            queryClient.invalidateQueries({queryKey: ['appointments']})
        }
    })
}
