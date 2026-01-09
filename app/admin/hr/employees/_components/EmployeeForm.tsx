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
import { Employee, EmployeeRequest, Department } from "@/interfaces/hr";
import { useDepartments } from "@/hooks/queries/useHr";
import { useRouter } from "next/navigation";
import {
  User,
  Briefcase,
  Link2,
  Building2,
  Phone,
  MapPin,
  Stethoscope,
  Award,
  Calendar,
  Loader2,
  IdCard,
} from "lucide-react";
import { AccountSearchSelect } from "@/components/ui/account-search-select";

const formSchema = z
  .object({
    fullName: z.string().trim().min(1, "Họ tên là bắt buộc"),
    role: z.enum(["DOCTOR", "NURSE", "RECEPTIONIST", "ADMIN"]),
    departmentId: z.string().min(1, "Khoa là bắt buộc"),
    specialization: z.string().optional(),
    licenseNumber: z.string().optional(),
    phoneNumber: z.string().optional(),
    address: z.string().optional(),
    status: z.enum(["ACTIVE", "ON_LEAVE", "RESIGNED"]),
    hiredAt: z.string().optional(),
    accountId: z.string().optional(),
  })
  .superRefine((values, ctx) => {
    if (
      (values.role === "DOCTOR" || values.role === "NURSE") &&
      !values.licenseNumber
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["licenseNumber"],
        message: "Số giấy phép bắt buộc cho bác sĩ/y tá",
      });
    }
    if (values.licenseNumber) {
      const licenseOk = /^[A-Z]{2}-[0-9]{5}$/.test(values.licenseNumber);
      if (!licenseOk) {
        ctx.addIssue({
          code: "custom",
          path: ["licenseNumber"],
          message: "Số giấy phép phải có định dạng XX-12345 (ví dụ: AB-12345)",
        });
      }
    }
    if (values.phoneNumber) {
      const phoneOk = /^\d{10,15}$/.test(values.phoneNumber);
      if (!phoneOk) {
        ctx.addIssue({
          code: "custom",
          path: ["phoneNumber"],
          message: "Số điện thoại phải có 10-15 chữ số",
        });
      }
    }
  });

type EmployeeFormValues = z.infer<typeof formSchema>;

interface EmployeeFormProps {
  initialData?: Employee;
  onSubmit: (data: EmployeeRequest) => void;
  isLoading: boolean;
}

export default function EmployeeForm({
  initialData,
  onSubmit,
  isLoading,
}: EmployeeFormProps) {
  const router = useRouter();
  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: initialData?.fullName || "",
      role: initialData?.role || "DOCTOR",
      departmentId: initialData?.departmentId || "",
      specialization: initialData?.specialization || "",
      licenseNumber: initialData?.licenseNumber || "",
      phoneNumber: initialData?.phoneNumber || "",
      address: initialData?.address || "",
      status: initialData?.status || "ACTIVE",
      hiredAt: initialData?.hiredAt ? initialData.hiredAt.split("T")[0] : "",
      accountId: initialData?.accountId || "",
    },
  });

  const { data: departmentsData } = useDepartments({ size: 100 });
  const departments = departmentsData?.content ?? [];

  const handleSubmit = (values: EmployeeFormValues) => {
    const submitData: EmployeeRequest = {
      fullName: values.fullName,
      role: values.role,
      departmentId: values.departmentId,
      status: values.status,
      specialization: values.specialization || undefined,
      licenseNumber: values.licenseNumber || undefined,
      phoneNumber: values.phoneNumber || undefined,
      address: values.address || undefined,
      accountId:
        values.accountId === "none" || !values.accountId
          ? undefined
          : values.accountId,
      hiredAt: values.hiredAt
        ? new Date(values.hiredAt).toISOString()
        : undefined,
    };
    onSubmit(submitData);
  };

  const role = form.watch("role");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Basic Information Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
            <User className="h-5 w-5 text-violet-600" />
            <h3 className="font-semibold text-slate-800">Thông tin cá nhân</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    <User className="h-4 w-4 text-violet-500" />
                    Họ và tên <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ví dụ: Nguyễn Văn A"
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
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    <Phone className="h-4 w-4 text-sky-500" />
                    Số điện thoại
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ví dụ: 0901234567"
                      className="h-11 border-2"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    10-15 chữ số
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-slate-500" />
                  Địa chỉ
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                    className="resize-none border-2"
                    rows={2}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Employment Details Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
            <Briefcase className="h-5 w-5 text-purple-600" />
            <h3 className="font-semibold text-slate-800">Thông tin công việc</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    <Award className="h-4 w-4 text-purple-500" />
                    Vai trò <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-11 border-2">
                        <SelectValue placeholder="Chọn vai trò" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="DOCTOR">
                        <span className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-violet-500" />
                          Bác sĩ
                        </span>
                      </SelectItem>
                      <SelectItem value="NURSE">
                        <span className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-sky-500" />
                          Y tá
                        </span>
                      </SelectItem>
                      <SelectItem value="RECEPTIONIST">
                        <span className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-amber-500" />
                          Lễ tân
                        </span>
                      </SelectItem>
                      <SelectItem value="ADMIN">
                        <span className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-slate-500" />
                          Quản trị viên
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="departmentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    <Building2 className="h-4 w-4 text-teal-500" />
                    Khoa <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-11 border-2">
                        <SelectValue placeholder="Chọn khoa" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {departments.map((dept: Department) => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="specialization"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    <Stethoscope className="h-4 w-4 text-indigo-500" />
                    Chuyên môn
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ví dụ: Tim mạch, Nội khoa..."
                      className="h-11 border-2"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {(role === "DOCTOR" || role === "NURSE") && (
              <FormField
                control={form.control}
                name="licenseNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      <IdCard className="h-4 w-4 text-rose-500" />
                      Số giấy phép <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ví dụ: AB-12345"
                        className="h-11 border-2"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Định dạng: XX-12345 (2 chữ cái + 5 số)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

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
                          Đang làm việc
                        </span>
                      </SelectItem>
                      <SelectItem value="ON_LEAVE">
                        <span className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-amber-500" />
                          Nghỉ phép
                        </span>
                      </SelectItem>
                      <SelectItem value="RESIGNED">
                        <span className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-slate-400" />
                          Đã nghỉ việc
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hiredAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    Ngày vào làm
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      className="h-11 border-2"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Account Linking Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
            <Link2 className="h-5 w-5 text-emerald-600" />
            <h3 className="font-semibold text-slate-800">Liên kết tài khoản (Tùy chọn)</h3>
          </div>

          <p className="text-sm text-muted-foreground">
            Liên kết nhân viên này với tài khoản đăng nhập (không bao gồm tài khoản Bệnh nhân và Admin)
          </p>

          <FormField
            control={form.control}
            name="accountId"
            render={({ field }) => (
              <FormItem className="max-w-md">
                <FormLabel className="flex items-center gap-1">
                  <Link2 className="h-4 w-4 text-emerald-500" />
                  Tài khoản liên kết
                </FormLabel>
                <FormControl>
                  <AccountSearchSelect
                    value={field.value || null}
                    onChange={field.onChange}
                    excludeRoles={["PATIENT", "ADMIN"]}
                  />
                </FormControl>
                <FormDescription className="text-xs">
                  Để trống nếu chưa có tài khoản
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {initialData?.updatedAt && (
          <p className="text-xs text-muted-foreground">
            Cập nhật lần cuối: {new Date(initialData.updatedAt).toLocaleString("vi-VN")}
          </p>
        )}

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
            className="px-6 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? "Cập nhật" : "Tạo mới"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
