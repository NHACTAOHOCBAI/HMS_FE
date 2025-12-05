import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { TableParams } from "../useTableParams";
import { getMedicines } from "@/services/medicine.service";
export const useMedicine = (params: TableParams) => {
    return useQuery({
        queryKey: ["medicines", params],
        queryFn: () => getMedicines(params),
        placeholderData: keepPreviousData,
    });
};

