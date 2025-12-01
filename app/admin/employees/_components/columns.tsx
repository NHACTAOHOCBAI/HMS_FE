"use client";

import { Employee } from "@/interfaces/employee";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Column } from "../../_components/MyTable";

export const employeeColumns = (
    onEdit: (employee: Employee) => void,
    onDelete: (employee: Employee) => void
): Column<Employee>[] => [
        {
            key: "id",
            label: "Id",
        },
        {
            key: "avatar",
            label: "Avatar",
            render: (row) => {
                const initials = row.fullName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase();

                return (
                    <Avatar>
                        <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                );
            },
        },
        {
            key: "fullName",
            label: "Full Name",
        },
        {
            key: "dateOfBirth",
            label: "Date of Birth",
            render: (row) => {
                const date = new Date(row.dateOfBirth);
                return date.toLocaleDateString("en-GB");
            },
        },
        {
            key: "department",
            label: "Department",
        },
        {
            key: "gender",
            label: "Gender",
        },
        {
            key: "status",
            label: "Status",
            render: (row) => {
                const status = row.status;

                // Match exact colors from design image
                const badgeStyles = {
                    Active: "bg-green-50 text-green-700 border border-green-200",
                    "On leave": "bg-yellow-50 text-yellow-700 border border-yellow-200",
                    Inactive: "bg-red-50 text-red-700 border border-red-200",
                };

                return (
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${badgeStyles[status]}`}>
                        {status}
                    </span>
                );
            },
        },
        {
            key: "actions",
            label: "Action",
            render: (row) => {
                return (
                    <div className="flex gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="cursor-pointer"
                            onClick={() => onEdit(row)}
                        >
                            <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="cursor-pointer"
                            onClick={() => onDelete(row)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                );
            },
        },
    ];
