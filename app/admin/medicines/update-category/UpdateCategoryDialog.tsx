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

import { usePatientById, useUpdatePatient } from "@/hooks/queries/usePatient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { toast } from "sonner";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Category } from "@/interfaces/category";
import { useUpdateCategory } from "@/hooks/queries/useCategory";

interface Props {
    open: boolean;
    setOpen: (value: boolean) => void;
    category: Category | null;
}
// zod
const updateCategorySchema = z.object({
    name: z.string().min(2, "Tên loại thuốc phải có ít nhất 2 ký tự"),
    description: z.string().optional(),
});

const UpdateCategoryDialog = ({ open, setOpen, category }: Props) => {
    const form = useForm({
        resolver: zodResolver(updateCategorySchema),
        defaultValues: {
            name: category?.name || "",
            description: category?.description || "",
        },
    });
    const { mutate: updateItem, isPending } = useUpdateCategory();
    const handleClose = () => {
        setOpen(false);
        form.reset();
    }
    const onSubmit = (data: z.infer<typeof updateCategorySchema>) => {
        if (!category) return;
        updateItem(
            {
                id: category.id,
                data: data,
            },
            {
                onSuccess: () => {
                    toast.success("Category updated");
                    handleClose();
                },
                onError: (error: any) => {
                    toast.error(error?.response?.data?.message || "Update category failed");
                },
            }
        );
    }
    useEffect(() => {
        if (category) {
            form.reset({
                name: category.name,
                description: category.description,
            });
        }
    }, [category]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-2xl max-h-[95vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Cập nhật thuốc</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                        {/* className="grid grid-cols-2 gap-4" */}
                        <div className="grid gap-4">
                            {/*  NAME */}
                            <FormField
                                disabled={isPending}
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            <RequiredLabel>Tên loại thước</RequiredLabel>
                                        </FormLabel>
                                        <FormControl>
                                            <Input disabled={isPending} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/*  NAME */}
                            <FormField
                                disabled={isPending}
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            <RequiredLabel>Mô tả loại thuốc</RequiredLabel>
                                        </FormLabel>
                                        <FormControl>
                                            <Input disabled={isPending} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

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
    )
}

export default UpdateCategoryDialog