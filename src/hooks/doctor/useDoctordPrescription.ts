import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { doctorService } from "../../api/doctor/doctorService"
import type { Prescription } from "../../types/types";
import { toast } from 'sonner';
export const useDoctorPrescription = (patientId?: string, onClose?: () => void) => {
    const queryClient = useQueryClient();
    const patientHistory = useQuery({
        queryKey : ['prescription', patientId],
        queryFn : () => doctorService.getPatientHistory(patientId!),
        enabled: !!patientId,
    });

    const addPrescription = useMutation({
        mutationFn: (payload: Prescription) => doctorService.createPrescription(payload),
        onSuccess: async (_, variables) => {
            await doctorService.updateStatus(variables.appointment_id, 'completed')
            // تحديث الكاش لجلب التاريخ المرضي الجديد تلقائياً
            queryClient.invalidateQueries({ queryKey: ['appointments'] });
    queryClient.invalidateQueries({ queryKey: ['prescription', variables.patient_id] });
    
            toast.success("Prescription saved and appointment completed!");
            if (onClose) onClose();
        },
        onError: () => {
            toast.error("حدث خطأ أثناء حفظ الروشتة");
        }
    });

   return {
        history: patientHistory.data,
        isLoadingHistory: patientHistory.isLoading,
        isSaving: addPrescription.isPending,
        savePrescription: addPrescription.mutate,
        error: patientHistory.error
    };
}