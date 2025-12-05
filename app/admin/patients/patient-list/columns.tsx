"use client";

import { Column } from "@/app/admin/_components/MyTable";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Patient, PatientStatus } from "@/interfaces/patient";
import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

const statusClass: Record<PatientStatus, string> = {
  New: "bg-green-100 text-green-700 hover:bg-green-100/80",
  Waiting: "bg-indigo-100 text-indigo-700 hover:bg-indigo-100/80",
  "In Visit": "bg-amber-100 text-amber-700 hover:bg-amber-100/80",
  Completed: "bg-pink-100 text-pink-700 hover:bg-pink-100/80",
  Active: "bg-teal-100 text-teal-700 hover:bg-teal-100/80",
  Inactive: "bg-red-100 text-red-700 hover:bg-red-100/80",
};

// 🟦 Columns
export const userColumns = (
  handleOpenDelete: (id: number) => void
): Column<Patient>[] => [
  { key: "id", label: "Id", sortable: true },

  {
    key: "avatar",
    label: "Avatar",
    render: (row) => (
      <Avatar className="h-8 w-8">
        <AvatarFallback className="bg-gray-200">
          {row.fullName.charAt(0)}
        </AvatarFallback>
      </Avatar>
    ),
  },

  { key: "fullName", label: "Full Name", sortable: true },
  { key: "dateOfBirth", label: "Date of Birth" },
  { key: "gender", label: "Gender" },

  {
    key: "status",
    label: "Status",
    render: (row) => {
      const className = statusClass[row.status];
      return <Badge className={`${className}`}>{row.status}</Badge>;
    },
  },

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

          <Link href={`/admin/patients/${row.id}`}>
            <DropdownMenuItem>
              <Eye className="w-4 h-4 mr-2" />
              View
            </DropdownMenuItem>
          </Link>

          <Link href={`/admin/patients/${row.id}/update`}>
            <DropdownMenuItem>
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem onClick={() => handleOpenDelete(row.id)}>
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
