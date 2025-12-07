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
import { useCategory, useUpdateCategory } from "@/hooks/queries/useCategory";
import { useMedicine, useMedicineById, useUpdateMedicine } from "@/hooks/queries/useMedicine";
import { Medicine } from "@/interfaces/medicine";

interface Props {
    open: boolean;
    setOpen: (value: boolean) => void;
    medicine: Medicine | null;
}


const updateMedicineSchema = z.object({
    name: z.string().min(2, "Tên thuốc phải có ít nhất 2 ký tự"),
    activeIngredient: z.string().min(2, "Hoạt chất phải có ít nhất 2 ký tự"),
    unit: z.string().min(1, "Đơn vị không được để trống"),
    concentration: z.string().min(1, "Nồng độ không được để trống"),
    packaging: z.string().min(1, "Đóng gói không được để trống"),
    quantity: z.number().min(0, "Số lượng phải lớn hơn hoặc bằng 0"),
    purchasePrice: z.number().min(0, "Giá nhập phải lớn hơn hoặc bằng 0"),
    sellingPrice: z.number().min(0, "Giá bán phải lớn hơn hoặc bằng 0"),
    expiresAt: z.string().min(1, "Ngày hết hạn không được để trống"),
    manufacturer: z.string().min(2, "Nhà sản xuất phải có ít nhất 2 ký tự"),
    categoryId: z.string().min(1, "Vui lòng chọn loại thuốc"),
    description: z.string().optional(),
    sideEffects: z.string().optional(),
    storageConditions: z.string().optional(),
});


const UpdateMedicineDialog = ({ open, setOpen, medicine }: Props) => {

    const { data: medicineDetail } = useMedicineById(medicine?.id || "");
    const { data: categoryData, isLoading: isLoadingCategory } = useCategory({ limit: 1000, page: 1 });
    const form = useForm({
        resolver: zodResolver(updateMedicineSchema),
        defaultValues: {
            name: medicineDetail?.name || "",
            activeIngredient: medicineDetail?.activeIngredient || "",
            unit: medicineDetail?.unit || "",
            concentration: medicineDetail?.concentration || "",
            packaging: medicineDetail?.packaging || "",
            quantity: medicineDetail?.quantity || 0,
            purchasePrice: medicineDetail?.purchasePrice || 0,
            sellingPrice: medicineDetail?.sellingPrice || 0,
            expiresAt: medicineDetail?.expiresAt || "",
            manufacturer: medicineDetail?.manufacturer || "",
            categoryId: medicineDetail?.category?.id || "",
            description: medicineDetail?.description || "",
            sideEffects: medicineDetail?.sideEffects || "",
            storageConditions: medicineDetail?.storageConditions || "",
        },
    });
    const { mutate: updateItem, isPending } = useUpdateMedicine();
    const handleClose = () => {
        setOpen(false);
        form.reset();
    }
    const onSubmit = (data: z.infer<typeof updateMedicineSchema>) => {
        if (!medicine) return;
        updateItem(
            {
                id: medicine.id,
                data: data,
            } as any,
            {
                onSuccess: () => {
                    toast.success("Medicine updated");
                    handleClose();
                },
                onError: (error: any) => {
                    toast.error(error?.response?.data?.message || "Update medicine failed");
                },
            }
        );
    }
    useEffect(() => {
        if (medicineDetail) {
            form.reset({
                name: medicineDetail.name,
                activeIngredient: medicineDetail.activeIngredient,
                unit: medicineDetail.unit,
                concentration: medicineDetail.concentration,
                packaging: medicineDetail.packaging,
                quantity: medicineDetail.quantity,
                purchasePrice: medicineDetail.purchasePrice,
                sellingPrice: medicineDetail.sellingPrice,
                expiresAt: medicineDetail.expiresAt,
                manufacturer: medicineDetail.manufacturer,
                categoryId: medicineDetail.category.id,
                description: medicineDetail.description,
                sideEffects: medicineDetail.sideEffects,
                storageConditions: medicineDetail.storageConditions,
            });
        }
    }, [medicineDetail]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-2xl max-h-[95vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Cập nhật thuốc</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">

                        {/* FORM FIELDS */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        <RequiredLabel>Tên thuốc</RequiredLabel>
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="Tên thuốc" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="activeIngredient"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        <RequiredLabel>Hoạt chất</RequiredLabel>
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="Hoạt chất" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="unit"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        <RequiredLabel>Đơn vị</RequiredLabel>
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="Đơn vị" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="concentration"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        <RequiredLabel>Nồng độ</RequiredLabel>
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nồng độ" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="packaging"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        <RequiredLabel>Đóng gói</RequiredLabel>
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="Đóng gói" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="quantity"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        <RequiredLabel>Số lượng</RequiredLabel>
                                    </FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="Số lượng" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="purchasePrice"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        <RequiredLabel>Giá nhập</RequiredLabel>
                                    </FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="Giá nhập" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="sellingPrice"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        <RequiredLabel>Giá bán</RequiredLabel>
                                    </FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="Giá bán" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="expiresAt"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        <RequiredLabel>Ngày hết hạn</RequiredLabel>
                                    </FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="manufacturer"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        <RequiredLabel>Nhà sản xuất</RequiredLabel>
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nhà sản xuất" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="categoryId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        <RequiredLabel>Loại thuốc</RequiredLabel>
                                    </FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Chọn loại thuốc" />
                                            </SelectTrigger>
                                            <SelectContent>

                                                {/* Render danh sách category */}
                                                {isLoadingCategory ? "Loading..." : categoryData?.data.content.map((category) => (
                                                    <SelectItem key={category.id} value={category.id}>
                                                        {category.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mô tả</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Mô tả" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="sideEffects"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tác dụng phụ</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Tác dụng phụ" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="storageConditions"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Điều kiện bảo quản</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Điều kiện bảo quản" {...field} />
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
    )
}

export default UpdateMedicineDialog