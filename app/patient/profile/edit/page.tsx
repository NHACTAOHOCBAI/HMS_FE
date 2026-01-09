"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TagInput } from "@/components/ui/tag-input";
import { useMyProfile, useUpdateMyProfile } from "@/hooks/queries/usePatient";
import { uploadMyProfileImage, deleteMyProfileImage } from "@/services/patient.service";
import { RelationshipType } from "@/interfaces/patient";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import {
  User,
  Heart,
  Phone,
  Lock,
  ArrowLeft,
  Save,
  AlertCircle,
  MapPin,
  Users,
  AlertTriangle,
  Sparkles,
  CheckCircle,
  Info,
  Camera,
  Trash2,
  Loader2,
  Edit,
  Mail,
  Calendar,
  Shield,
  CreditCard,
} from "lucide-react";
import { cn } from "@/lib/utils";

const editSchema = z.object({
  phoneNumber: z
    .string()
    .regex(/^0[0-9]{9}$/, "Số điện thoại phải có 10 chữ số và bắt đầu bằng 0"),
  address: z.string().max(255, "Tối đa 255 ký tự").optional().or(z.literal("")),
  allergies: z.array(z.string()).optional(),
  relativeFullName: z
    .string()
    .max(100, "Tối đa 100 ký tự")
    .optional()
    .or(z.literal("")),
  relativePhoneNumber: z
    .string()
    .regex(/^0[0-9]{9}$/, "Số điện thoại phải có 10 chữ số và bắt đầu bằng 0")
    .optional()
    .or(z.literal("")),
  relativeRelationship: z
    .enum(["SPOUSE", "PARENT", "CHILD", "SIBLING", "FRIEND", "OTHER"] as const)
    .optional()
    .or(z.literal("")),
});

type EditFormValues = z.infer<typeof editSchema>;

const relationships: { value: RelationshipType; label: string }[] = [
  { value: "SPOUSE", label: "Vợ/Chồng" },
  { value: "PARENT", label: "Cha/Mẹ" },
  { value: "CHILD", label: "Con" },
  { value: "SIBLING", label: "Anh/Chị/Em" },
  { value: "FRIEND", label: "Bạn bè" },
  { value: "OTHER", label: "Khác" },
];

