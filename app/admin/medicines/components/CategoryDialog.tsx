import React, { useEffect } from 'react'

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Category } from '@/interfaces/category';
const CategoryDialog = (
    {
        isCategoryModalOpen,
        setIsCategoryModalOpen,
        editingCategory,
        setEditingCategory }
        :
        {
            isCategoryModalOpen: boolean,
            setIsCategoryModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
            editingCategory: Category | null,
            setEditingCategory: React.Dispatch<React.SetStateAction<Category | null>>,
        }
) => {

    const categorySchema = z.object({
        name: z.string().min(2, "Tên danh mục tối thiểu 2 ký tự"),
        description: z.string().min(1, "Mô tả bắt buộc"),
    });
    const categoryForm = useForm<z.infer<typeof categorySchema>>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: "",
            description: "",
        },
    });
    const onCategorySubmit = (data: z.infer<typeof categorySchema>) => {
        if (editingCategory) {
            // Call API to update category here
        } else {
            // Call API to create new category here 
        }
        setIsCategoryModalOpen(false);
    };
    useEffect(() => {
        if (editingCategory) {
            categoryForm.setValue("name", editingCategory.name);
            categoryForm.setValue("description", editingCategory.description || "");
        } else {
            categoryForm.reset();
        }
    }, [editingCategory, categoryForm]);
    return (
        <>
            <Dialog open={isCategoryModalOpen} onOpenChange={setIsCategoryModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingCategory ? "Sửa danh mục" : "Thêm danh mục mới"}</DialogTitle>
                    </DialogHeader>

                    <Form {...categoryForm}>
                        <form onSubmit={categoryForm.handleSubmit(onCategorySubmit)} className="space-y-4">
                            <FormField
                                control={categoryForm.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tên danh mục <span className="text-red-500">*</span></FormLabel>
                                        <FormControl>
                                            <Input placeholder="VD: Kháng sinh" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={categoryForm.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Mô tả <span className="text-red-500">*</span></FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Mô tả về nhóm thuốc này..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <DialogFooter className="pt-4">
                                <Button type="button" variant="outline" onClick={() => setIsCategoryModalOpen(false)}>
                                    Hủy
                                </Button>
                                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                                    {editingCategory ? "Cập nhật" : "Thêm mới"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog></>
    )
}

export default CategoryDialog