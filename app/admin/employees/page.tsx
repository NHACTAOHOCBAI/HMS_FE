"use client";
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ReusableTable } from "../_components/MyTable";
import { employeeColumns } from "./_components/columns";
import { AddEmployeeModal } from "./_components/AddEmployeeModal";
import { EditEmployeeModal } from "./_components/EditEmployeeModal";
import { DeleteEmployeeModal } from "./_components/DeleteEmployeeModal";
import { EmployeeTabs } from "./_components/EmployeeTabs";
import { getEmployees, getDepartments, getPositions, deleteEmployee } from "@/services/employee.service";
import { useDebounce } from "@/hooks/useDebounce";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Employee } from "@/interfaces/employee";

export default function EmployeeListsPage() {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(6);
    const [search, setSearch] = useState("");
    const [department, setDepartment] = useState("");
    const [position, setPosition] = useState("");
    const [status, setStatus] = useState("");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

    const queryClient = useQueryClient();
    const debouncedSearch = useDebounce(search, 400);

    const { data, isLoading } = useQuery({
        queryKey: ["employees", page, limit, debouncedSearch, department, position, status],
        queryFn: () => getEmployees({ page, limit, search: debouncedSearch, department, position, status }),
    });

    const departments = getDepartments();
    const positions = getPositions();

    const handleEdit = (employee: Employee) => {
        setSelectedEmployee(employee);
        setIsEditModalOpen(true);
    };

    const handleDelete = (employee: Employee) => {
        setSelectedEmployee(employee);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (selectedEmployee) {
            await deleteEmployee(selectedEmployee.id);
            queryClient.invalidateQueries({ queryKey: ["employees"] });
            setIsDeleteModalOpen(false);
            setSelectedEmployee(null);
        }
    };

    const handleSuccess = () => {
        queryClient.invalidateQueries({ queryKey: ["employees"] });
    };

    const columns = employeeColumns(handleEdit, handleDelete);

    return (
        <div>
            <div className="mb-5 flex items-center gap-3">
                <Input
                    className="h-[50px] rounded-[30px] w-[460px]"
                    type="search"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                    }}
                />

                <Select value={department} onValueChange={(val) => {
                    setDepartment(val);
                    setPage(1);
                }}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Department" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value=" ">All Departments</SelectItem>
                        {departments.map((dept) => (
                            <SelectItem key={dept} value={dept}>
                                {dept}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select value={position} onValueChange={(val) => {
                    setPosition(val);
                    setPage(1);
                }}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Position" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value=" ">All Positions</SelectItem>
                        {positions.map((pos) => (
                            <SelectItem key={pos} value={pos}>
                                {pos}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select value={status} onValueChange={(val) => {
                    setStatus(val);
                    setPage(1);
                }}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value=" ">All Statuses</SelectItem>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="On leave">On leave</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                </Select>

                <Button
                    className="ml-auto cursor-pointer"
                    onClick={() => setIsAddModalOpen(true)}
                >
                    New Employee
                </Button>
            </div>

            <ReusableTable
                data={data?.items || []}
                columns={columns}
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
                    setPage(1);
                }}
            />

            <AddEmployeeModal
                open={isAddModalOpen}
                onOpenChange={setIsAddModalOpen}
                onSuccess={handleSuccess}
            />

            <EditEmployeeModal
                open={isEditModalOpen}
                onOpenChange={setIsEditModalOpen}
                employee={selectedEmployee}
                onSuccess={handleSuccess}
            />

            <DeleteEmployeeModal
                open={isDeleteModalOpen}
                onOpenChange={setIsDeleteModalOpen}
                employeeName={selectedEmployee?.fullName || ""}
                onConfirm={handleConfirmDelete}
            />
        </div>
    );
}
