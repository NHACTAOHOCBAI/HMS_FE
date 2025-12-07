"use client";

import { ReusableTable } from "@/app/admin/_components/MyTable";
import { useEmployees, useDeleteEmployee } from "@/hooks/queries/useEmployee";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { employeeColumns } from "./columns";
import { useTableParams } from "@/hooks/useTableParams";
import { useState } from "react";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Search } from "lucide-react";
import { AddEmployeeDialog } from "../add-employee/AddEmployeeDialog";
import { UpdateEmployeeDialog } from "../update-employee/UpdateEmployeeDialog";

const EmployeeCard = () => {
    const [openAdd, setOpenAdd] = useState(false);
    const [openUpdate, setOpenUpdate] = useState(false);
    const [updatedId, setUpdatedId] = useState<string | null>(null);
    const [openDelete, setOpenDelete] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const {
        params,
        debouncedSearch,
        updateSearch,
        updatePage,
        updateLimit,
        updateSort,
    } = useTableParams();

    const handleOpenDelete = (id: string) => {
        setDeleteId(id);
        setOpenDelete(true);
    };

    const handleOpenUpdate = (id: string) => {
        setUpdatedId(id);
        setOpenUpdate(true);
    };

    const { data, isLoading } = useEmployees({
        ...params,
        search: debouncedSearch,
        sortOrder: params.sortOrder as "asc" | "desc" | undefined,
    });

    const { mutate: deleteEmployee } = useDeleteEmployee();

    const handleDelete = (id: string) => {
        deleteEmployee(id, {
            onSuccess: () => {
                toast.success("Đã xóa nhân viên thành công");
                setOpenDelete(false);
                // Reset to page 1 after deletion to avoid empty page issue
                updatePage(1);
            },
            onError: (error) => {
                toast.error(`Lỗi: ${error.message}`);
            },
        });
    };

    return (
        <>
            <div className="space-y-4">
                {/* Search and Add Button */}
                <div className="flex items-center gap-5">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Tìm kiếm nhân viên..."
                            className="h-[50px] rounded-[30px] pl-10"
                            onChange={(e) => updateSearch(e.target.value)}
                        />
                    </div>

                    <Button
                        onClick={() => setOpenAdd(true)}
                        className="ml-auto bg-app-primary-blue-700 hover:bg-app-primary-blue-800"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Thêm nhân viên
                    </Button>
                </div>

                {/* Table */}
                <ReusableTable
                    data={data?.data.content ?? []}
                    columns={employeeColumns(handleOpenDelete, handleOpenUpdate)}
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

            {/* Add Dialog */}
            <AddEmployeeDialog open={openAdd} setOpen={setOpenAdd} />

            {/* Update Dialog */}
            <UpdateEmployeeDialog
                open={openUpdate}
                setOpen={setOpenUpdate}
                employeeId={updatedId}
            />

            {/* Delete Confirmation */}
            <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận xóa?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Hành động này không thể hoàn tác. Nhân viên sẽ bị xóa vĩnh viễn
                            khỏi hệ thống.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                handleDelete(deleteId!);
                            }}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Xác nhận
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default EmployeeCard;
