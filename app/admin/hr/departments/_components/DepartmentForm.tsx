"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Department, DepartmentRequest } from "@/interfaces/hr";
import { useRouter } from "next/navigation";
import { DoctorSearchSelect } from "@/components/appointment/DoctorSearchSelect";
import { Building2, MapPin, Phone, User, FileText, CheckCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Tên khoa là bắt buộc")
    .max(255, "Tên khoa không được quá 255 ký tự"),
  description: z
    .string()
    .max(1000, "Mô tả không được quá 1000 ký tự")
    .optional()
    .or(z.literal("")),
  headDoctorId: z.string().optional(),
  location: z
    .string()
    .max(255, "Vị trí không được quá 255 ký tự")
    .optional()
    .or(z.literal("")),
  phoneExtension: z
    .string()
    .regex(/^\d*$/, "Số máy nội bộ phải là số")
    .max(20, "Số máy nội bộ không được quá 20 ký tự")
    .optional()
    .or(z.literal("")),
  status: z.enum(["ACTIVE", "INACTIVE"]),
});

type DepartmentFormValues = z.infer<typeof formSchema>;

interface DepartmentFormProps {
  initialData?: Department;
  onSubmit: (data: DepartmentRequest) => void;
  isLoading: boolean;
}

export default function DepartmentForm({
  initialData,
  onSubmit,
  isLoading,
}: DepartmentFormProps) {
  const router = useRouter();
  const form = useForm<DepartmentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      headDoctorId: initialData?.headDoctorId || "",
      location: initialData?.location || "",
      phoneExtension: initialData?.phoneExtension || "",
      status: initialData?.status || "ACTIVE",
    },
  });

  const handleSubmit = (values: DepartmentFormValues) => {
    const submitData: DepartmentRequest = {
      ...values,
      headDoctorId:
        values.headDoctorId === "none" || !values.headDoctorId
          ? undefined
          : values.headDoctorId,
    };
    onSubmit(submitData);
  };

  const watchedStatus = form.watch("status");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Basic Info Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
            <Building2 className="h-5 w-5 text-teal-600" />
            <h3 className="font-semibold text-slate-800">Thông tin cơ bản</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    <Building2 className="h-4 w-4 text-teal-500" />
                    Tên khoa <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ví dụ: Khoa Tim mạch"
                      className="h-11 border-2"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trạng thái</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-11 border-2">
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ACTIVE">
                        <span className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-emerald-500" />
                          Đang hoạt động
                        </span>
                      </SelectItem>
                      <SelectItem value="INACTIVE">
                        <span className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-slate-400" />
                          Ngừng hoạt động
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1">
                  <FileText className="h-4 w-4 text-slate-500" />
                  Mô tả
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Mô tả về khoa phòng..."
                    className="resize-none border-2"
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Contact Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
            <MapPin className="h-5 w-5 text-sky-600" />
            <h3 className="font-semibold text-slate-800">Thông tin liên hệ</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-sky-500" />
                    Vị trí
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ví dụ: Tòa A, Tầng 2"
                      className="h-11 border-2"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Vị trí cụ thể của khoa trong bệnh viện
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneExtension"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    <Phone className="h-4 w-4 text-sky-500" />
                    Số máy nội bộ
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ví dụ: 1234"
                      className="h-11 border-2"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Chỉ nhập số
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Head Doctor Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
            <User className="h-5 w-5 text-violet-600" />
            <h3 className="font-semibold text-slate-800">Trưởng khoa</h3>
          </div>

          <FormField
            control={form.control}
            name="headDoctorId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1">
                  <User className="h-4 w-4 text-violet-500" />
                  Chọn trưởng khoa
                </FormLabel>
                <DoctorSearchSelect
                  value={field.value || ""}
                  onChange={field.onChange}
                  placeholder="Tìm kiếm bác sĩ..."
                />
                <FormDescription className="text-xs">
                  Để trống nếu chưa có trưởng khoa
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="px-6"
          >
            Hủy
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="px-6 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? "Cập nhật khoa" : "Tạo khoa"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
