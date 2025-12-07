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
import { useCreateEmployee } from "@/hooks/queries/useEmployee";
import { useAllDepartments } from "@/hooks/queries/useDepartment";
import { useState } from "react";
import { toast } from "sonner";

interface AddEmployeeDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
}

export const AddEmployeeDialog = ({ open, setOpen }: AddEmployeeDialogProps) => {
    const [formData, setFormData] = useState({
        fullName: "",
        role: "",
        departmentId: "",
        specialization: "",
        licenseNumber: "",
        email: "",
        phone: "",
        address: "",
        hireDate: "",
        status: "",
    });

    const { data: departments } = useAllDepartments();
    const { mutate: createEmployee, isPending } = useCreateEmployee();

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        if (!formData.fullName || !formData.role || !formData.departmentId || !formData.email || !formData.phone || !formData.status) {
            toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
            return;
        }

        createEmployee(
            {
                fullName: formData.fullName,
                role: formData.role as "DOCTOR" | "NURSE" | "RECEPTIONIST",
                departmentId: formData.departmentId,
                specialization: formData.specialization || undefined,
                licenseNumber: formData.licenseNumber || undefined,
                email: formData.email,
                phone: formData.phone,
                address: formData.address,
                hireDate: formData.hireDate,
                status: formData.status as "ACTIVE" | "ON_LEAVE" | "TERMINATED",
            },
            {
                onSuccess: () => {
                    toast.success("Đã thêm nhân viên thành công");
                    setOpen(false);
                    setFormData({
                        fullName: "",
                        role: "",
                        departmentId: "",
                        specialization: "",
                        licenseNumber: "",
                        email: "",
                        phone: "",
                        address: "",
                        hireDate: "",
                        status: "",
                    });
                },
                onError: (error) => {
                    toast.error(`Lỗi: ${error.message}`);
                },
            }
        );
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Thêm nhân viên mới</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-4 py-4">
                    {/* Họ tên */}
                    <div className="space-y-2">
                        <Label htmlFor="fullName">
                            Họ tên <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="fullName"
                            value={formData.fullName}
                            onChange={(e) => handleChange("fullName", e.target.value)}
                            placeholder="Nhập họ tên"
                        />
                    </div>

                    {/* Vai trò */}
                    <div className="space-y-2">
                        <Label htmlFor="role">
                            Vai trò <span className="text-red-500">*</span>
                        </Label>
                        <Select
                            value={formData.role}
                            onValueChange={(value) => handleChange("role", value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn vai trò" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="DOCTOR">Bác sĩ</SelectItem>
                                <SelectItem value="NURSE">Y tá</SelectItem>
                                <SelectItem value="RECEPTIONIST">Lễ tân</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Khoa phòng */}
                    <div className="space-y-2">
                        <Label htmlFor="departmentId">
                            Khoa phòng <span className="text-red-500">*</span>
                        </Label>
                        <Select
                            value={formData.departmentId}
                            onValueChange={(value) => handleChange("departmentId", value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn khoa phòng" />
                            </SelectTrigger>
                            <SelectContent>
                                {departments?.map((dept) => (
                                    <SelectItem key={dept.id} value={dept.id}>
                                        {dept.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Chuyên khoa */}
                    <div className="space-y-2">
                        <Label htmlFor="specialization">Chuyên khoa</Label>
                        <Input
                            id="specialization"
                            value={formData.specialization}
                            onChange={(e) => handleChange("specialization", e.target.value)}
                            placeholder="Nhập chuyên khoa"
                        />
                    </div>

                    {/* Số giấy phép */}
                    <div className="space-y-2">
                        <Label htmlFor="licenseNumber">Số giấy phép</Label>
                        <Input
                            id="licenseNumber"
                            value={formData.licenseNumber}
                            onChange={(e) => handleChange("licenseNumber", e.target.value)}
                            placeholder="Nhập số giấy phép"
                        />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <Label htmlFor="email">
                            Email <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleChange("email", e.target.value)}
                            placeholder="Nhập email"
                        />
                    </div>

                    {/* Số điện thoại */}
                    <div className="space-y-2">
                        <Label htmlFor="phone">
                            Số điện thoại <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => handleChange("phone", e.target.value)}
                            placeholder="Nhập số điện thoại"
                        />
                    </div>

                    {/* Trạng thái */}
                    <div className="space-y-2">
                        <Label htmlFor="status">
                            Trạng thái <span className="text-red-500">*</span>
                        </Label>
                        <Select
                            value={formData.status}
                            onValueChange={(value) => handleChange("status", value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn trạng thái" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ACTIVE">Đang làm</SelectItem>
                                <SelectItem value="ON_LEAVE">Nghỉ phép</SelectItem>
                                <SelectItem value="TERMINATED">Nghỉ việc</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Địa chỉ */}
                    <div className="col-span-2 space-y-2">
                        <Label htmlFor="address">Địa chỉ</Label>
                        <Input
                            id="address"
                            value={formData.address}
                            onChange={(e) => handleChange("address", e.target.value)}
                            placeholder="Nhập địa chỉ"
                        />
                    </div>

                    {/* Ngày vào làm */}
                    <div className="space-y-2">
                        <Label htmlFor="hireDate">
                            Ngày vào làm <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="hireDate"
                            type="date"
                            value={formData.hireDate}
                            onChange={(e) => handleChange("hireDate", e.target.value)}
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
                        Thêm nhân viên
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
