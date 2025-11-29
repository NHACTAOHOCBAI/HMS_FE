import { getMedicineById, getMedicines } from "@/services/medicine.service";
import { useQuery } from "@tanstack/react-query";
export const useMedicine = (page: number, limit: number, search?: string) => {
    return useQuery({
        queryKey: ["medicines", page, limit, search],
        queryFn: () => getMedicines({ page, limit, search }),
        // keepPreviousData: true,
    });
};
export const useMedicineById = (id: number | string) => {
    return useQuery({
        queryKey: ["medicine", id],
        queryFn: () => getMedicineById(id),
        enabled: !!id,
    });
};
