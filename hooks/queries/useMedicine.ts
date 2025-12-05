import { getMedicines } from "@/services/medicine.service";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
export const useMedicine = (page: number, limit: number, search?: string) => {
    return useQuery({
        queryKey: ["medicines", page, limit, search],
        queryFn: () => getMedicines({ page, limit, search }),
        placeholderData: keepPreviousData,
    });
};

