"use client";
import z from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  RequiredLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useEffect } from "react";

import {
  useAppointmentById,
  useUpdateAppointment,
} from "@/hooks/queries/useAppointment";
import { AppointmentType } from "@/interfaces/appointment";

interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  appointmentId: string | null;
}

// ----------------------
// 🟩 Zod Schema
// ----------------------
const UpdateAppointmentSchema = z.object({
  appointmentTime: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), "Invalid date and time"),
  type: z.enum(["CONSULTATION", "FOLLOW_UP", "EMERGENCY"]),
  reason: z.string().min(1, "Reason is required").max(255),
  notes: z.string().optional(),
});

export function UpdateAppointmentDialog({
  open,
  setOpen,
  appointmentId,
}: Props) {
  const { data: appointment } = useAppointmentById(appointmentId || "");
  const { mutate: updateItem, isPending } = useUpdateAppointment();

  const form = useForm<z.infer<typeof UpdateAppointmentSchema>>({
    resolver: zodResolver(UpdateAppointmentSchema),
    defaultValues: {
      appointmentTime: new Date().toISOString(),
      type: "CONSULTATION",
      reason: "",
      notes: "",
    },
  });

  useEffect(() => {
    if (appointment) {
      form.reset({
        appointmentTime: appointment.appointmentTime,
        type: appointment.type,
        reason: appointment.reason,
        notes: appointment.notes || "",
      });
    }
  }, [appointment, form]);

  const handleClose = () => {
    setOpen(false);
    form.reset();
  };

  function onSubmit(values: z.infer<typeof UpdateAppointmentSchema>) {
    if (!appointment) return;

    updateItem(
      {
        id: appointment.id,
        data: {
          appointmentTime: values.appointmentTime,
          notes: values.notes,
          reason: values.reason,
          type: values.type as AppointmentType,
        },
      },
      {
        onSuccess: () => {
          toast.success("Appointment updated");
          handleClose();
        },
        onError: (err) => toast.error(err.message),
      }
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-2xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Appointment</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <FormField
              control={form.control}
              name="appointmentTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <RequiredLabel>Appointment Time</RequiredLabel>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <RequiredLabel>Appointment Type</RequiredLabel>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isPending}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="CONSULTATION">Consultation</SelectItem>
                      <SelectItem value="FOLLOW_UP">Follow Up</SelectItem>
                      <SelectItem value="EMERGENCY">Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <RequiredLabel>Reason</RequiredLabel>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                Update
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
