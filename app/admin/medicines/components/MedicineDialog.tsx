import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Category } from "@/interfaces/category";
import type { SubmitHandler } from "react-hook-form";

const MedicineDialog = ({ isMedicineModalOpen, setIsMedicineModalOpen, editingMedicineId, categories }: { isMedicineModalOpen: boolean, setIsMedicineModalOpen: React.Dispatch<React.SetStateAction<boolean>>, editingMedicineId: string | null, categories: Category[] | undefined }) => {

    // 2. Zod Schemas
    const medicineFormSchema = z.object({
        name: z.string().min(2, "Tên thuốc tối thiểu 2 ký tự"),
        activeIngredient: z.string().min(2, "Hoạt chất bắt buộc nhập"),
        categoryId: z.string().min(1, "Phải chọn danh mục"), // string do Select trả về
        unit: z.string().min(1, "Đơn vị không được để trống"),
        concentration: z.string().min(1, "Hàm lượng bắt buộc"),
        packaging: z.string().nullable().optional(),
        quantity: z.number().min(0, "Số lượng không hợp lệ"),
        purchasePrice: z.number().min(0, "Giá nhập không hợp lệ"),
        sellingPrice: z.number().min(0, "Giá bán không hợp lệ"),

        expiresAt: z.string().min(1, "Vui lòng chọn hạn sử dụng"),
        description: z.string().nullable().optional(),
    });


    const categorySchema = z.object({
        name: z.string().min(2, "Tên danh mục tối thiểu 2 ký tự"),
        description: z.string().min(1, "Mô tả bắt buộc"),
    });

    // Forms Hooks
    const medicineForm = useForm<z.infer<typeof medicineFormSchema>>({
        resolver: zodResolver(medicineFormSchema),
        defaultValues: {
            name: "",
            activeIngredient: "",
            unit: "",
            categoryId: "",
            quantity: 0,
            purchasePrice: 0,
            sellingPrice: 0,
            concentration: "",
            expiresAt: "",
            packaging: "",
            description: "",
        },
    });

    const categoryForm = useForm<z.infer<typeof categorySchema>>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: "",
            description: "",
        },
    });
    const onMedicineSubmit: SubmitHandler<z.infer<typeof medicineFormSchema>> = (values) => {
        // if (editingMedicineId) {
        //   onUpdate(editingMedicineId, values);
        // } else {
        //   onAdd(values);
        // }
        setIsMedicineModalOpen(false);
    };


    return (<>
        {/* --- MEDICINE DIALOG (FORM) --- */}
        <Dialog open={isMedicineModalOpen} onOpenChange={setIsMedicineModalOpen}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{editingMedicineId ? "Cập nhật thông tin thuốc" : "Thêm thuốc mới"}</DialogTitle>
                    <DialogDescription>
                        Điền đầy đủ thông tin thuốc vào biểu mẫu dưới đây.
                    </DialogDescription>
                </DialogHeader>

                <Form {...medicineForm}>
                    <form onSubmit={medicineForm.handleSubmit(onMedicineSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={medicineForm.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tên thuốc <span className="text-red-500">*</span></FormLabel>
                                        <FormControl>
                                            <Input placeholder="VD: Panadol Extra" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={medicineForm.control}
                                name="activeIngredient"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Hoạt chất <span className="text-red-500">*</span></FormLabel>
                                        <FormControl>
                                            <Input placeholder="VD: Paracetamol" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={medicineForm.control}
                                name="categoryId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Danh mục <span className="text-red-500">*</span></FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Chọn danh mục" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {categories?.map((category) => (
                                                    <SelectItem key={category.id} value={category.id.toString()}>
                                                        {category.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={medicineForm.control}
                                name="quantity"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Số lượng <span className="text-red-500">*</span></FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={medicineForm.control}
                                name="unit"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Đơn vị tính <span className="text-red-500">*</span></FormLabel>
                                        <FormControl>
                                            <Input placeholder="viên, vỉ, hộp..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={medicineForm.control}
                                name="concentration"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Hàm lượng <span className="text-red-500">*</span></FormLabel>
                                        <FormControl>
                                            <Input placeholder="500mg" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={medicineForm.control}
                                name="sellingPrice"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Giá bán (VNĐ) <span className="text-red-500">*</span></FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={medicineForm.control}
                                name="expiresAt"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Hạn sử dụng <span className="text-red-500">*</span></FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <DialogFooter className="pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsMedicineModalOpen(false)}>
                                Hủy bỏ
                            </Button>
                            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                                {editingMedicineId ? "Lưu thay đổi" : "Tạo mới"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    </>);
}

export default MedicineDialog