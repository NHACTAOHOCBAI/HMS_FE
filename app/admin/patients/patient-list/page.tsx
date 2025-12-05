"use client";
import { ReusableTable } from "@/app/admin/_components/MyTable";
import { useDeletePatient, usePatient } from "@/hooks/queries/usePatient";
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
import { useState } from "react";
import { AddPatientDialog } from "@/app/admin/patients/add-patient/AddPatientDialog";
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
import { UpdatePatientDialog } from "@/app/admin/patients/update-patient/UpdatePatientDialog";
import { Patient } from "@/interfaces/patient";
const UserTablePage = () => {
  const [openUpdate, setOpenUpdate] = useState(false);
  const [updatedPatient, setUpdatedPatient] = useState<Patient | null>(null);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [openNew, setOpenNew] = useState(false);
  const {
    params,
    debouncedSearch,
    updateSearch,
    updateFilter,
    updatePage,
    updateLimit,
    updateSort,
  } = useTableParams();
  const handleOpenDelete = (id: number) => {
    setDeleteId(id);
    setOpen(true);
  };
  const handleOpenUpdate = (patient: Patient) => {
    setUpdatedPatient(patient);
    setOpenUpdate(true);
  };
  const { data, isLoading } = usePatient({
    ...params,
    search: debouncedSearch,
    sortOrder: params.sortOrder as "asc" | "desc" | undefined,
  });
  const { mutate: deletePatient } = useDeletePatient();
  const handleDelete = (id: number) => {
    console.log("Deleting patient with id:", id);
    deletePatient(
      {
        id: id,
      },
      {
        onSuccess: () => {
          toast.success("Patient has been created");
        },
        onError: (error) => {
          toast.error(`Ohh!!! ${error.message}`);
        },
      }
    );
  };
  return (
    <>
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

          <Button onClick={() => setOpenNew(true)} className="ml-auto">
            New Patient
          </Button>
        </div>

        <ReusableTable
          data={data?.data.content ?? []}
          columns={userColumns(handleOpenDelete, handleOpenUpdate)}
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
      <UpdatePatientDialog
        open={openUpdate}
        setOpen={setOpenUpdate}
        patient={updatedPatient}
      />

      <AddPatientDialog open={openNew} setOpen={setOpenNew} />
      {/* delete */}
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm delete?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This patient will be permanently
              removed.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                handleDelete(deleteId!);
              }}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default UserTablePage;
