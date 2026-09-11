import { useQuery } from "@tanstack/react-query";
import { appointmentService } from "@/features/appointments/api/appointmentService";
import { useAuth } from "@/features/auth/hooks/useAuth";

export const usePatientAppointments = () => {
    const {user} = useAuth();
    return useQuery({
        queryKey:["appointments",user?.id],
        queryFn: () => appointmentService.getPatientAppointments(user!.id),
        enabled : !!user?.id
    })
}