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

import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectItem,
    SelectContent,
} from "@/components/ui/select";

import { useCreateMedicine } from "@/hooks/queries/useMedicine";
import { useCategory } from "@/hooks/queries/useCategory";
import { toast } from "sonner";

const AddMedicineSchema = z.object({
    name: z.string().min(2, "Tên thuốc phải có ít nhất 2 ký tự"),
    activeIngredient: z.string().min(2, "Hoạt chất phải có ít nhất 2 ký tự"),
    unit: z.string().min(1, "Đơn vị không được để trống"),
    concentration: z.string().min(1, "Nồng độ không được để trống"),
    packaging: z.string().min(1, "Đóng gói không được để trống"),
    quantity: z.number().min(0, "Số lượng phải lớn hơn hoặc bằng 0"),
    purchasePrice: z.number().min(0, "Giá nhập phải lớn hơn hoặc bằng 0"),
    sellingPrice: z.number().min(0, "Giá bán phải lớn hơn hoặc bằng 0"),

    expiresAt: z
        .string()
        .refine((v) => !isNaN(Date.parse(v)), "Ngày hết hạn phải đúng định dạng"),

    manufacturer: z.string().min(2, "Nhà sản xuất phải có ít nhất 2 ký tự"),

    categoryId: z.string().min(1, "Vui lòng chọn loại thuốc"),

    description: z.string().optional(),
    sideEffects: z.string().optional(),
    storageConditions: z.string().optional(),
});

interface Props {
    open: boolean;
    setOpen: (value: boolean) => void;
}

export function AddMedicineDialog({ open, setOpen }: Props) {
    const { mutate: createMedicine, isPending } = useCreateMedicine();
    const { data: categoryData, isLoading: catLoading } = useCategory({ page: 1, limit: 100 });

    const form = useForm<z.infer<typeof AddMedicineSchema>>({
        resolver: zodResolver(AddMedicineSchema),
        defaultValues: {
            name: "",
            activeIngredient: "",
            unit: "",
            concentration: "",
            packaging: "",
            quantity: 0,
            purchasePrice: 0,
            sellingPrice: 0,
            expiresAt: "",
            manufacturer: "",
            categoryId: "",
            description: "",
            sideEffects: "",
            storageConditions: "",
        },
    });

    const onSubmit = (values: z.infer<typeof AddMedicineSchema>) => {
        createMedicine(values, {
            onSuccess: () => {
                toast.success("Medicine created successfully!");
                handleCancel();
            },
            onError: (err) => {
                toast.error(err.message);
            },
        });
    };

    const handleCancel = () => {
        setOpen(false);
        form.reset();
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add Medicine</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            {/* NAME */}
                            <FormField
                                disabled={isPending}
                                control={form.control}
                                name="name"
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

                            {/* ACTIVE INGREDIENT */}
                            <FormField
                                disabled={isPending}
                                control={form.control}
                                name="activeIngredient"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            <RequiredLabel>Active Ingredient</RequiredLabel>
                                        </FormLabel>
                                        <FormControl>
                                            <Input {...field} disabled={isPending} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* UNIT */}
                            <FormField
                                disabled={isPending}
                                control={form.control}
                                name="unit"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            <RequiredLabel>Unit</RequiredLabel>
                                        </FormLabel>
                                        <FormControl>
                                            <Input {...field} disabled={isPending} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* CONCENTRATION */}
                            <FormField
                                disabled={isPending}
                                control={form.control}
                                name="concentration"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            <RequiredLabel>Concentration</RequiredLabel>
                                        </FormLabel>
                                        <FormControl>
                                            <Input {...field} disabled={isPending} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* PACKAGING */}
                            <FormField
                                disabled={isPending}
                                control={form.control}
                                name="packaging"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            <RequiredLabel>Packaging</RequiredLabel>
                                        </FormLabel>
                                        <FormControl>
                                            <Input {...field} disabled={isPending} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* QUANTITY */}
                            <FormField
                                disabled={isPending}
                                control={form.control}
                                name="quantity"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            <RequiredLabel>Quantity</RequiredLabel>
                                        </FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} disabled={isPending} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* PRICES */}
                            <FormField
                                disabled={isPending}
                                control={form.control}
                                name="purchasePrice"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            <RequiredLabel>Purchase Price</RequiredLabel>
                                        </FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} disabled={isPending} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                disabled={isPending}
                                control={form.control}
                                name="sellingPrice"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            <RequiredLabel>Selling Price</RequiredLabel>
                                        </FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} disabled={isPending} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* EXPIRES AT */}
                            <FormField
                                disabled={isPending}
                                control={form.control}
                                name="expiresAt"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            <RequiredLabel>Expires At</RequiredLabel>
                                        </FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} disabled={isPending} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* MANUFACTURER */}
                            <FormField
                                disabled={isPending}
                                control={form.control}
                                name="manufacturer"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            <RequiredLabel>Manufacturer</RequiredLabel>
                                        </FormLabel>
                                        <FormControl>
                                            <Input {...field} disabled={isPending} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* CATEGORY */}
                            <FormField
                                disabled={isPending}
                                control={form.control}
                                name="categoryId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            <RequiredLabel>Category</RequiredLabel>
                                        </FormLabel>
                                        <Select
                                            disabled={isPending || catLoading}
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select category" />
                                                </SelectTrigger>
                                            </FormControl>

                                            <SelectContent>
                                                {categoryData?.data.content.map((cat) => (
                                                    <SelectItem key={cat.id} value={cat.id}>
                                                        {cat.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* OPTIONAL FIELDS */}
                            <FormField
                                disabled={isPending}
                                control={form.control}
                                name="description"
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

                            <FormField
                                disabled={isPending}
                                control={form.control}
                                name="sideEffects"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Side Effects</FormLabel>
                                        <FormControl>
                                            <Input {...field} disabled={isPending} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                disabled={isPending}
                                control={form.control}
                                name="storageConditions"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Storage Conditions</FormLabel>
                                        <FormControl>
                                            <Input {...field} disabled={isPending} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* BUTTONS */}
                        <div className="flex justify-end gap-3">
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
