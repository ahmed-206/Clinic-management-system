
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { patientService } from "../../api/patientService";
import { useAuth } from "../useAuth";
import type { Patient } from "../../types/types";

export const usePatients = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const patientsQuery = useQuery({
    queryKey: ["myPatients", user?.id],
    queryFn: () => patientService.getMyPatients(user!.id),
    enabled: !!user?.id,
  });

 
const createPatientMutation = useMutation({
  mutationFn: async (payload: Omit<Patient, 'id' | 'created_at'>) => {
   
    const existing = await patientService.findPatientByPhone(
      payload.booked_by,
      payload.phone
    );

    if (existing) {
      
      return existing as Patient;
    }

    
    return patientService.createPatient(payload);
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['myPatients', user?.id] });
  },
});

  return {
    patients: patientsQuery.data ?? [],
    isLoadingPatients: patientsQuery.isLoading,
    createPatient: createPatientMutation.mutateAsync,
    isCreatingPatient: createPatientMutation.isPending,
  };
};