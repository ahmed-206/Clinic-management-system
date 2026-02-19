import { useQuery } from "@tanstack/react-query";
import { doctorService } from "../api/doctor/doctorService";

export const useDoctorDashboard = (doctorId : string) => {
    return useQuery ({
        queryKey : ['doctor-dashboard', doctorId],
        queryFn : () => doctorService.getDashboardState(doctorId),
        enabled : !!doctorId
    })
}