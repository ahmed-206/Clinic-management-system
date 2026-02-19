import { useQuery } from "@tanstack/react-query";
import { appointmentService } from "../api/appointmentService";
import { useAuth } from "./useAuth";

export const usePatientAppointments = () => {
    const {user} = useAuth();
    return useQuery({
        queryKey:["appointments",user?.id],
        queryFn: () => appointmentService.getPatientAppointments(user!.id),
        enabled : !!user?.id
    })
}