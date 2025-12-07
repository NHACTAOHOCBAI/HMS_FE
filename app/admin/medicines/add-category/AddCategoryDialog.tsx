"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
    RequiredLabel,
} from "@/components/ui/form";

import { toast } from "sonner";
import { useCreateCategory } from "@/hooks/queries/useCategory";

interface Props {
    open: boolean;
    setOpen: (value: boolean) => void;
}
const createCategorySchema = z.object({
    name: z.string().min(2, "Tên loại thuốc phải có ít nhất 2 ký tự"),
    description: z.string().optional(),
});

type CreateCategoryDto = z.infer<typeof createCategorySchema>;

export function AddCategoryDialog({ open, setOpen }: Props) {
    const { mutate: createCategory, isPending } = useCreateCategory();

    const form = useForm<CreateCategoryDto>({
        resolver: zodResolver(createCategorySchema),
        defaultValues: {
            name: "",
            description: "",
        },
    });

    const onSubmit = (values: CreateCategoryDto) => {
        createCategory(values, {
            onSuccess: () => {
                toast.success("Category created successfully!");
                handleCancel();
            },
            onError: (err) => {
                toast.error(err.message);
            },
        });
    };

    const handleCancel = () => {
        form.reset();
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Add Category</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                        {/* NAME */}
                        <FormField
                            control={form.control}
                            name="name"
                            disabled={isPending}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        <RequiredLabel>Name</RequiredLabel>
                                    </FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* DESCRIPTION */}
                        <FormField
                            control={form.control}
                            name="description"
                            disabled={isPending}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* BUTTONS */}
                        <div className="flex justify-end gap-3 pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleCancel}
                                disabled={isPending}
                            >
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
