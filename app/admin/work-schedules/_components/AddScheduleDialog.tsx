"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ShiftType } from "@/interfaces/workSchedule";
import { useEmployeesByDepartment } from "@/hooks/queries/useEmployee";
import { useCreateSchedule, useSchedulesByDateAndShift } from "@/hooks/queries/useWorkSchedule";
import { useState, useMemo } from "react";
import { toast } from "sonner";

interface AddScheduleDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    departmentId: string;
    date: string;
    shiftType: ShiftType;
}

const AddScheduleDialog = ({
    open,
    setOpen,
    departmentId,
    date,
    shiftType,
}: AddScheduleDialogProps) => {
    const [employeeId, setEmployeeId] = useState("");
    const [note, setNote] = useState("");

    const { data: employees } = useEmployeesByDepartment(departmentId);
    const { data: existingSchedules } = useSchedulesByDateAndShift(
        departmentId,
        date,
        shiftType.key
    );
    const { mutate: createSchedule, isPending } = useCreateSchedule();

    // Filter out employees already assigned to this shift
    const availableEmployees = useMemo(() => {
        if (!employees) return [];
        if (!existingSchedules || existingSchedules.length === 0) return employees;

        const assignedEmployeeIds = new Set(existingSchedules.map(s => s.employeeId));
        return employees.filter(emp => !assignedEmployeeIds.has(emp.id));
    }, [employees, existingSchedules]);

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
    };

    const handleSubmit = () => {
        if (!employeeId) {
            toast.error("Vui lòng chọn nhân viên");
            return;
        }

        createSchedule(
            {
                employeeId,
                departmentId,
                date,
                shiftType: shiftType.key,
                note: note || undefined,
            },
            {
                onSuccess: () => {
                    toast.success("Đã thêm nhân viên vào ca trực");
                    setOpen(false);
                    setEmployeeId("");
                    setNote("");
                },
                onError: (error) => {
                    toast.error(`Lỗi: ${error.message}`);
                },
            }
        );
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                    <DialogTitle>Thêm nhân viên vào ca</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Ngày */}
                    <div className="space-y-2">
                        <Label>Ngày</Label>
                        <Input value={formatDate(date)} disabled className="bg-gray-50" />
                    </div>

                    {/* Ca làm */}
                    <div className="space-y-2">
                        <Label>Ca làm</Label>
                        <Input
                            value={`${shiftType.label} (${shiftType.startTime} - ${shiftType.endTime})`}
                            disabled
                            className="bg-gray-50"
                        />
                    </div>

                    {/* Bác sĩ */}
                    <div className="space-y-2">
                        <Label htmlFor="employeeId">
                            Bác sĩ <span className="text-red-500">*</span>
                        </Label>
                        <Select value={employeeId} onValueChange={setEmployeeId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn nhân viên" />
                            </SelectTrigger>
                            <SelectContent>
                                {availableEmployees.length === 0 ? (
                                    <SelectItem value="_none" disabled>
                                        Tất cả nhân viên đã được phân công
                                    </SelectItem>
                                ) : (
                                    availableEmployees.map((emp) => (
                                        <SelectItem key={emp.id} value={emp.id}>
                                            {emp.fullName} ({emp.role === "DOCTOR" ? "Bác sĩ" : emp.role === "NURSE" ? "Y tá" : "Lễ tân"})
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Ghi chú */}
                    <div className="space-y-2">
                        <Label htmlFor="note">Ghi chú</Label>
                        <Textarea
                            id="note"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Ghi chú về ca trực..."
                            rows={3}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Hủy
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isPending}
                        className="bg-app-primary-blue-700 hover:bg-app-primary-blue-800"
                    >
                        Thêm
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddScheduleDialog;
