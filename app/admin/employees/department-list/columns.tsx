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
import { DepartmentItem } from "@/interfaces/department";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

const statusColors: Record<string, string> = {
    ACTIVE: "bg-green-100 text-green-700",
    INACTIVE: "bg-gray-100 text-gray-700",
};

const statusLabels: Record<string, string> = {
    ACTIVE: "Hoạt động",
    INACTIVE: "Ngừng hoạt động",
};

export const departmentColumns = (
    handleOpenDelete: (id: string) => void,
    handleOpenUpdate: (id: string) => void
): Column<DepartmentItem>[] => [
        { key: "name", label: "Tên khoa", sortable: true },
        { key: "description", label: "Mô tả" },
        { key: "location", label: "Vị trí" },
        { key: "phoneExtension", label: "Số máy lẻ" },
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
