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
import { useCreateDepartment } from "@/hooks/queries/useDepartment";
import { useState } from "react";
import { toast } from "sonner";

interface AddDepartmentDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
}

export const AddDepartmentDialog = ({ open, setOpen }: AddDepartmentDialogProps) => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        location: "",
        phoneExtension: "",
        status: "",
    });

    const { mutate: createDepartment, isPending } = useCreateDepartment();

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        if (!formData.name || !formData.location || !formData.phoneExtension || !formData.status) {
            toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
            return;
        }

        createDepartment(
            {
                name: formData.name,
                description: formData.description,
                location: formData.location,
                phoneExtension: formData.phoneExtension,
                status: formData.status as "ACTIVE" | "INACTIVE",
            },
            {
                onSuccess: () => {
                    toast.success("Đã thêm khoa phòng thành công");
                    setOpen(false);
                    setFormData({
                        name: "",
                        description: "",
                        location: "",
                        phoneExtension: "",
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
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Thêm khoa phòng mới</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Tên khoa */}
                    <div className="space-y-2">
                        <Label htmlFor="name">
                            Tên <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => handleChange("name", e.target.value)}
                            placeholder="Nhập tên khoa"
                        />
                    </div>

                    {/* Mô tả */}
                    <div className="space-y-2">
                        <Label htmlFor="description">
                            Mô tả <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => handleChange("description", e.target.value)}
                            placeholder="Nhập mô tả"
                            rows={3}
                        />
                    </div>

                    {/* Vị trí */}
                    <div className="space-y-2">
                        <Label htmlFor="location">
                            Vị trí <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="location"
                            value={formData.location}
                            onChange={(e) => handleChange("location", e.target.value)}
                            placeholder="Nhập vị trí"
                        />
                    </div>

                    {/* Số máy lẻ */}
                    <div className="space-y-2">
                        <Label htmlFor="phoneExtension">
                            Số máy lẻ <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="phoneExtension"
                            value={formData.phoneExtension}
                            onChange={(e) => handleChange("phoneExtension", e.target.value)}
                            placeholder="Nhập số máy lẻ"
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
                                <SelectItem value="ACTIVE">Hoạt động</SelectItem>
                                <SelectItem value="INACTIVE">Ngừng hoạt động</SelectItem>
                            </SelectContent>
                        </Select>
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
                        Thêm khoa phòng
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
