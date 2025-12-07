"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { ShiftType } from "@/interfaces/workSchedule";
import { useWeekSchedules } from "@/hooks/queries/useWorkSchedule";
import ShiftDetailDialog from "./ShiftDetailDialog";
import AddScheduleDialog from "./AddScheduleDialog";

interface WeekDate {
    date: string;
    dayOfWeek: number;
    dayLabel: string;
    dayNumber: number;
    month: number;
}

interface ScheduleGridProps {
    departmentId: string;
    weekStart: string;
    weekDates: WeekDate[];
    shiftTypes: ShiftType[];
}

const ScheduleGrid = ({
    departmentId,
    weekStart,
    weekDates,
    shiftTypes,
}: ScheduleGridProps) => {
    const [selectedCell, setSelectedCell] = useState<{
        date: string;
        shiftType: ShiftType;
    } | null>(null);
    const [openDetail, setOpenDetail] = useState(false);
    const [openAddSchedule, setOpenAddSchedule] = useState(false);

    const { data: schedules } = useWeekSchedules(departmentId, weekStart);

    const handleCellClick = (date: string, shiftType: ShiftType) => {
        setSelectedCell({ date, shiftType });
        setOpenDetail(true);
    };

    const handleAddSchedule = () => {
        setOpenAddSchedule(true);
    };

    const getSchedulesForCell = (date: string, shiftKey: string) => {
        if (!schedules?.data) return [];
        return schedules.data.filter(
            (s) => s.date === date && s.shiftType === shiftKey
        );
    };

    return (
        <>
            <div className="border rounded-lg overflow-hidden">
                {/* Header Row */}
                <div className="grid grid-cols-8 bg-gray-50">
                    <div className="p-3 font-medium text-gray-700 border-r">Ca làm</div>
                    {weekDates.map((date) => (
                        <div
                            key={date.date}
                            className="p-3 text-center border-r last:border-r-0"
                        >
                            <div className="font-medium text-gray-700">{date.dayLabel}</div>
                            <div className="text-sm text-gray-500">
                                {String(date.dayNumber).padStart(2, "0")}-
                                {String(date.month).padStart(2, "0")}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Shift Rows */}
                {shiftTypes.map((shift) => (
                    <div key={shift.key} className="grid grid-cols-8 border-t">
                        {/* Shift Label */}
                        <div className="p-3 bg-blue-50 border-r">
                            <div className="font-medium text-blue-700">{shift.label}</div>
                            <div className="text-xs text-blue-500">
                                {shift.startTime} - {shift.endTime}
                            </div>
                        </div>

                        {/* Week Days */}
                        {weekDates.map((date) => {
                            const cellSchedules = getSchedulesForCell(date.date, shift.key);

                            return (
                                <div
                                    key={`${date.date}-${shift.key}`}
                                    className="p-2 border-r last:border-r-0 min-h-[60px] flex items-center justify-center hover:bg-gray-50 cursor-pointer"
                                    onClick={() => handleCellClick(date.date, shift)}
                                >
                                    {cellSchedules.length > 0 ? (
                                        <div className="flex flex-col gap-1 w-full">
                                            {cellSchedules.map((schedule) => (
                                                <div
                                                    key={schedule.id}
                                                    className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded truncate"
                                                >
                                                    {schedule.employeeName}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-gray-400 hover:text-gray-600"
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>

            {/* Shift Detail Dialog */}
            {selectedCell && (
                <ShiftDetailDialog
                    open={openDetail}
                    setOpen={setOpenDetail}
                    departmentId={departmentId}
                    date={selectedCell.date}
                    shiftType={selectedCell.shiftType}
                    onAddSchedule={handleAddSchedule}
                />
            )}

            {/* Add Schedule Dialog */}
            {selectedCell && (
                <AddScheduleDialog
                    open={openAddSchedule}
                    setOpen={setOpenAddSchedule}
                    departmentId={departmentId}
                    date={selectedCell.date}
                    shiftType={selectedCell.shiftType}
                />
            )}
        </>
    );
};

export default ScheduleGrid;
