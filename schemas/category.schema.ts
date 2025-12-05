// src/schemas/category.schema.ts
import z from "zod";

export const categorySchema = z.object({
    name: z.string().min(2, "Tên danh mục tối thiểu 2 ký tự"),
    description: z.string().min(1, "Mô tả bắt buộc"),
});

export type CategoryFormType = z.infer<typeof categorySchema>;
