import { getMedicines } from "@/services/medicine.service";
import { useQuery } from "@tanstack/react-query";
export const useMedicine = (page: number, limit: number) => {
    return useQuery({
        queryKey: ["medicines", page, limit],
        queryFn: () => getMedicines({ page, limit }),
    });
};
