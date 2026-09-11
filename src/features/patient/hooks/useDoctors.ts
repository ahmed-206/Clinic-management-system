import { useQuery } from "@tanstack/react-query";
import { doctorService } from "@/features/doctor/api/doctorService";

export const useDoctors = () => {
    return useQuery({
        queryKey : ['doctors'],
        queryFn : doctorService.getAllDoctor
    })
}