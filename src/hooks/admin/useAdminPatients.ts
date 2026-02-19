// hooks/usePatients.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { patientActions } from "../../api/admin/patientActions";

export const useAdminPatients = () => {
  const queryClient = useQueryClient();

  const patientsQuery = useQuery({
    queryKey: ["admin-patients"],
    queryFn: patientActions.getAllPatients,
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({
      id,
      currentStatus,
    }: {
      id: string;
      currentStatus: boolean;
    }) => patientActions.togglePatientActiveStatus(id, currentStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-patients"] });
    },
  });

  return { patientsQuery, toggleStatusMutation };
};
