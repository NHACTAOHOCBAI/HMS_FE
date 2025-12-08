/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ReusableTable } from "@/app/admin/_components/MyTable";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { appointmentColumns } from "./columns";
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
import {
  useAppointments,
  useCancelAppointment,
  useCompleteAppointment,
} from "@/hooks/queries/useAppointment";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { Calendar } from "@/components/ui/calendar";
import { AddAppointmentDialog } from "@/app/admin/appointments/add-appointment/AddAppointmentDialog";
import { UpdateAppointmentDialog } from "@/app/admin/appointments/updpate-appointment/UpdateAppointmentDialog";
import AppointmentDetailDialog from "@/app/admin/appointments/detail-appointment/DetailAppointmentDialog";

const AppointmentTablePage = () => {
  const {
    params,
    debouncedSearch,
    updateSearch,
    updatePage,
    updateLimit,
    updateSort,
    updateFilter,
  } = useTableParams();
  const [openDetail, setOpenDetail] = useState(false);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [updatedId, setUpdatedId] = useState<string | null>(null);
  const [openCancel, setOpenCancel] = useState(false);
  const [openComplete, setOpenComplete] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [openNew, setOpenNew] = useState(false);
  const handleOpenDetail = (id: string) => {
    setDetailId(id);
    setOpenDetail(true);
  };
  const handleOpenUpdate = (id: string) => {
    setUpdatedId(id);
    setOpenUpdate(true);
  };
  const handleOpenCancel = (id: string) => {
    setSelectedId(id);
    setOpenCancel(true);
  };

  const handleOpenComplete = (id: string) => {
    setSelectedId(id);
    setOpenComplete(true);
  };

  const { data, isLoading } = useAppointments({
    ...params,
    search: debouncedSearch,
    sortOrder: params.sortOrder as "asc" | "desc" | undefined,
  });

  const { mutate: cancel } = useCancelAppointment();
  const { mutate: complete } = useCompleteAppointment();

  const handleCancel = () => {
    cancel(
      { id: selectedId!, data: { cancelReason: "User cancelled" } },
      {
        onSuccess: () => toast.success("Appointment cancelled"),
        onError: (err) => toast.error(err.message),
      }
    );
  };

  const handleComplete = () => {
    complete(selectedId!, {
      onSuccess: () => toast.success("Appointment completed"),
      onError: (err) => toast.error(err.message),
    });
  };
  return (
    <>
      <div>
        <div className="mb-5 flex items-center gap-5 flex-wrap">
          {/* Search */}
          <Input
            placeholder="Search appointment..."
            className="h-[50px] rounded-[30px] w-[320px]"
            onChange={(e) => updateSearch(e.target.value)}
          />

          {/* Doctor filter */}
          <Select onValueChange={(v) => updateFilter("doctorId", v)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by Doctor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="emp001">Dr. Nguyen Van Hung</SelectItem>
              <SelectItem value="emp002">Dr. Tran Thi B</SelectItem>
              <SelectItem value="emp003">Dr. Le Van C</SelectItem>
            </SelectContent>
          </Select>

          {/* Status filter */}
          <Select onValueChange={(v) => updateFilter("status", v)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SCHEDULED">Scheduled</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
              <SelectItem value="NO_SHOW">No Show</SelectItem>
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[180px] justify-start text-left font-normal"
              >
                {(params as any).startDate ?? "Start Date"}
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={
                  (params as any).startDate
                    ? new Date((params as any).startDate)
                    : undefined
                }
                onSelect={(date) => {
                  if (!date) return;
                  const formatted = date.toISOString().slice(0, 10);
                  updateFilter("startDate", formatted);
                }}
                autoFocus
              />
            </PopoverContent>
          </Popover>

          {/* End Date Picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[180px] justify-start text-left font-normal"
              >
                {(params as any).endDate ?? "End Date"}
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={
                  (params as any).endDate
                    ? new Date((params as any).endDate)
                    : undefined
                }
                onSelect={(date) => {
                  if (!date) return;
                  const formatted = date.toISOString().slice(0, 10);
                  updateFilter("endDate", formatted);
                }}
                autoFocus
              />
            </PopoverContent>
          </Popover>
          <Button onClick={() => setOpenNew(true)} className="ml-auto">
            New Appointment
          </Button>
        </div>

        <ReusableTable
          data={data?.data.content ?? []}
          columns={appointmentColumns(
            handleOpenCancel,
            handleOpenComplete,
            handleOpenUpdate,
            handleOpenDetail
          )}
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
      <UpdateAppointmentDialog
        appointmentId={updatedId}
        open={openUpdate}
        setOpen={setOpenUpdate}
      />
      <AppointmentDetailDialog
        appointmentId={detailId}
        open={openDetail}
        setOpen={setOpenDetail}
      />
      <AddAppointmentDialog open={openNew} setOpen={setOpenNew} />
      {/* Cancel dialog */}
      <AlertDialog open={openCancel} onOpenChange={setOpenCancel}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Appointment?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The appointment will be marked as
              cancelled.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancel}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Complete dialog */}
      <AlertDialog open={openComplete} onOpenChange={setOpenComplete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Mark as Completed?</AlertDialogTitle>
            <AlertDialogDescription>
              This will finish the appointment session.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
            <AlertDialogAction onClick={handleComplete}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AppointmentTablePage;
