import { useQuery } from "@tanstack/react-query";
import { doctorService } from "../api/doctor/doctorService";

export const useDoctors = () => {
    return useQuery({
        queryKey : ['doctors'],
        queryFn : doctorService.getAllDoctor
    })
}