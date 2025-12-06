"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { toast } from "sonner";

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
import { Button } from "@/components/ui/button";
import { useExamById, useUpdateMedicalExam } from "@/hooks/queries/useMedicalExam";

// --- Hooks API ---

// ------------------------------------------------------------
//  🟩 Zod Schema for Update Medical Exam
// ------------------------------------------------------------
const UpdateMedicalExamSchema = z.object({
    diagnosis: z.string().min(1, "Diagnosis is required"),
    symptoms: z.string().min(1, "Symptoms are required"),
    treatment: z.string().min(1, "Treatment is required"),

    temperature: z.number("Temperature must be a number"),

    bloodPressureSystolic: z.number(),
    bloodPressureDiastolic: z.number(),
    heartRate: z.number(),
    weight: z.number(),
    height: z.number(),

    notes: z.string().optional(),
});

export type UpdateMedicalExamDto = z.infer<typeof UpdateMedicalExamSchema>;

interface Props {
    open: boolean;
    setOpen: (value: boolean) => void;
    medicalExamId: string | null;
}

// ------------------------------------------------------------
//  🟦 Component
// ------------------------------------------------------------
export function UpdateMedicalExamDialog({
    open,
    setOpen,
    medicalExamId,
}: Props) {
    const { data: examData } = useExamById({ id: medicalExamId || "" });
    const { mutate: updateExam, isPending } = useUpdateMedicalExam();
    const exam = examData?.data;

    const form = useForm<UpdateMedicalExamDto>({
        resolver: zodResolver(UpdateMedicalExamSchema),
        defaultValues: {
            diagnosis: "",
            symptoms: "",
            treatment: "",
            temperature: 0,
            bloodPressureSystolic: 0,
            bloodPressureDiastolic: 0,
            heartRate: 0,
            weight: 0,
            height: 0,
            notes: "",
        },
    });

    // ------------------------------------------------------------
    //  🟦 Load initial values when exam loaded
    // ------------------------------------------------------------
    useEffect(() => {
        if (exam) {
            form.reset({
                diagnosis: exam.diagnosis,
                symptoms: exam.symptoms,
                treatment: exam.treatment,
                temperature: exam.vitals.temperature,
                bloodPressureSystolic: exam.vitals.bloodPressureSystolic,
                bloodPressureDiastolic: exam.vitals.bloodPressureDiastolic,
                heartRate: exam.vitals.heartRate,
                weight: exam.vitals.weight,
                height: exam.vitals.height,
                notes: exam.notes ?? "",
            });
        }
    }, [exam, form]);

    // ------------------------------------------------------------
    //  🟥 Submit
    // ------------------------------------------------------------
    const onSubmit = (values: UpdateMedicalExamDto) => {
        if (!exam) return;

        updateExam(
            {
                id: exam.id,
                data: values,
            },
            {
                onSuccess: () => {
                    toast.success("Medical exam updated");
                    handleClose();
                },
                onError: (err) => {
                    toast.error(err.message);
                },
            }
        );
    };

    const handleClose = () => {
        setOpen(false);
        form.reset();
    };

    // ------------------------------------------------------------
    //  🟩 RENDER UI
    // ------------------------------------------------------------
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Update Medical Exam</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="grid gap-4"
                    >
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

                        {/* Numeric Fields */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="temperature"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            <RequiredLabel>Temperature</RequiredLabel>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="0.1"
                                                disabled={isPending}
                                                {...field}
                                                onChange={(e) =>
                                                    field.onChange(parseFloat(e.target.value))
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="heartRate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            <RequiredLabel>Heart Rate</RequiredLabel>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                disabled={isPending}
                                                {...field}
                                                onChange={(e) =>
                                                    field.onChange(Number(e.target.value))
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="bloodPressureSystolic"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            <RequiredLabel>Systolic</RequiredLabel>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                disabled={isPending}
                                                {...field}
                                                onChange={(e) =>
                                                    field.onChange(Number(e.target.value))
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="bloodPressureDiastolic"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            <RequiredLabel>Diastolic</RequiredLabel>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                disabled={isPending}
                                                {...field}
                                                onChange={(e) =>
                                                    field.onChange(Number(e.target.value))
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="weight"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            <RequiredLabel>Weight (kg)</RequiredLabel>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                disabled={isPending}
                                                {...field}
                                                onChange={(e) =>
                                                    field.onChange(Number(e.target.value))
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="height"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            <RequiredLabel>Height (cm)</RequiredLabel>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                disabled={isPending}
                                                {...field}
                                                onChange={(e) =>
                                                    field.onChange(Number(e.target.value))
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* NOTES — OPTIONAL */}
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

                        {/* ACTION BUTTONS */}
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
