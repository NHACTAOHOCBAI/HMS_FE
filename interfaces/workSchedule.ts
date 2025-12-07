export interface WorkSchedule {
  id: string;
  employeeId: string;
  employeeName: string;
  departmentId: string;
  date: string;
  dayOfWeek: number;
  shiftType: "MORNING" | "AFTERNOON" | "NIGHT";
  startTime: string;
  endTime: string;
  note?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ShiftType {
  key: "MORNING" | "AFTERNOON" | "NIGHT";
  label: string;
  startTime: string;
  endTime: string;
}

export interface CreateScheduleData {
  employeeId: string;
  departmentId: string;
  date: string;
  shiftType: "MORNING" | "AFTERNOON" | "NIGHT";
  note?: string;
}

export const SHIFT_TYPES: ShiftType[] = [
  { key: "MORNING", label: "Ca sáng", startTime: "7:00", endTime: "12:00" },
  { key: "AFTERNOON", label: "Ca chiều", startTime: "13:00", endTime: "18:00" },
  { key: "NIGHT", label: "Ca tối", startTime: "18:00", endTime: "23:00" },
];
