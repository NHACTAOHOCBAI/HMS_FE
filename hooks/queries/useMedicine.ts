import { MedicineFiltersState } from "@/app/admin/medicines/components/Medicines";
import { createMedicine, getMedicines } from "@/services/medicine.service";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
export const useMedicines = (filters: MedicineFiltersState) => {
  return useQuery({
    queryKey: ["medicines", filters],
    queryFn: () => getMedicines(filters),
    placeholderData: keepPreviousData,
  });
};
export const useCreateMedicine = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createMedicine,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medicines"] });
    },
  });
};
