import { createPatient, getPatients } from "@/services/patient.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
const usePatient = (page: number, limit: number) => {
  return useQuery({
    queryKey: ["mock-users", page, limit],
    queryFn: () => getPatients({ page, limit }),
  });
};
const useCreatePatient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mock-users"] });
    },
  });
};
export { usePatient, useCreatePatient };
