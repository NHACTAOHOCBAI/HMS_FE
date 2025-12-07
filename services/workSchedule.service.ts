import { WorkSchedule, CreateScheduleData, SHIFT_TYPES } from "@/interfaces/workSchedule";
import { EMPLOYEES } from "./employee.service";

// ----------------------------------------------------------------------
// Mock Data
// ----------------------------------------------------------------------
const generateMockSchedules = (): WorkSchedule[] => {
  // Initially empty - schedules will be added through UI
  return [];
};

export let SCHEDULES: WorkSchedule[] = generateMockSchedules();

// ----------------------------------------------------------------------
// GET WEEK SCHEDULES
// ----------------------------------------------------------------------
export const getWeekSchedules = async (departmentId: string, weekStart: string) => {
  await new Promise((r) => setTimeout(r, 300));

  const weekStartDate = new Date(weekStart);
  const weekEndDate = new Date(weekStartDate);
  weekEndDate.setDate(weekEndDate.getDate() + 6);

  const filtered = SCHEDULES.filter((s) => {
    const scheduleDate = new Date(s.date);
    return (
      s.departmentId === departmentId &&
      scheduleDate >= weekStartDate &&
      scheduleDate <= weekEndDate &&
      s.isActive
    );
  });

  return {
    status: "success",
    data: filtered,
  };
};

// ----------------------------------------------------------------------
// GET SCHEDULES BY DATE AND SHIFT
// ----------------------------------------------------------------------
export const getSchedulesByDateAndShift = async (
  departmentId: string,
  date: string,
  shiftType: "MORNING" | "AFTERNOON" | "NIGHT"
) => {
  await new Promise((r) => setTimeout(r, 200));

  return SCHEDULES.filter(
    (s) =>
      s.departmentId === departmentId &&
      s.date === date &&
      s.shiftType === shiftType &&
      s.isActive
  );
};

// ----------------------------------------------------------------------
// CREATE SCHEDULE
// ----------------------------------------------------------------------
export const createSchedule = async (data: CreateScheduleData) => {
  console.log("Tạo lịch làm việc:", data);
  await new Promise((r) => setTimeout(r, 300));

  const shift = SHIFT_TYPES.find((s) => s.key === data.shiftType);
  const employee = EMPLOYEES.find((e) => e.id === data.employeeId);
  
  const newSchedule: WorkSchedule = {
    id: `sch-${Date.now()}`,
    employeeId: data.employeeId,
    employeeName: employee?.fullName || "Không xác định",
    departmentId: data.departmentId,
    date: data.date,
    dayOfWeek: new Date(data.date).getDay(),
    shiftType: data.shiftType,
    startTime: shift?.startTime || "00:00",
    endTime: shift?.endTime || "00:00",
    note: data.note,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  SCHEDULES.push(newSchedule);
  return newSchedule;
};

// ----------------------------------------------------------------------
// DELETE SCHEDULE
// ----------------------------------------------------------------------
export const deleteSchedule = async (id: string) => {
  console.log("Xóa lịch làm việc:", id);
  await new Promise((r) => setTimeout(r, 300));

  SCHEDULES = SCHEDULES.filter((s) => s.id !== id);
  return true;
};

// ----------------------------------------------------------------------
// COPY TO NEXT WEEK
// ----------------------------------------------------------------------
export const copyToNextWeek = async (departmentId: string, currentWeekStart: string) => {
  console.log("Sao chép lịch sang tuần sau:", departmentId, currentWeekStart);
  await new Promise((r) => setTimeout(r, 500));

  const currentStart = new Date(currentWeekStart);
  const currentEnd = new Date(currentStart);
  currentEnd.setDate(currentEnd.getDate() + 6);

  const nextWeekStart = new Date(currentStart);
  nextWeekStart.setDate(nextWeekStart.getDate() + 7);

  const currentWeekSchedules = SCHEDULES.filter((s) => {
    const scheduleDate = new Date(s.date);
    return (
      s.departmentId === departmentId &&
      scheduleDate >= currentStart &&
      scheduleDate <= currentEnd &&
      s.isActive
    );
  });

  const newSchedules = currentWeekSchedules.map((s) => {
    const oldDate = new Date(s.date);
    const newDate = new Date(oldDate);
    newDate.setDate(newDate.getDate() + 7);

    return {
      ...s,
      id: `sch-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      date: newDate.toISOString().split("T")[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  });

  SCHEDULES.push(...newSchedules);

  return {
    copied: newSchedules.length,
    message: `Đã sao chép ${newSchedules.length} lịch trực sang tuần sau`,
  };
};

// ----------------------------------------------------------------------
// HELPER: Get week dates
// ----------------------------------------------------------------------
export const getWeekDates = (weekStart: string) => {
  const start = new Date(weekStart);
  const dates = [];
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(start);
    date.setDate(date.getDate() + i);
    dates.push({
      date: date.toISOString().split("T")[0],
      dayOfWeek: date.getDay(),
      dayLabel: getDayLabel(date.getDay()),
      dayNumber: date.getDate(),
      month: date.getMonth() + 1,
    });
  }
  
  return dates;
};

const getDayLabel = (dayOfWeek: number): string => {
  const labels = ["CN", "Th 2", "Th 3", "Th 4", "Th 5", "Th 6", "Th 7"];
  return labels[dayOfWeek];
};
