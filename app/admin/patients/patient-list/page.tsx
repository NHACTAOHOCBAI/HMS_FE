"use client";
import { ReusableTable } from "@/app/admin/_components/MyTable";
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
import { useTableParams } from "@/hooks/useTableParams";
const UserTablePage = () => {
  const {
    params,
    debouncedSearch,
    updateSearch,
    updateFilter,
    updatePage,
    updateLimit,
    updateSort,
  } = useTableParams();

  const { data, isLoading } = usePatient({
    ...params,
    search: debouncedSearch,
    sortOrder: params.sortOrder as "asc" | "desc" | undefined,
  });

  return (
    <div>
      <div className="mb-5 flex items-center gap-5">
        <Input
          placeholder="Search patient..."
          className="h-[50px] rounded-[30px] w-[460px]"
          onChange={(e) => updateSearch(e.target.value)}
        />

        <Select onValueChange={(v) => updateFilter("gender", v)}>
          <SelectTrigger>
            <SelectValue placeholder="Gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={(v) => updateFilter("status", v)}>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="waiting">Waiting</SelectItem>
            <SelectItem value="active">Active</SelectItem>
          </SelectContent>
        </Select>

        <Button className="ml-auto">New Patient</Button>
      </div>

      <ReusableTable
        data={data?.data.content ?? []}
        columns={userColumns}
        loading={isLoading}
        pagination={{
          currentPage: params.page,
          totalPages: data?.data.totalPages ?? 1,
          rowsPerPage: params.limit,
          totalItems: data?.data.totalElements ?? 0,
        }}
        onPageChange={updatePage}
        onRowsPerPageChange={updateLimit}
        onSort={updateSort}
        sortBy={params.sortBy}
        sortOrder={params.sortOrder as "asc" | "desc" | undefined}
      />
    </div>
  );
};

export default UserTablePage;
