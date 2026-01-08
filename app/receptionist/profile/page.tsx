"use client";

import { useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMyEmployeeProfile } from "@/hooks/queries/useHr";
import { hrService } from "@/services/hr.service";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  User,
  Briefcase,
  Phone,
  MapPin,
  Building2,
  Award,
  AlertCircle,
  Calendar,
  Sparkles,
  CheckCircle,
  Info,
  Camera,
  Trash2,
  Loader2,
  Clock,
  UserCheck,
  ClipboardList,
  CreditCard,
  CalendarCheck,
} from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { cn } from "@/lib/utils";

export default function ReceptionistProfilePage() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: employee, isLoading, error } = useMyEmployeeProfile();

  // Upload profile image mutation
  const uploadImageMutation = useMutation({
    mutationFn: (file: File) => hrService.uploadEmployeeProfileImage(employee!.id, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-employee-profile"] });
      toast.success("Đã cập nhật ảnh đại diện");
    },
    onError: (error: Error) => {
      toast.error(`Lỗi upload ảnh: ${error.message}`);
    },
  });

  // Delete profile image mutation
  const deleteImageMutation = useMutation({
    mutationFn: () => hrService.deleteEmployeeProfileImage(employee!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-employee-profile"] });
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

  const formatDate = (date: string | null | undefined) => {
    if (!date) return "Chưa cập nhật";
    try {
      return format(new Date(date), "dd/MM/yyyy", { locale: vi });
    } catch {
      return date;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-64 w-full rounded-2xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !employee) {
    return (
      <Card className="border-2 border-amber-200 bg-amber-50">
        <CardContent className="flex items-center gap-3 pt-6">
          <AlertCircle className="h-5 w-5 text-amber-600" />
          <div>
            <p className="font-medium text-amber-800">Không tìm thấy hồ sơ</p>
            <p className="text-sm text-amber-700">
              Tài khoản của bạn chưa được liên kết với hồ sơ nhân viên. Vui lòng liên hệ quản trị viên.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusBadge = (status: string) => {
    const config: Record<string, { label: string; color: string }> = {
      ACTIVE: { label: "Đang làm việc", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
      ON_LEAVE: { label: "Nghỉ phép", color: "bg-amber-100 text-amber-700 border-amber-200" },
      RESIGNED: { label: "Đã nghỉ việc", color: "bg-slate-100 text-slate-700 border-slate-200" },
    };
    const c = config[status] || { label: status, color: "bg-slate-100 text-slate-600" };
    return <Badge variant="outline" className={c.color}>{c.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Gradient Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-sky-600 via-blue-500 to-indigo-500 p-6 text-white shadow-xl">
        {/* Background decorations */}
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
        <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/5" />
        <div className="absolute top-1/2 right-1/4 h-20 w-20 rounded-full bg-white/5" />

        <div className="relative">
          <div className="flex flex-wrap items-start justify-between gap-6">
            {/* Profile Info */}
            <div className="flex items-center gap-5">
              {/* Avatar with upload overlay */}
              <div className="relative group">
                <Avatar className="h-24 w-24 ring-4 ring-white/30 shadow-xl ring-offset-2 ring-offset-blue-500">
                  <AvatarImage src={employee.profileImageUrl || undefined} alt={employee.fullName} />
                  <AvatarFallback className="text-3xl font-bold text-white bg-gradient-to-br from-sky-400 to-blue-500">
                    {employee.fullName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {/* Upload overlay */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  disabled={uploadImageMutation.isPending}
                >
                  {uploadImageMutation.isPending ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    <Camera className="h-6 w-6" />
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
                  {employee.fullName}
                  <Badge className="bg-white/20 text-white border-0">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Lễ tân
                  </Badge>
                </h1>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-blue-100">
                  <span className="flex items-center gap-1.5">
                    <Phone className="h-4 w-4" />
                    {employee.phoneNumber || "Chưa có SĐT"}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Building2 className="h-4 w-4" />
                    {employee.departmentName || "Chưa phân khoa"}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  {getStatusBadge(employee.status)}
                </div>
              </div>
            </div>

            {/* Actions */}
            {employee.profileImageUrl && (
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
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/20">
            <div className="text-center">
              <div className="text-2xl font-bold">{employee.departmentName || "—"}</div>
              <div className="text-sm text-blue-200">Khoa</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{employee.licenseNumber || "—"}</div>
              <div className="text-sm text-blue-200">Mã nhân viên</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{formatDate(employee.hiredAt)}</div>
              <div className="text-sm text-blue-200">Ngày vào làm</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{employee.status === "ACTIVE" ? "Có" : "Không"}</div>
              <div className="text-sm text-blue-200">Đang hoạt động</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card className="border-2 border-slate-200 shadow-sm overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-sky-500 to-blue-500" />
            <CardContent className="pt-5">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2 mb-4">
                <User className="h-5 w-5 text-blue-600" />
                Thông tin cá nhân
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <InfoRow icon={User} label="Họ và tên" value={employee.fullName} />
                <InfoRow icon={Phone} label="Số điện thoại" value={employee.phoneNumber} />
                <InfoRow icon={MapPin} label="Địa chỉ" value={employee.address} className="md:col-span-2" />
              </div>
            </CardContent>
          </Card>

          {/* Professional Information */}
          <Card className="border-2 border-slate-200 shadow-sm overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-indigo-500 to-violet-500" />
            <CardContent className="pt-5">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2 mb-4">
                <Briefcase className="h-5 w-5 text-indigo-600" />
                Thông tin công việc
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <InfoRow icon={Building2} label="Khoa/Phòng" value={employee.departmentName} />
                <InfoRow icon={Briefcase} label="Vai trò" value="Lễ tân" />
                <InfoRow icon={Award} label="Mã nhân viên" value={employee.licenseNumber} />
                <InfoRow icon={UserCheck} label="Chuyên môn" value={employee.specialization} />
                <InfoRow icon={Calendar} label="Ngày vào làm" value={formatDate(employee.hiredAt)} />
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <Clock className="h-4 w-4 text-slate-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-slate-500">Trạng thái</p>
                    {getStatusBadge(employee.status)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
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
                  <h3 className="font-semibold text-slate-800 mb-2">Thông tin</h3>
                  <p className="text-sm text-slate-600">
                    Đây là hồ sơ cá nhân của bạn trong hệ thống. Di chuột vào ảnh để thay đổi ảnh đại diện.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features Card */}
          <Card className="border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-white shadow-sm">
            <CardContent className="pt-5">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-emerald-100">
                  <ClipboardList className="h-4 w-4 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 mb-2">Công việc</h3>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      Tiếp nhận bệnh nhân
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      Quản lý lịch hẹn
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      Xử lý thanh toán
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      Hỗ trợ bệnh nhân
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Links Card */}
          <Card className="border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-white shadow-sm">
            <CardContent className="pt-5">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-amber-100">
                  <CalendarCheck className="h-4 w-4 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 mb-2">Truy cập nhanh</h3>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-amber-500" />
                      <a href="/admin/billing" className="hover:underline">Hóa đơn</a>
                    </li>
                    <li className="flex items-center gap-2">
                      <CalendarCheck className="h-4 w-4 text-amber-500" />
                      <a href="/admin/appointments" className="hover:underline">Lịch hẹn</a>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Support Card */}
          <Card className="border-2 border-violet-200 bg-gradient-to-br from-violet-50 to-white shadow-sm">
            <CardContent className="pt-5">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-violet-100">
                  <AlertCircle className="h-4 w-4 text-violet-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 mb-2">Cần hỗ trợ?</h3>
                  <p className="text-sm text-slate-600">
                    Để cập nhật thông tin cá nhân khác, vui lòng liên hệ phòng nhân sự.
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

// Helper component for info rows
function InfoRow({ icon: Icon, label, value, className }: { 
  icon: React.ComponentType<{ className?: string }>; 
  label: string; 
  value: string | null | undefined; 
  className?: string 
}) {
  return (
    <div className={cn("flex items-center gap-3 p-3 bg-slate-50 rounded-lg", className)}>
      <Icon className="h-4 w-4 text-slate-400 flex-shrink-0" />
      <div className="min-w-0">
        <p className="text-xs text-slate-500">{label}</p>
        <p className="font-medium text-slate-800 truncate">{value || "Chưa cập nhật"}</p>
      </div>
    </div>
  );
}
