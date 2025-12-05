import { getCategories } from "@/services/category.service";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { TableParams } from "../useTableParams";
export const useCategory = (params: TableParams) => {
    return useQuery({
        queryKey: ["categories", params],
        queryFn: () => getCategories(params),
        placeholderData: keepPreviousData,
    });
};
