import { useQuery } from "@tanstack/react-query";
import { doctorService } from "@/features/doctor/api/doctorService";

export const useDoctorDashboard = (doctorId : string) => {
    return useQuery ({
        queryKey : ['doctor-dashboard', doctorId],
        queryFn : () => doctorService.getDashboardState(doctorId),
        enabled : !!doctorId
    })
}