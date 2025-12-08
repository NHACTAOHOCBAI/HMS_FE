import { TableParams } from "@/hooks/useTableParams";
import {
  getAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  cancelAppointment,
  completeAppointment,
  checkIn,
} from "@/services/appointment.service";

import {
  useQuery,
  keepPreviousData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

// -------------------------------------------------------------
// Fetch list
// -------------------------------------------------------------
export const useAppointments = (params: TableParams) => {
  return useQuery({
    queryKey: ["appointments", params],
    queryFn: () => getAppointments(params),
    placeholderData: keepPreviousData,
  });
};

// -------------------------------------------------------------
// Fetch by id
// -------------------------------------------------------------
export const useAppointmentById = (id: string) => {
  return useQuery({
    queryKey: ["appointment", id],
    queryFn: () => getAppointmentById(id),
    placeholderData: keepPreviousData,
  });
};

// -------------------------------------------------------------
// Create
// -------------------------------------------------------------
export const useCreateAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
};

// -------------------------------------------------------------
// Update
// -------------------------------------------------------------
export const useUpdateAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
};

// -------------------------------------------------------------
// Cancel
// -------------------------------------------------------------
export const useCancelAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cancelAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
};

// -------------------------------------------------------------
// Complete
// -------------------------------------------------------------
export const useCompleteAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: completeAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
};
// check-in
export const useCheckInAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => checkIn(id),

    onSuccess: () => {
      // refresh lại danh sách appointments
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
};