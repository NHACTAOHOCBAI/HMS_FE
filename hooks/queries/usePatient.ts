import { TableParams } from "@/hooks/useTableParams";
import { getPatients } from "@/services/patient.service";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
export const usePatient = (params: TableParams) => {
  return useQuery({
    queryKey: ["mock-users", params],
    queryFn: () => getPatients(params),
    placeholderData: keepPreviousData,
  });
};
