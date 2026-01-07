"use client";

import { useMemo, useState } from "react";
import {
  addDays,
  endOfMonth,
  endOfWeek,
  format,
  startOfMonth,
  startOfWeek,
  differenceInCalendarDays,
  isToday,
} from "date-fns";
import { vi } from "date-fns/locale";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  Users,
  Building2,
  Sparkles,
  Filter,
  Info,
  CheckCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import ScheduleForm from "./_components/ScheduleForm";
import { ScheduleStatusBadge } from "../_components/schedule-status-badge";
import {
  useDoctorSchedules,
  useCreateSchedule,
  useUpdateSchedule,
  useDeleteSchedule,
  useDepartments,
  useEmployees,
} from "@/hooks/queries/useHr";
import type {
  ScheduleRequest,
  ScheduleStatus,
  EmployeeSchedule,
  Department,
  Employee,
} from "@/interfaces/hr";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";

const shiftPresets = [
  {
    key: "MORNING" as const,
    label: "Ca sáng",
    time: "07:00 - 12:00",
    bg: "bg-amber-50 border-amber-200",
    headerBg: "bg-amber-100",
    textColor: "text-amber-700",
  },
  {
    key: "AFTERNOON" as const,
    label: "Ca chiều",
    time: "13:00 - 18:00",
    bg: "bg-sky-50 border-sky-200",
    headerBg: "bg-sky-100",
    textColor: "text-sky-700",
  },
  {
    key: "EVENING" as const,
    label: "Ca tối",
    time: "18:00 - 23:00",
    bg: "bg-violet-50 border-violet-200",
    headerBg: "bg-violet-100",
    textColor: "text-violet-700",
  },
];

const inferShift = (start: string): "MORNING" | "AFTERNOON" | "EVENING" => {
  const hour = parseInt(start.split(":")[0] || "0", 10);
  if (hour < 12) return "MORNING";
  if (hour < 18) return "AFTERNOON";
  return "EVENING";
};

