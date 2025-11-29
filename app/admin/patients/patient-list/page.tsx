"use client";
import { ReusableTable } from "@/app/admin/_components/MyTable";
import { useState } from "react";
import { usePatient } from "@/hooks/queries/usePatient";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { userColumns } from "@/app/admin/patients/patient-list/columns";
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
