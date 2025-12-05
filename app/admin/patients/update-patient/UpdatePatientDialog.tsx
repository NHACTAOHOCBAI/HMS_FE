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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useUpdatePatient } from "@/hooks/queries/usePatient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useEffect } from "react";
import { Patient } from "@/interfaces/patient";

interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  patient: Patient | null;
}

const UpdatePatientSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
});

export function UpdatePatientDialog({ open, setOpen, patient }: Props) {
  const { mutate: updateItem, isPending } = useUpdatePatient();

  const form = useForm<z.infer<typeof UpdatePatientSchema>>({
    resolver: zodResolver(UpdatePatientSchema),
    defaultValues: {
      fullName: "",
    },
  });

  // 🟦 Load data vào form khi modal mở
  useEffect(() => {
    if (patient) {
      form.reset({
        fullName: patient.fullName,
      });
    }
  }, [patient, form]);

  function onSubmit(values: z.infer<typeof UpdatePatientSchema>) {
    if (!patient) return;

    updateItem(
      {
        id: patient.id,
        fullName: values.fullName,
      },
      {
        onSuccess: () => {
          toast.success("Patient has been updated");
          handleClose();
        },
        onError: (error) => {
          toast.error(`Error: ${error.message}`);
        },
      }
    );
  }

  const handleClose = () => {
    setOpen(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md max-h-[98vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Patient</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              disabled={isPending}
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      placeholder="Nguyen Dang Phuc"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-3 justify-end">
              <Button
                disabled={isPending}
                type="button"
                onClick={handleClose}
                variant={"outline"}
              >
                Cancel
              </Button>
              <Button disabled={isPending} type="submit">
                Update
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
