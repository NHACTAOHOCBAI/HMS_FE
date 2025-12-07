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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent } from "@/components/ui/popover";

import { useCreateAppointment } from "@/hooks/queries/useAppointment";
import { AppointmentType } from "@/interfaces/appointment";

interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
}

const AppointmentTypeEnum = z.enum(["CONSULTATION", "FOLLOW_UP", "SURGERY"]);

const AddAppointmentSchema = z.object({
  patientId: z.string().min(1, "Patient is required"),
  doctorId: z.string().min(1, "Doctor is required"),
  appointmentTime: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), "Invalid date and time"),
  type: AppointmentTypeEnum.refine(
    (val) => val !== undefined,
    "Appointment type is required"
  ),
  reason: z.string().min(1, "Reason is required").max(255),
});

export function AddAppointmentDialog({ open, setOpen }: Props) {
  const { mutate: createAppointment, isPending } = useCreateAppointment();
  const form = useForm<z.infer<typeof AddAppointmentSchema>>({
    resolver: zodResolver(AddAppointmentSchema),
    defaultValues: {
      patientId: "",
      doctorId: "",
      appointmentTime: new Date().toISOString(), // mặc định là hiện tại
      type: "CONSULTATION", // default type
      reason: "",
    },
  });

  const handleCancel = () => {
    setOpen(false);
    form.reset();
  };

  const onSubmit = (values: z.infer<typeof AddAppointmentSchema>) => {
    createAppointment(
      {
        appointmentTime: values.appointmentTime,
        doctorId: values.doctorId,
        patientId: values.patientId,
        reason: values.reason,
        type: values.type as AppointmentType,
      },
      {
        onSuccess: () => {
          toast.success("Appointment created successfully");
          handleCancel();
        },
        onError: (err) => {
          toast.error(err.message || "Failed to create appointment");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-2xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Appointment</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Patient */}
              <FormField
                control={form.control}
                name="patientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <RequiredLabel>Patient</RequiredLabel>
                    </FormLabel>
                    <Select
                      disabled={isPending}
                      onValueChange={field.onChange}
                      value={field.value || ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Patient" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pat001">Nguyen Van A</SelectItem>
                        <SelectItem value="pat002">Tran Thi B</SelectItem>
                        <SelectItem value="pat003">Le Van C</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Doctor */}
              <FormField
                control={form.control}
                name="doctorId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <RequiredLabel>Doctor</RequiredLabel>
                    </FormLabel>
                    <Select
                      disabled={isPending}
                      onValueChange={field.onChange}
                      value={field.value || ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Doctor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="doc001">
                          Dr. Nguyen Van Hung
                        </SelectItem>
                        <SelectItem value="doc002">Dr. Tran Thi B</SelectItem>
                        <SelectItem value="doc003">Dr. Le Van C</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Appointment Time */}
              <FormField
                control={form.control}
                name="appointmentTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <RequiredLabel>Appointment Time</RequiredLabel>
                    </FormLabel>
                    <Popover>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={
                            field.value ? new Date(field.value) : undefined
                          }
                          onSelect={(date) => {
                            if (!date) return;
                            field.onChange(date.toISOString());
                          }}
                          autoFocus
                        />
                      </PopoverContent>
                      <FormControl>
                        <Input
                          disabled={isPending}
                          placeholder="Select Date"
                          value={
                            field.value
                              ? new Date(field.value).toLocaleDateString()
                              : ""
                          }
                          readOnly
                        />
                      </FormControl>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Type */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <RequiredLabel>Type</RequiredLabel>
                    </FormLabel>
                    <Select
                      disabled={isPending}
                      onValueChange={field.onChange}
                      value={field.value || ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="CONSULTATION">
                          Consultation
                        </SelectItem>
                        <SelectItem value="FOLLOW_UP">Follow Up</SelectItem>
                        <SelectItem value="SURGERY">Surgery</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Reason */}
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>
                      <RequiredLabel>Reason</RequiredLabel>
                    </FormLabel>
                    <FormControl>
                      <Input disabled={isPending} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-3 justify-end">
              <Button type="button" onClick={handleCancel} variant="outline">
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                Create
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
