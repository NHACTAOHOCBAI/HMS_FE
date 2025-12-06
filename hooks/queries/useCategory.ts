import { createCategory, getCategories, updateCategory } from "@/services/category.service";
import { keepPreviousData, QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TableParams } from "../useTableParams";
export const useCategory = (params: TableParams) => {
    return useQuery({
        queryKey: ["categories", params],
        queryFn: () => getCategories(params),
        placeholderData: keepPreviousData,
    });
};
// useUpdateCategory
export const useUpdateCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: ({ id, data }: { id: string; data: any }) => {
            return updateCategory(id, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
    });
};
//useCreateCategory
export const useCreateCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
    });
};