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
import { PatientItem } from "@/interfaces/patient";
import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
// 🟦 Columns
export const userColumns = (
  handleOpenDelete: (id: string) => void,
  handleOpenUpdate: (id: string) => void
): Column<PatientItem>[] => [
  { key: "id", label: "Id", sortable: true },

  { key: "fullName", label: "Full Name", sortable: true },
  { key: "gender", label: "Gender" },
  { key: "bloodType", label: "Blood Type" },
  { key: "phoneNumber", label: "Phone Number" },
  {
    key: "action",
    label: "Actions",
    render: (row) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuItem>
            <Eye className="w-4 h-4 mr-2" />
            View
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => handleOpenUpdate(row.id)}>
            <Pencil className="w-4 h-4 mr-2" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleOpenDelete(row.id)}>
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
