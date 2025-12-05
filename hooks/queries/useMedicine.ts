import { MedicineFiltersState } from "@/app/admin/medicines/page";
import { createMedicine, getMedicines } from "@/services/medicine.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
export const useMedicines = (filters: MedicineFiltersState) => {
    return useQuery({
        queryKey: ["medicines", filters],
        queryFn: () => getMedicines(filters),
        // keepPreviousData: true,
    });
};
export const useCreateMedicine = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createMedicine,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["medicines"] })
        },
    });
}