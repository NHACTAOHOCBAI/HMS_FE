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
import { useCreatePatient } from "@/hooks/queries/usePatient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
}
const AddPatientSchema = z.object({
  fullName: z.string("fullName is required"),
});
export function AddPatientDialog({ open, setOpen }: Props) {
  const { mutate: createItem, isPending } = useCreatePatient();
  const form = useForm<z.infer<typeof AddPatientSchema>>({
    resolver: zodResolver(AddPatientSchema),
  });
  function onSubmit(values: z.infer<typeof AddPatientSchema>) {
    createItem(
      {
        fullName: values.fullName,
      },
      {
        onSuccess: () => {
          console.log("Patient created successfully");
          toast.success("Patient has been created");
          handleCancel();
        },
        onError: (error) => {
          toast.error(`Ohh!!! ${error.message}`);
        },
      }
    );
  }
  const handleCancel = () => {
    setOpen(false);
    form.reset();
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md max-h-[98vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Patient</DialogTitle>
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
                onClick={handleCancel}
                variant={"outline"}
              >
                Cancel
              </Button>
              <Button disabled={isPending} type="submit">
                Create
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
