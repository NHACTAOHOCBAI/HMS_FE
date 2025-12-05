import { getPatients } from "@/services/patient.service";
import { useQuery } from "@tanstack/react-query";
export const usePatient = (page: number, limit: number) => {
  return useQuery({
    queryKey: ["mock-users", page, limit],
    queryFn: () => getPatients({ page, limit }),
  });
};
