"use client";

import { Column } from "@/app/admin/_components/MyTable";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EmployeeItem } from "@/interfaces/employee";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

const roleLabels: Record<string, string> = {
    DOCTOR: "BÁC SĨ",
    NURSE: "Y TÁ",
    RECEPTIONIST: "LỄ TÂN",
};

const statusColors: Record<string, string> = {
    ACTIVE: "bg-green-100 text-green-700",
    ON_LEAVE: "bg-yellow-100 text-yellow-700",
    TERMINATED: "bg-red-100 text-red-700",
};

const statusLabels: Record<string, string> = {
    ACTIVE: "Đang làm",
    ON_LEAVE: "Nghỉ phép",
    TERMINATED: "Nghỉ việc",
};

export const employeeColumns = (
    handleOpenDelete: (id: string) => void,
    handleOpenUpdate: (id: string) => void
): Column<EmployeeItem>[] => [
        { key: "fullName", label: "Họ tên", sortable: true },
        {
            key: "role",
            label: "Vai trò",
            render: (row) => (
                <span className="font-medium text-gray-700">
                    {roleLabels[row.role] || row.role}
                </span>
            ),
        },
        { key: "departmentName", label: "Khoa phòng" },
        {
            key: "specialization",
            label: "Chuyên khoa",
            render: (row) => row.specialization || "N/A",
        },
        {
            key: "licenseNumber",
            label: "Số giấy phép",
            render: (row) => row.licenseNumber || "N/A",
        },
        { key: "email", label: "Email" },
        { key: "phone", label: "Điện thoại" },
        {
            key: "status",
            label: "Trạng thái",
            render: (row) => (
                <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[row.status] || ""
                        }`}
                >
                    {statusLabels[row.status] || row.status}
                </span>
            ),
        },
        {
            key: "action",
            label: "Thao tác",
            render: (row) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Thao tác</DropdownMenuLabel>

                        <DropdownMenuItem onClick={() => handleOpenUpdate(row.id)}>
                            <Pencil className="w-4 h-4 mr-2" />
                            Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => handleOpenDelete(row.id)}
                            className="text-red-600"
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Xóa
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];
