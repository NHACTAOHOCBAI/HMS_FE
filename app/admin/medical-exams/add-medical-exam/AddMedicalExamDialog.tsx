"use client";
import { z } from "zod";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useCreateMedicalExam } from "@/hooks/queries/useMedicalExam";
import { CreateMedicalExamDto } from "@/interfaces/medicalExam";

export const CreateMedicalExamSchema = z.object({
  appointmentId: z.string().min(1, "Appointment ID is required"),
  diagnosis: z.string().min(1, "Diagnosis is required"),
  symptoms: z.string().min(1, "Symptoms are required"),
  treatment: z.string().min(1, "Treatment is required"),
  notes: z.string().optional().default(""),
  temperature: z.number().min(30).max(45),
  bloodPressureSystolic: z.number().min(50).max(250),
  bloodPressureDiastolic: z.number().min(30).max(150),
  heartRate: z.number().min(30).max(200),
  weight: z.number().min(1).max(500),
  height: z.number().min(30).max(250),
});


interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
}

export function AddMedicalExamDialog({ open, setOpen }: Props) {
  const { mutate: createItem, isPending } = useCreateMedicalExam();

  const form = useForm<CreateMedicalExamDto>({
    resolver: zodResolver(CreateMedicalExamSchema),
    defaultValues: {
      appointmentId: "",
      diagnosis: "",
      symptoms: "",
      treatment: "",
      notes: "",
      temperature: 0,
      bloodPressureSystolic: 0,
      bloodPressureDiastolic: 0,
      heartRate: 0,
      weight: 0,
      height: 0,
    },
  });

  function onSubmit(values: CreateMedicalExamDto) {
    createItem(values, {
      onSuccess: () => {
        toast.success("Medical exam created successfully");
        handleCancel();
      },
      onError: (error: any) => {
        toast.error(`Error: ${error.message}`);
      },
    });
  }

  const handleCancel = () => {
    setOpen(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-2xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Medical Exam</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* APPOINTMENT ID */}
              <FormField
                control={form.control}
                name="appointmentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <RequiredLabel>Appointment ID</RequiredLabel>
                    </FormLabel>
                    <FormControl>
                      <Input disabled={isPending} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* DIAGNOSIS */}
              <FormField
                control={form.control}
                name="diagnosis"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <RequiredLabel>Diagnosis</RequiredLabel>
                    </FormLabel>
                    <FormControl>
                      <Input disabled={isPending} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* SYMPTOMS */}
              <FormField
                control={form.control}
                name="symptoms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <RequiredLabel>Symptoms</RequiredLabel>
                    </FormLabel>
                    <FormControl>
                      <Input disabled={isPending} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* TREATMENT */}
              <FormField
                control={form.control}
                name="treatment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <RequiredLabel>Treatment</RequiredLabel>
                    </FormLabel>
                    <FormControl>
                      <Input disabled={isPending} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* NOTES */}
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Input disabled={isPending} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* TEMPERATURE */}
              <FormField
                control={form.control}
                name="temperature"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <RequiredLabel>Temperature (°C)</RequiredLabel>
                    </FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" disabled={isPending} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* SYSTOLIC */}
              <FormField
                control={form.control}
                name="bloodPressureSystolic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <RequiredLabel>Systolic BP</RequiredLabel>
                    </FormLabel>
                    <FormControl>
                      <Input type="number" disabled={isPending} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* DIASTOLIC */}
              <FormField
                control={form.control}
                name="bloodPressureDiastolic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <RequiredLabel>Diastolic BP</RequiredLabel>
                    </FormLabel>
                    <FormControl>
                      <Input type="number" disabled={isPending} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* HEART RATE */}
              <FormField
                control={form.control}
                name="heartRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <RequiredLabel>Heart Rate (bpm)</RequiredLabel>
                    </FormLabel>
                    <FormControl>
                      <Input type="number" disabled={isPending} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* WEIGHT */}
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <RequiredLabel>Weight (kg)</RequiredLabel>
                    </FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" disabled={isPending} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* HEIGHT */}
              <FormField
                control={form.control}
                name="height"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <RequiredLabel>Height (cm)</RequiredLabel>
                    </FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" disabled={isPending} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-3 justify-end">
              <Button type="button" variant="outline" disabled={isPending} onClick={handleCancel}>
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