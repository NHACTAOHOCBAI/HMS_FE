// src/schemas/medicine.schema.ts
import z from "zod";

export const medicineFormSchema = z.object({
    name: z.string().min(2, "Tên thuốc tối thiểu 2 ký tự"),
    activeIngredient: z.string().min(2, "Hoạt chất bắt buộc nhập"),
    categoryId: z.string().min(1, "Phải chọn danh mục"),
    unit: z.string().min(1, "Đơn vị không được để trống"),
    concentration: z.string().min(1, "Hàm lượng bắt buộc"),
    packaging: z.string().nullable().optional(),
    quantity: z.number().min(0, "Số lượng không hợp lệ"),
    purchasePrice: z.number().min(0, "Giá nhập không hợp lệ"),
    sellingPrice: z.number().min(0, "Giá bán không hợp lệ"),
    expiresAt: z.string().min(1, "Vui lòng chọn hạn sử dụng"),
    description: z.string().nullable().optional(),
});

export type MedicineFormType = z.infer<typeof medicineFormSchema>;
