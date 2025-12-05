import { getCategories } from "@/services/category.service";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
export const useCategories = (filters: any) => {
  return useQuery({
    queryKey: ["categories", filters],
    queryFn: () => getCategories(filters),
    placeholderData: keepPreviousData,
  });
};
