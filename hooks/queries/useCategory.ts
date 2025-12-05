import { getAllCategories } from "@/services/category.service";
import { useQuery } from "@tanstack/react-query";
export const useCategories = () => {
    return useQuery({
        queryKey: ["categories"],
        queryFn: () => getAllCategories(),
    });
};
