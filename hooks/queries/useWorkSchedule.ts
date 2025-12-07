import {
  createSchedule,
  deleteSchedule,
  getWeekSchedules,
  getSchedulesByDateAndShift,
  copyToNextWeek,
} from "@/services/workSchedule.service";
import {
  useQuery,
  keepPreviousData,
  useQueryClient,
  useMutation,
} from "@tanstack/react-query";

export const useWeekSchedules = (departmentId: string, weekStart: string) => {
  return useQuery({
    queryKey: ["week-schedules", departmentId, weekStart],
    queryFn: () => getWeekSchedules(departmentId, weekStart),
    placeholderData: keepPreviousData,
    enabled: !!departmentId && !!weekStart,
  });
};

export const useSchedulesByDateAndShift = (
  departmentId: string,
  date: string,
  shiftType: "MORNING" | "AFTERNOON" | "NIGHT"
) => {
  return useQuery({
    queryKey: ["schedules-by-shift", departmentId, date, shiftType],
    queryFn: () => getSchedulesByDateAndShift(departmentId, date, shiftType),
    placeholderData: keepPreviousData,
    enabled: !!departmentId && !!date && !!shiftType,
  });
};

export const useCreateSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["week-schedules"] });
      queryClient.invalidateQueries({ queryKey: ["schedules-by-shift"] });
    },
  });
};

export const useDeleteSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["week-schedules"] });
      queryClient.invalidateQueries({ queryKey: ["schedules-by-shift"] });
    },
  });
};

export const useCopyToNextWeek = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ departmentId, weekStart }: { departmentId: string; weekStart: string }) =>
      copyToNextWeek(departmentId, weekStart),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["week-schedules"] });
    },
  });
};
