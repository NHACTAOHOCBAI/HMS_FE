"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Trash2, X } from "lucide-react";
import { ShiftType } from "@/interfaces/workSchedule";
import { useSchedulesByDateAndShift, useDeleteSchedule } from "@/hooks/queries/useWorkSchedule";
import { toast } from "sonner";

interface ShiftDetailDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    departmentId: string;
    date: string;
    shiftType: ShiftType;
    onAddSchedule: () => void;
}

const ShiftDetailDialog = ({
    open,
    setOpen,
    departmentId,
    date,
    shiftType,
    onAddSchedule,
}: ShiftDetailDialogProps) => {
    const { data: schedules, isLoading } = useSchedulesByDateAndShift(
        departmentId,
        date,
        shiftType.key
    );
    const { mutate: deleteSchedule } = useDeleteSchedule();

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
    };

    const handleDelete = (scheduleId: string) => {
        deleteSchedule(scheduleId, {
            onSuccess: () => {
                toast.success("Đã xóa nhân viên khỏi ca trực");
            },
            onError: (error) => {
                toast.error(`Lỗi: ${error.message}`);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>
                        {shiftType.label} ({shiftType.startTime} - {shiftType.endTime}) - {formatDate(date)}
                    </DialogTitle>
                </DialogHeader>

                <div className="py-4">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-gray-600">
                            Danh sách nhân viên ({schedules?.length || 0})
                        </span>
                        <Button
                            onClick={onAddSchedule}
                            className="bg-app-primary-blue-700 hover:bg-app-primary-blue-800"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Thêm nhân viên
                        </Button>
                    </div>

                    {/* Employee List */}
                    <div className="min-h-[150px] border rounded-lg p-4">
                        {isLoading ? (
                            <div className="text-center text-gray-500">Đang tải...</div>
                        ) : schedules && schedules.length > 0 ? (
                            <div className="space-y-2">
                                {schedules.map((schedule) => (
                                    <div
                                        key={schedule.id}
                                        className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                                    >
                                        <div>
                                            <span className="font-medium">{schedule.employeeName}</span>
                                            {schedule.note && (
                                                <p className="text-sm text-gray-500">{schedule.note}</p>
                                            )}
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDelete(schedule.id)}
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                <p>Chưa có nhân viên nào được phân ca</p>
                                <p className="text-sm">Click "Thêm nhân viên" để phân công</p>
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Đóng
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ShiftDetailDialog;
