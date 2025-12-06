import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TableParams } from "../useTableParams";
import { createMedicine, getMedicineById, getMedicines, updateMedicine } from "@/services/medicine.service";
export const useMedicine = (params: TableParams) => {
    return useQuery({
        queryKey: ["medicines", params],
        queryFn: () => getMedicines(params),
        placeholderData: keepPreviousData,
    });
};

//useMedicineById
export const useMedicineById = (id: string) => {
    return useQuery({
        queryKey: ["medicine", id],
        queryFn: () => getMedicineById(id),
    });
}
//useUpdateMedicine
export const useUpdateMedicine = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateMedicine,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["medicines"] });
        },
    });
};
//useCreateMedicine
export const useCreateMedicine = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createMedicine,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["medicines"] });
        },
    });
};