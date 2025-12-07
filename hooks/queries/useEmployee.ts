import { TableParams } from "@/hooks/useTableParams";
import {
  createEmployee,
  deleteEmployee,
  getEmployeeById,
  getEmployees,
  getEmployeesByDepartment,
  updateEmployee,
} from "@/services/employee.service";
import {
  useQuery,
  keepPreviousData,
  useQueryClient,
  useMutation,
} from "@tanstack/react-query";

export const useEmployees = (params: TableParams) => {
  return useQuery({
    queryKey: ["employees", params],
    queryFn: () => getEmployees(params),
    placeholderData: keepPreviousData,
  });
};

export const useEmployeeById = (id: string) => {
  return useQuery({
    queryKey: ["employee", id],
    queryFn: () => getEmployeeById(id),
    placeholderData: keepPreviousData,
    enabled: !!id,
  });
};

export const useEmployeesByDepartment = (departmentId: string) => {
  return useQuery({
    queryKey: ["employees-by-department", departmentId],
    queryFn: () => getEmployeesByDepartment(departmentId),
    placeholderData: keepPreviousData,
    enabled: !!departmentId,
  });
};

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
};

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
};

export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
};