export default function SchedulesPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [activeDept, setActiveDept] = useState<string>("ALL");
  const [activeEmployee, setActiveEmployee] = useState<string>("ALL");
  const [viewMode, setViewMode] = useState<"week" | "month">("week");

  const weekStart = useMemo(
    () => startOfWeek(date || new Date(), { weekStartsOn: 1 }),
    [date]
  );
  const weekEnd = useMemo(
    () => endOfWeek(weekStart, { weekStartsOn: 1 }),
    [weekStart]
  );
  const weekDays = useMemo(
    () => Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i)),
    [weekStart]
  );
  const monthStart = useMemo(() => startOfMonth(date || new Date()), [date]);
  const monthEnd = useMemo(() => endOfMonth(monthStart), [monthStart]);
  const monthDays = useMemo(() => {
    const total = differenceInCalendarDays(monthEnd, monthStart) + 1;
    return Array.from({ length: total }).map((_, i) => addDays(monthStart, i));
  }, [monthEnd, monthStart]);

  // Fetch data from API
  const { data: departmentsData } = useDepartments({ size: 100 });
  const { data: employeesData } = useEmployees({ size: 100 });

  const startDate =
    viewMode === "month"
      ? format(monthStart, "yyyy-MM-dd")
      : format(weekStart, "yyyy-MM-dd");
  const endDate =
    viewMode === "month"
      ? format(monthEnd, "yyyy-MM-dd")
      : format(weekEnd, "yyyy-MM-dd");

  const {
    data: schedulesData,
    isLoading,
    error,
  } = useDoctorSchedules({
    startDate,
    endDate,
    departmentId: activeDept !== "ALL" ? activeDept : undefined,
    doctorId: activeEmployee !== "ALL" ? activeEmployee : undefined,
  });

  const createSchedule = useCreateSchedule();
  const updateSchedule = useUpdateSchedule();
  const deleteSchedule = useDeleteSchedule();

  const schedules = schedulesData?.content ?? [];
  const departments = departmentsData?.content ?? [];
  const employees = employeesData?.content ?? [];

  const filtered = useMemo(() => {
    return schedules.map((item: EmployeeSchedule) => ({
      ...item,
      shift: inferShift(item.startTime),
    }));
  }, [schedules]);

  const handleCreate = (data: ScheduleRequest) => {
    createSchedule.mutate(data, {
      onSuccess: () => {
        setIsCreateOpen(false);
      },
      onError: (error) => {
        console.error("Failed to create schedule:", error);
        alert("Không thể tạo lịch. Nhân viên có thể đã có lịch trong ngày này.");
      },
    });
  };

  const handleDelete = () => {
    if (!deleteId) return;
    deleteSchedule.mutate(deleteId, {
      onSuccess: () => {
        setDeleteId(null);
      },
      onError: (error) => {
        console.error("Failed to delete schedule:", error);
        alert("Không thể xóa lịch.");
      },
    });
  };

  const editInitial = useMemo(() => {
    if (!editId) return undefined;
    const item = schedules.find((s: EmployeeSchedule) => s.id === editId);
    if (!item) return undefined;
    return {
      employeeId: item.employeeId,
      workDate: item.workDate,
      startTime: item.startTime,
      endTime: item.endTime,
      status: item.status,
      notes: "",
    } as Partial<ScheduleRequest>;
  }, [editId, schedules]);

  const handleUpdate = (data: ScheduleRequest) => {
    if (!editId) return;
    updateSchedule.mutate(
      { id: editId, ...data },
      {
        onSuccess: () => {
          setEditId(null);
        },
        onError: (error) => {
          console.error("Failed to update schedule:", error);
          alert("Không thể cập nhật lịch.");
        },
      }
    );
  };

  if (error) {
    return (
      <div className="w-full space-y-6">
        <Card className="border-2 border-red-200 bg-red-50">
          <CardContent className="flex items-center gap-3 pt-6">
            <Info className="h-5 w-5 text-red-600" />
            <div>
              <p className="font-medium text-red-800">Lỗi tải dữ liệu</p>
              <p className="text-sm text-red-700">Vui lòng thử lại sau.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Schedule Header Card */}
      <Card className="border-2 border-slate-200 shadow-sm overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-violet-500 to-purple-500" />
        <CardHeader className="flex flex-wrap items-center justify-between gap-4 pb-4">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-violet-600" />
              Lịch làm việc
            </CardTitle>
            <CardDescription>
              Quản lý lịch làm việc của nhân viên
            </CardDescription>
          </div>
          
          {/* Navigation Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-100 rounded-xl p-1">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-lg h-8 w-8"
                onClick={() =>
                  setDate(
                    addDays(date || new Date(), viewMode === "week" ? -7 : -30)
                  )
                }
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-lg px-3"
                onClick={() => setDate(new Date())}
              >
                Hôm nay
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-lg h-8 w-8"
                onClick={() =>
                  setDate(
                    addDays(date || new Date(), viewMode === "week" ? 7 : 30)
                  )
                }
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <Badge variant="outline" className="px-3 py-1.5 bg-white">
              <CalendarDays className="h-3.5 w-3.5 mr-1.5" />
              {viewMode === "week"
                ? `${format(weekStart, "dd/MM")} - ${format(weekEnd, "dd/MM/yyyy")}`
                : format(monthStart, "MMMM yyyy", { locale: vi })}
            </Badge>

            <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
              <Button
                variant={viewMode === "week" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("week")}
                className={cn(
                  "rounded-lg px-3",
                  viewMode === "week" && "bg-violet-600 hover:bg-violet-700"
                )}
              >
                Tuần
              </Button>
              <Button
                variant={viewMode === "month" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("month")}
                className={cn(
                  "rounded-lg px-3",
                  viewMode === "month" && "bg-violet-600 hover:bg-violet-700"
                )}
              >
                Tháng
              </Button>
            </div>

            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 rounded-xl">
                  <Plus className="mr-2 h-4 w-4" /> Tạo lịch mới
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Tạo lịch làm việc</DialogTitle>
                </DialogHeader>
                <ScheduleForm
                  onSubmit={handleCreate}
                  isLoading={createSchedule.isPending}
                  onCancel={() => setIsCreateOpen(false)}
                  initialData={{
                    workDate: format(date || weekStart, "yyyy-MM-dd"),
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <Filter className="h-4 w-4 text-slate-500" />
            <span className="text-sm font-medium text-slate-600">Lọc theo:</span>
            <Select value={activeDept} onValueChange={(v) => setActiveDept(v)}>
              <SelectTrigger className="w-56 bg-white border-2">
                <Building2 className="h-4 w-4 mr-2 text-slate-400" />
                <SelectValue placeholder="Khoa phòng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tất cả khoa phòng</SelectItem>
                {departments.map((dept: Department) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={activeEmployee}
              onValueChange={(v) => setActiveEmployee(v)}
            >
              <SelectTrigger className="w-56 bg-white border-2">
                <Users className="h-4 w-4 mr-2 text-slate-400" />
                <SelectValue placeholder="Nhân viên" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tất cả nhân viên</SelectItem>
                {employees.map((emp: Employee) => (
                  <SelectItem key={emp.id} value={emp.id}>
                    {emp.fullName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Badge variant="secondary" className="ml-auto">
              {filtered.length} lịch
            </Badge>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Spinner className="text-violet-600" />
            </div>
          ) : viewMode === "week" ? (
            <div className="overflow-auto">
              <div className="min-w-[900px] rounded-xl border-2 border-slate-200 bg-white shadow-sm overflow-hidden">
                {/* Header Row */}
                <div className="grid grid-cols-[140px_repeat(7,minmax(120px,1fr))] bg-gradient-to-r from-violet-50 to-purple-50 text-sm font-medium">
                  <div className="px-4 py-4 text-slate-600 border-r border-slate-200">
                    <Clock className="h-4 w-4 mb-1" />
                    Ca làm việc
                  </div>
                  {weekDays.map((day) => (
                    <div
                      key={day.toISOString()}
                      className={cn(
                        "px-4 py-3 text-center border-r border-slate-200 last:border-r-0",
                        isToday(day) && "bg-violet-100"
                      )}
                    >
                      <div className={cn(
                        "font-semibold",
                        isToday(day) && "text-violet-700"
                      )}>
                        {format(day, "EEEE", { locale: vi })}
                      </div>
                      <div className={cn(
                        "text-xs",
                        isToday(day) ? "text-violet-600 font-medium" : "text-muted-foreground"
                      )}>
                        {format(day, "dd/MM")}
                        {isToday(day) && (
                          <Badge className="ml-1 text-[10px] px-1 py-0 bg-violet-600">Hôm nay</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Shift Rows */}
                {shiftPresets.map((shift) => (
                  <div
                    key={shift.key}
                    className="grid grid-cols-[140px_repeat(7,minmax(120px,1fr))] border-t border-slate-200"
                  >
                    <div
                      className={cn(
                        "flex flex-col gap-1 border-r border-slate-200 px-4 py-4 text-sm",
                        shift.headerBg
                      )}
                    >
                      <span className={cn("font-semibold", shift.textColor)}>
                        {shift.label}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {shift.time}
                      </span>
                    </div>

                    {weekDays.map((day) => {
                      const dateStr = format(day, "yyyy-MM-dd");
                      const dayItems = filtered.filter(
                        (s: EmployeeSchedule & { shift: string }) =>
                          s.workDate === dateStr && s.shift === shift.key
                      );
                      return (
                        <div
                          key={`${shift.key}-${dateStr}`}
                          className={cn(
                            "border-r border-slate-200 last:border-r-0 px-2 py-3 hover:bg-slate-50 cursor-pointer min-h-[100px] transition-colors",
                            isToday(day) && "bg-violet-50/30"
                          )}
                          onClick={() => {
                            setDate(day);
                            setIsCreateOpen(true);
                          }}
                        >
                          {dayItems.length === 0 ? (
                            <div className="flex h-full items-center justify-center text-slate-300 hover:text-violet-400 transition-colors">
                              <Plus className="h-5 w-5" />
                            </div>
                          ) : (
                            <div
                              className="flex flex-col gap-2"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {dayItems.map((item: EmployeeSchedule) => (
                                <div
                                  key={item.id}
                                  className={cn(
                                    "rounded-xl border-2 px-3 py-2.5 text-sm shadow-sm",
                                    shift.bg
                                  )}
                                >
                                  <div className="flex items-center justify-between gap-2">
                                    <div className="min-w-0">
                                      <div className="font-semibold text-slate-800 truncate">
                                        {item.employeeName}
                                      </div>
                                      <div className="text-xs text-muted-foreground">
                                        {item.startTime} - {item.endTime}
                                      </div>
                                    </div>
                                    <ScheduleStatusBadge
                                      status={item.status}
                                      size="sm"
                                    />
                                  </div>
                                  <div className="mt-2 flex gap-3 text-xs">
                                    <button
                                      className="text-violet-600 hover:text-violet-800 font-medium"
                                      onClick={() => setEditId(item.id)}
                                    >
                                      Sửa
                                    </button>
                                    <button
                                      className="text-red-500 hover:text-red-700 font-medium"
                                      onClick={() => setDeleteId(item.id)}
                                    >
                                      Xóa
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Month View */
            <div className="space-y-3">
              {monthDays.map((day) => {
                const dateStr = format(day, "yyyy-MM-dd");
                const dayItems = filtered.filter(
                  (s: EmployeeSchedule & { shift: string }) => s.workDate === dateStr
                );
                return (
                  <div
                    key={dateStr}
                    className={cn(
                      "rounded-xl border-2 p-4 shadow-sm transition-colors",
                      isToday(day) ? "border-violet-300 bg-violet-50" : "border-slate-200 bg-white"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className={cn(
                        "font-semibold",
                        isToday(day) ? "text-violet-700" : "text-slate-800"
                      )}>
                        {format(day, "EEEE, dd/MM/yyyy", { locale: vi })}
                        {isToday(day) && (
                          <Badge className="ml-2 text-xs bg-violet-600">Hôm nay</Badge>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setDate(day);
                          setIsCreateOpen(true);
                        }}
                        className="text-violet-600 hover:text-violet-700"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Thêm lịch
                      </Button>
                    </div>
                    {dayItems.length ? (
                      <div className="mt-3 grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                        {dayItems.map((item: EmployeeSchedule) => {
                          const shiftInfo = shiftPresets.find(
                            (s) => s.key === inferShift(item.startTime)
                          );
                          return (
                            <div
                              key={item.id}
                              className={cn(
                                "rounded-xl border-2 px-3 py-2.5 text-sm",
                                shiftInfo?.bg || "bg-slate-50 border-slate-200"
                              )}
                            >
                              <div className="flex items-center justify-between">
                                <div className="min-w-0">
                                  <div className="font-semibold truncate">
                                    {item.employeeName}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {item.startTime} - {item.endTime}
                                  </div>
                                </div>
                                <ScheduleStatusBadge
                                  status={item.status}
                                  size="sm"
                                />
                              </div>
                              <div className="mt-2 flex gap-3 text-xs">
                                <button
                                  className="text-violet-600 hover:text-violet-800 font-medium"
                                  onClick={() => setEditId(item.id)}
                                >
                                  Sửa
                                </button>
                                <button
                                  className="text-red-500 hover:text-red-700 font-medium"
                                  onClick={() => setDeleteId(item.id)}
                                >
                                  Xóa
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="mt-2 text-sm text-muted-foreground">
                        Không có lịch làm việc.
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Drawer */}
      <Drawer open={!!editId} onOpenChange={(open) => !open && setEditId(null)}>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader>
            <DrawerTitle>Chỉnh sửa lịch</DrawerTitle>
            <DrawerDescription>Cập nhật thông tin ca làm việc.</DrawerDescription>
          </DrawerHeader>
          <div className="px-4 pb-6 overflow-y-auto">
            <ScheduleForm
              onSubmit={handleUpdate}
              isLoading={updateSchedule.isPending}
              onCancel={() => setEditId(null)}
              initialData={editInitial}
            />
          </div>
        </DrawerContent>
      </Drawer>

      {/* Delete Dialog */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa lịch làm việc</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa lịch này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteSchedule.isPending}
            >
              {deleteSchedule.isPending ? "Đang xóa..." : "Xóa"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
