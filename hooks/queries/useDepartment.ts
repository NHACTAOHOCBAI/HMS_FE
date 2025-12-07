import { TableParams } from "@/hooks/useTableParams";
import {
  createDepartment,
  deleteDepartment,
  getAllDepartments,
  getDepartmentById,
  getDepartments,
  updateDepartment,
} from "@/services/department.service";
import {
  useQuery,
  keepPreviousData,
  useQueryClient,
  useMutation,
} from "@tanstack/react-query";

export const useDepartments = (params: TableParams) => {
  return useQuery({
    queryKey: ["departments", params],
    queryFn: () => getDepartments(params),
    placeholderData: keepPreviousData,
  });
};

export const useAllDepartments = () => {
  return useQuery({
    queryKey: ["all-departments"],
    queryFn: () => getAllDepartments(),
    placeholderData: keepPreviousData,
  });
};

export const useDepartmentById = (id: string) => {
  return useQuery({
    queryKey: ["department", id],
    queryFn: () => getDepartmentById(id),
    placeholderData: keepPreviousData,
    enabled: !!id,
  });
};

export const useCreateDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      queryClient.invalidateQueries({ queryKey: ["all-departments"] });
    },
  });
};

export const useUpdateDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      queryClient.invalidateQueries({ queryKey: ["all-departments"] });
    },
  });
};

export const useDeleteDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      queryClient.invalidateQueries({ queryKey: ["all-departments"] });
    },
  });
};
