import { TableParams } from "@/hooks/useTableParams";
import { createPatient, getPatients } from "@/services/patient.service";
import {
  useQuery,
  keepPreviousData,
  useQueryClient,
  useMutation,
} from "@tanstack/react-query";
export const usePatient = (params: TableParams) => {
  return useQuery({
    queryKey: ["patients", params],
    queryFn: () => getPatients(params),
    placeholderData: keepPreviousData,
  });
};
export const useCreatePatient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
  });
};
