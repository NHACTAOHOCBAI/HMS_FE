"use client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar"; // Giả sử bạn có component Avatar của shadcn/ui
import { Column, ReusableTable } from "@/app/admin/_components/MyTable";
import { useState } from "react";
import { Patient, PatientStatus } from "@/interfaces/patient";
import { usePatient } from "@/hooks/queries/usePatient";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
const statusClass: Record<PatientStatus, string> = {
  New: "bg-green-100 text-green-700 hover:bg-green-100/80",
  Waiting: "bg-indigo-100 text-indigo-700 hover:bg-indigo-100/80",
  "In Visit": "bg-amber-100 text-amber-700 hover:bg-amber-100/80",
  Completed: "bg-pink-100 text-pink-700 hover:bg-pink-100/80",
  Active: "bg-teal-100 text-teal-700 hover:bg-teal-100/80",
  Inactive: "bg-red-100 text-red-700 hover:bg-red-100/80",
};
export const userColumns: Column<Patient>[] = [
  { key: "id", label: "Id" },

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

  { key: "fullName", label: "Full Name" },
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
    label: "Action",
    render: () => (
      <div className="flex gap-2">
        <button className="text-blue-500">Edit</button>
        <button className="text-red-500">Delete</button>
      </div>
    ),
  },
];
const UserTablePage = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6);

  const { data, isLoading } = usePatient(page, limit);

  return (
    <div>
      <div className="mb-5 flex items-center gap-5">
        <Input className="h-[50px] rounded-[30px] w-[460px]" />
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="waiting">Waiting</SelectItem>
            <SelectItem value="inVist">In Vist</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inActive">In Active</SelectItem>
          </SelectContent>
        </Select>
        <Button className="ml-auto">New Patient</Button>
      </div>
      <ReusableTable
        data={data?.items ?? []}
        columns={userColumns}
        loading={isLoading}
        pagination={{
          currentPage: data?.currentPage ?? 1,
          totalPages: data?.totalPages ?? 1,
          rowsPerPage: limit,
          totalItems: data?.totalItems ?? 0,
        }}
        onPageChange={(p) => setPage(p)}
        onRowsPerPageChange={(size) => {
          setLimit(size);
          setPage(1); // reset page
        }}
      />
    </div>
  );
};

export default UserTablePage;
