"use client";

import { z } from "zod";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
  RequiredLabel,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

import { toast } from "sonner";
import { CreatePrescriptionDto } from "@/interfaces/prescription";
import { useCreatePrescription } from "@/hooks/queries/usePrescription";

export const PrescriptionItemSchema = z.object({
  medicineId: z.string().min(1, "Medicine is required"),
  quantity: z.number().min(1, "Quantity must be > 0"),
  dosage: z.string().min(1, "Dosage is required"),
  durationDays: z.number().min(1, "Duration must be > 0"),
  instructions: z.string().optional(),
});

export const CreatePrescriptionSchema = z.object({
  notes: z.string().optional().default(""),
  items: z.array(PrescriptionItemSchema).min(1, "At least 1 item is required"),
});

interface Props {
  open: boolean;
  setOpen: (v: boolean) => void;
}


export function AddPrescriptionDialog({ open, setOpen }: Props) {
  const form = useForm<CreatePrescriptionDto>({
    resolver: zodResolver(CreatePrescriptionSchema),
    defaultValues: {
      notes: "",
      items: [
        {
          medicineId: "",
          quantity: 1,
          dosage: "",
          durationDays: 1,
          instructions: "",
        },
      ],
    },
  });

  const { mutate: createPrescription, isPending } = useCreatePrescription();

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  function onSubmit(values: CreatePrescriptionDto) {
    createPrescription(values, {
      onSuccess: () => {
        toast.success("Prescription created successfully");
        handleClose();
      },
      onError: (err: any) => {
        toast.error(err?.message || "Error creating prescription");
      },
    });
  }

  const handleClose = () => {
    setOpen(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-3xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Prescription</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

            {/* NOTES */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <RequiredLabel>Notes</RequiredLabel>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="General notes..." {...field} disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ITEMS */}
            <div className="space-y-4">
              {fields.map((item, index) => (
                <div
                  key={item.id}
                  className="border rounded-xl p-4 grid grid-cols-2 gap-4 relative"
                >
                  {/* medicineId */}
                  <FormField
                    control={form.control}
                    name={`items.${index}.medicineId`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel><RequiredLabel>Medicine</RequiredLabel></FormLabel>
                        <FormControl>
                          <Input placeholder="Medicine ID" {...field} disabled={isPending} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* quantity */}
                  <FormField
                    control={form.control}
                    name={`items.${index}.quantity`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} disabled={isPending} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* dosage */}
                  <FormField
                    control={form.control}
                    name={`items.${index}.dosage`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel><RequiredLabel>Dosage</RequiredLabel></FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 1 capsule twice daily" {...field} disabled={isPending} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* durationDays */}
                  <FormField
                    control={form.control}
                    name={`items.${index}.durationDays`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration (days)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} disabled={isPending} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* instructions */}
                  <FormField
                    control={form.control}
                    name={`items.${index}.instructions`}
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Instructions</FormLabel>
                        <FormControl>
                          <Input placeholder="Extra instructions..." {...field} disabled={isPending} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="button"
                    variant="destructive"
                    className="absolute top-2 right-2"
                    size="sm"
                    onClick={() => remove(index)}
                    disabled={isPending || fields.length <= 1}
                  >
                    Remove
                  </Button>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  append({
                    medicineId: "",
                    quantity: 1,
                    dosage: "",
                    durationDays: 1,
                    instructions: "",
                  })
                }
                disabled={isPending}
              >
                + Add Item
              </Button>
            </div>

            {/* ACTIONS */}
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={handleClose} disabled={isPending}>
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
