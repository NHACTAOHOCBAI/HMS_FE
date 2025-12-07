"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar, Copy } from "lucide-react";
import { useState, useMemo } from "react";
import { useAllDepartments } from "@/hooks/queries/useDepartment";
import { useCopyToNextWeek } from "@/hooks/queries/useWorkSchedule";
import { toast } from "sonner";
import { SHIFT_TYPES } from "@/interfaces/workSchedule";
import { getWeekDates } from "@/services/workSchedule.service";
import ScheduleGrid from "./_components/ScheduleGrid";

const WorkSchedulesPage = () => {
    // Get the Monday of current week
    const getMonday = (date: Date) => {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(d.setDate(diff));
    };

    const [currentWeekStart, setCurrentWeekStart] = useState(() => {
        const today = new Date();
        return getMonday(today).toISOString().split("T")[0];
    });

    const [activeDepartment, setActiveDepartment] = useState<string>("");

    const { data: departments } = useAllDepartments();
    const { mutate: copyToNextWeek, isPending: isCopying } = useCopyToNextWeek();

    // Set first department as active when departments load
    useMemo(() => {
        if (departments && departments.length > 0 && !activeDepartment) {
            setActiveDepartment(departments[0].id);
        }
    }, [departments, activeDepartment]);

    const weekDates = useMemo(() => getWeekDates(currentWeekStart), [currentWeekStart]);

    const formatWeekRange = () => {
        if (weekDates.length === 0) return "";

        const startDate = weekDates[0];
        const endDate = weekDates[6];

        return `${String(startDate.dayNumber).padStart(2, "0")}-${String(startDate.month).padStart(2, "0")} - ${String(endDate.dayNumber).padStart(2, "0")}/${String(endDate.month).padStart(2, "0")}/${new Date(currentWeekStart).getFullYear()}`;
    };

    const handlePrevWeek = () => {
        const current = new Date(currentWeekStart);
        current.setDate(current.getDate() - 7);
        setCurrentWeekStart(current.toISOString().split("T")[0]);
    };

    const handleNextWeek = () => {
        const current = new Date(currentWeekStart);
        current.setDate(current.getDate() + 7);
        setCurrentWeekStart(current.toISOString().split("T")[0]);
    };

    const handleCopyToNextWeek = () => {
        if (!activeDepartment) {
            toast.error("Vui lòng chọn khoa phòng");
            return;
        }

        copyToNextWeek(
            { departmentId: activeDepartment, weekStart: currentWeekStart },
            {
                onSuccess: (result) => {
                    toast.success(result.message);
                },
                onError: (error) => {
                    toast.error(`Lỗi: ${error.message}`);
                },
            }
        );
    };

    return (
        <>
            {/* HEADER */}
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h1 className="text-gray-900 mb-2 text-2xl font-bold tracking-tight sm:text-3xl">
                        Lịch làm việc
                    </h1>
                    <p className="text-gray-600">Quản lý lịch trực của bác sĩ theo tuần</p>
                </div>

                <Button
                    onClick={handleCopyToNextWeek}
                    disabled={isCopying}
                    className="bg-green-600 hover:bg-green-700"
                >
                    <Copy className="w-4 h-4 mr-2" />
                    Sao chép sang tuần sau
                </Button>
            </div>

            {/* WEEK NAVIGATION */}
            <div className="flex items-center justify-center gap-4 mb-6">
                <Button variant="ghost" size="icon" onClick={handlePrevWeek}>
                    <ChevronLeft className="h-5 w-5" />
                </Button>

                <div className="flex items-center gap-2 text-gray-700">
                    <Calendar className="h-5 w-5" />
                    <span className="font-medium">{formatWeekRange()}</span>
                </div>

                <Button variant="ghost" size="icon" onClick={handleNextWeek}>
                    <ChevronRight className="h-5 w-5" />
                </Button>
            </div>

            {/* DEPARTMENT TABS */}
            <div className="flex gap-2 mb-6 border-b">
                {departments?.map((dept) => (
                    <button
                        key={dept.id}
                        onClick={() => setActiveDepartment(dept.id)}
                        className={`px-4 py-2 font-medium transition-colors ${activeDepartment === dept.id
                                ? "text-app-primary-blue-700 border-b-2 border-app-primary-blue-700"
                                : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        {dept.name}
                    </button>
                ))}
            </div>

            {/* SCHEDULE GRID */}
            {activeDepartment && (
                <ScheduleGrid
                    departmentId={activeDepartment}
                    weekStart={currentWeekStart}
                    weekDates={weekDates}
                    shiftTypes={SHIFT_TYPES}
                />
            )}
        </>
    );
};

export default WorkSchedulesPage;