export default function PatientEditProfilePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: profile, isLoading, error } = useMyProfile();
  const updateProfile = useUpdateMyProfile();

  // Upload profile image mutation
  const uploadImageMutation = useMutation({
    mutationFn: uploadMyProfileImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-profile"] });
      toast.success("Đã cập nhật ảnh đại diện");
    },
    onError: (error: Error) => {
      toast.error(`Lỗi upload ảnh: ${error.message}`);
    },
  });

  // Delete profile image mutation
  const deleteImageMutation = useMutation({
    mutationFn: deleteMyProfileImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-profile"] });
      toast.success("Đã xóa ảnh đại diện");
    },
    onError: (error: Error) => {
      toast.error(`Lỗi xóa ảnh: ${error.message}`);
    },
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Kích thước file tối đa 2MB");
        return;
      }
      if (!file.type.match(/^image\/(jpeg|png|webp)$/)) {
        toast.error("Chỉ chấp nhận file JPEG, PNG hoặc WebP");
        return;
      }
      uploadImageMutation.mutate(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDeleteImage = () => {
    if (confirm("Bạn có chắc muốn xóa ảnh đại diện?")) {
      deleteImageMutation.mutate();
    }
  };

  const form = useForm<EditFormValues>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      phoneNumber: "",
      address: "",
      allergies: [],
      relativeFullName: "",
      relativePhoneNumber: "",
      relativeRelationship: "" as RelationshipType | "",
    },
  });

  useEffect(() => {
    if (!profile) return;
    form.reset({
      phoneNumber: profile.phoneNumber || "",
      address: profile.address || "",
      allergies: profile.allergies
        ? profile.allergies
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
      relativeFullName: profile.relativeFullName || "",
      relativePhoneNumber: profile.relativePhoneNumber || "",
      relativeRelationship:
        (profile.relativeRelationship as RelationshipType | "") || "",
    });
  }, [profile, form]);

  const onSubmit = async (values: EditFormValues) => {
    const allergiesString =
      values.allergies && values.allergies.length > 0
        ? values.allergies.join(", ")
        : undefined;
    await updateProfile.mutateAsync({
      phoneNumber: values.phoneNumber,
      address: values.address || undefined,
      allergies: allergiesString,
      relativeFullName: values.relativeFullName || undefined,
      relativePhoneNumber: values.relativePhoneNumber || undefined,
      relativeRelationship: values.relativeRelationship || undefined,
    });
    router.push("/patient/profile");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" variant="muted" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="py-10 space-y-3 text-center">
        <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
        <p className="text-lg font-semibold text-destructive">
          Không tải được hồ sơ
        </p>
        <Button variant="outline" asChild>
          <Link href="/patient/profile">Quay lại</Link>
        </Button>
      </div>
    );
  }

  const isMale = profile.gender?.toUpperCase() !== "FEMALE";

  return (
    <div className="space-y-6">
      {/* Enhanced Gradient Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-sky-600 via-cyan-500 to-teal-500 p-6 text-white shadow-xl">
        {/* Background decorations */}
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
        <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/5" />
        <div className="absolute top-1/2 right-1/4 h-20 w-20 rounded-full bg-white/5" />

        <div className="relative">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Profile Info */}
            <div className="flex items-center gap-5">
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="text-white hover:bg-white/10 rounded-xl"
              >
                <Link href="/patient/profile">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>

              {/* Avatar with upload overlay */}
              <div className="relative group">
                <Avatar className={cn(
                  "h-20 w-20 ring-4 ring-white/30 shadow-xl",
                  isMale ? "ring-offset-2 ring-offset-cyan-500" : "ring-offset-2 ring-offset-pink-500"
                )}>
                  <AvatarImage src={profile.profileImageUrl || undefined} alt={profile.fullName} />
                  <AvatarFallback className={cn(
                    "text-2xl font-bold text-white",
                    isMale 
                      ? "bg-gradient-to-br from-sky-400 to-cyan-500" 
                      : "bg-gradient-to-br from-pink-400 to-rose-500"
                  )}>
                    {profile.fullName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {/* Upload overlay */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  disabled={uploadImageMutation.isPending}
                >
                  {uploadImageMutation.isPending ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Camera className="h-5 w-5" />
                  )}
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                />
              </div>

              <div>
                <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                  Chỉnh sửa hồ sơ
                  <Badge className="bg-white/20 text-white border-0">
                    <Edit className="h-3 w-3 mr-1" />
                    Đang chỉnh sửa
                  </Badge>
                </h1>
                <p className="mt-1 text-cyan-100">
                  Cập nhật thông tin cá nhân của {profile.fullName}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {profile.profileImageUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDeleteImage}
                  disabled={deleteImageMutation.isPending}
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                >
                  {deleteImageMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                asChild
                className="bg-white/10 border-white/30 text-white hover:bg-white/20"
              >
                <Link href="/patient/profile">Hủy</Link>
              </Button>
              <Button
                onClick={form.handleSubmit(onSubmit)}
                disabled={updateProfile.isPending}
                size="sm"
                className="bg-white text-cyan-700 hover:bg-white/90"
              >
                {updateProfile.isPending ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Lưu thay đổi
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Readonly Notice */}
          <Card className="border-2 border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50">
            <CardContent className="py-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-amber-100">
                  <Lock className="h-4 w-4 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-amber-800">Lưu ý</h3>
                  <p className="text-sm text-amber-700">
                    Một số thông tin như họ tên, ngày sinh, giới tính, nhóm máu chỉ có thể được cập nhật bởi nhân viên y tế.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Readonly Personal Information */}
              <Card className="border-2 border-slate-200 shadow-sm overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-slate-400 to-slate-500" />
                <CardContent className="pt-5">
                  <h3 className="font-semibold text-slate-800 flex items-center gap-2 mb-4">
                    <Lock className="h-5 w-5 text-slate-400" />
                    Thông tin cá nhân (Chỉ xem)
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <ReadonlyField icon={User} label="Họ và tên" value={profile.fullName} />
                    <ReadonlyField icon={Mail} label="Email" value={profile.email} />
                    <ReadonlyField icon={Calendar} label="Ngày sinh" value={profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString("vi-VN") : null} />
                    <ReadonlyField icon={User} label="Giới tính" value={profile.gender === "MALE" ? "Nam" : profile.gender === "FEMALE" ? "Nữ" : profile.gender} />
                    <ReadonlyField icon={Heart} label="Nhóm máu" value={profile.bloodType} />
                    <ReadonlyField icon={CreditCard} label="CCCD/CMND" value={profile.identificationNumber} />
                  </div>
                </CardContent>
              </Card>

              {/* Editable Contact Information */}
              <Card className="border-2 border-slate-200 shadow-sm overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-sky-500 to-cyan-500" />
                <CardContent className="pt-5">
                  <h3 className="font-semibold text-slate-800 flex items-center gap-2 mb-4">
                    <User className="h-5 w-5 text-sky-600" />
                    Thông tin liên hệ
                    <Badge variant="secondary" className="ml-2">Có thể chỉnh sửa</Badge>
                  </h3>
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-slate-400" />
                            Số điện thoại <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Nhập số điện thoại (VD: 0901234567)" className="border-2" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-slate-400" />
                            Địa chỉ
                          </FormLabel>
                          <FormControl>
                            <Textarea placeholder="Nhập địa chỉ đầy đủ" rows={3} className="border-2" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Health Information */}
              <Card className="border-2 border-slate-200 shadow-sm overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-rose-500 to-pink-500" />
                <CardContent className="pt-5">
                  <h3 className="font-semibold text-slate-800 flex items-center gap-2 mb-4">
                    <Heart className="h-5 w-5 text-rose-600" />
                    Thông tin sức khỏe
                    <Badge variant="secondary" className="ml-2">Có thể chỉnh sửa</Badge>
                  </h3>
                  <FormField
                    control={form.control}
                    name="allergies"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-amber-500" />
                          Dị ứng
                        </FormLabel>
                        <FormControl>
                          <TagInput
                            value={field.value || []}
                            onChange={field.onChange}
                            placeholder="Thêm dị ứng và nhấn Enter"
                            suggestions={[
                              "Penicillin",
                              "Peanut",
                              "Seafood",
                              "Dust",
                              "NSAIDs",
                              "Aspirin",
                              "Sulfa",
                            ]}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Emergency Contact */}
              <Card className="border-2 border-slate-200 shadow-sm overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
                <CardContent className="pt-5">
                  <h3 className="font-semibold text-slate-800 flex items-center gap-2 mb-4">
                    <Users className="h-5 w-5 text-emerald-600" />
                    Liên hệ khẩn cấp
                    <Badge variant="secondary" className="ml-2">Có thể chỉnh sửa</Badge>
                  </h3>
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="relativeFullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <User className="h-4 w-4 text-slate-400" />
                            Tên người liên hệ
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Nhập tên người liên hệ" className="border-2" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="relativeRelationship"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Heart className="h-4 w-4 text-slate-400" />
                              Mối quan hệ
                            </FormLabel>
                            <Select
                              onValueChange={(v) => field.onChange(v === "NONE" ? "" : v)}
                              value={field.value || "NONE"}
                            >
                              <FormControl>
                                <SelectTrigger className="border-2">
                                  <SelectValue placeholder="Chọn mối quan hệ" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="NONE">Chưa chọn</SelectItem>
                                {relationships.map((r) => (
                                  <SelectItem key={r.value} value={r.value}>
                                    {r.label}
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
                        name="relativePhoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-slate-400" />
                              Số điện thoại
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="Nhập số điện thoại" className="border-2" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Mobile Action buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 lg:hidden">
                <Button type="button" variant="outline" asChild>
                  <Link href="/patient/profile">Hủy</Link>
                </Button>
                <Button
                  type="submit"
                  disabled={updateProfile.isPending}
                  className="bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600"
                >
                  {updateProfile.isPending ? (
                    <>
                      <Spinner size="sm" className="mr-2" />
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Lưu thay đổi
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Info Card */}
          <Card className="border-2 border-sky-200 bg-gradient-to-br from-sky-50 to-white shadow-sm">
            <CardContent className="pt-5">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-sky-100">
                  <Info className="h-4 w-4 text-sky-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 mb-2">Hướng dẫn</h3>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                      Di chuột vào ảnh để thay đổi
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                      Điền đầy đủ thông tin liên hệ
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                      Nhấn Enter để thêm dị ứng
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                      Nhấn "Lưu thay đổi" để hoàn tất
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Editable Fields Card */}
          <Card className="border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-white shadow-sm">
            <CardContent className="pt-5">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-emerald-100">
                  <Edit className="h-4 w-4 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 mb-2">Có thể chỉnh sửa</h3>
                  <ul className="space-y-1 text-sm text-slate-600">
                    <li>• Ảnh đại diện</li>
                    <li>• Số điện thoại</li>
                    <li>• Địa chỉ</li>
                    <li>• Danh sách dị ứng</li>
                    <li>• Thông tin liên hệ khẩn cấp</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Support Card */}
          <Card className="border-2 border-violet-200 bg-gradient-to-br from-violet-50 to-white shadow-sm">
            <CardContent className="pt-5">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-violet-100">
                  <Shield className="h-4 w-4 text-violet-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 mb-2">Cần hỗ trợ?</h3>
                  <p className="text-sm text-slate-600">
                    Để cập nhật họ tên, ngày sinh, giới tính hoặc nhóm máu, vui lòng liên hệ quầy tiếp nhận.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Helper component for readonly fields
function ReadonlyField({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string | null }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
      <Icon className="h-4 w-4 text-slate-400 flex-shrink-0" />
      <div className="min-w-0">
        <p className="text-xs text-slate-500">{label}</p>
        <p className="font-medium text-slate-800 truncate">{value || "—"}</p>
      </div>
    </div>
  );
}
