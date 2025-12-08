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
import { AppointmentItem } from "@/interfaces/appointment";
import { Eye, MoreHorizontal, Trash2, CheckCircle, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDateTimeVi } from "@/lib/utils";

// 🎨 Map màu cho STATUS
export const statusColor: Record<string, string> = {
  SCHEDULED: "bg-blue-500/30 border-blue-500 text-blue-500",
  COMPLETED: "bg-green-500/30 border-green-500 text-green-500",
  CANCELLED: "bg-red-500/30 border-red-500 text-red-500",
};

// 🎨 Map màu cho TYPE
export const typeColor: Record<string, string> = {
  CONSULTATION: "bg-purple-500",
  FOLLOW_UP: "bg-yellow-500",
  EMERGENCY: "bg-orange-500",
};

// 🟦 Appointment Columns
export const appointmentColumns = (
  handleOpenCancel: (id: string) => void,
  handleOpenComplete: (id: string) => void,
  handleOpenUpdate: (id: string) => void,
  handleOpenDetail: (id: string) => void
): Column<AppointmentItem>[] => [
  { key: "id", label: "Id", sortable: true },

  {
    key: "patient.fullName",
    label: "Patient",
    render: (row) => row.patient.fullName,
  },

  {
    key: "doctor.fullName",
    label: "Doctor",
    render: (row) => row.doctor.fullName,
  },

  {
    key: "doctor.department",
    label: "Department",
    render: (row) => row.doctor.department,
  },
  {
    key: "appointmentTime",
    label: "Time",
    render: (row) => <div>{formatDateTimeVi(row.appointmentTime)}</div>,
  },
  {
    key: "status",
    label: "Status",
    render: (row) => (
      <Badge
        className={`text-white ${statusColor[row.status] || "bg-gray-500"}`}
      >
        {row.status}
      </Badge>
    ),
  },

  // 🎨 TYPE = Badge màu
  {
    key: "type",
    label: "Type",
    render: (row) => (
      <Badge className={`text-white ${typeColor[row.type] || "bg-gray-500"}`}>
        {row.type}
      </Badge>
    ),
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
          <DropdownMenuItem onClick={() => handleOpenDetail(row.id)}>
            <Eye className="w-4 h-4 mr-2" />
            View
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleOpenUpdate(row.id)}>
            <Pencil className="w-4 h-4 mr-2" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleOpenCancel(row.id)}>
            <Trash2 className="w-4 h-4 mr-2" />
            Cancel
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleOpenComplete(row.id)}>
            <CheckCircle className="w-4 h-4 mr-2" />
            Complete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
