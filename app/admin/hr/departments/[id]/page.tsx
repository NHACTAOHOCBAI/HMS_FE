"use client";

import { useParams, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDepartment, useEmployees } from "@/hooks/queries/useHr";
import { DepartmentStatusBadge } from "../../_components/department-status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Building2,
  ArrowLeft,
  Edit,
  MapPin,
  Phone,
  User,
  Users,
  Calendar,
  Info,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Employee } from "@/interfaces/hr";

export default function DepartmentViewPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const { data: department, isLoading, error } = useDepartment(id);
  const { data: employeesData } = useEmployees({ size: 100, departmentId: id });
  const departmentEmployees = employeesData?.content ?? [];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-40 w-full rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
        </div>
        <Skeleton className="h-48 rounded-xl" />
      </div>
    );
  }

  if (error || !department) {
    return (
      <div className="space-y-6">
        <Card className="border-2 border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <Building2 className="h-12 w-12 mx-auto mb-3 text-red-400" />
              <h2 className="text-xl font-semibold text-red-800">Không tìm thấy khoa</h2>
              <p className="text-red-600 mt-1">Khoa bạn đang tìm không tồn tại.</p>
              <Button
                className="mt-4"
                onClick={() => router.push("/admin/departments")}
              >
                Quay lại danh sách
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Gradient Header */}
      <div className={cn(
        "relative overflow-hidden rounded-2xl p-6 text-white shadow-xl",
        department.status === "ACTIVE"
          ? "bg-gradient-to-r from-teal-600 via-cyan-500 to-emerald-500"
          : "bg-gradient-to-r from-slate-600 via-slate-500 to-slate-400"
      )}>
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
        <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/5" />

        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-white/20 p-3 backdrop-blur-sm">
              <Building2 className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight">{department.name}</h1>
                <Badge className={cn(
                  "border-0 text-xs",
                  department.status === "ACTIVE"
                    ? "bg-white/20 text-white"
                    : "bg-slate-700 text-slate-200"
                )}>
                  {department.status === "ACTIVE" ? "Đang hoạt động" : "Ngừng hoạt động"}
                </Badge>
              </div>
              <p className="mt-1 text-white/80">
                {department.description || "Không có mô tả"}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              onClick={() => router.push("/admin/departments")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Button>
            <Button
              className="bg-white text-teal-700 hover:bg-white/90"
              onClick={() => router.push(`/admin/hr/departments/${id}/edit`)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Chỉnh sửa
            </Button>
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-2 border-teal-200 bg-gradient-to-br from-teal-50 to-white">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-teal-100">
                <MapPin className="h-5 w-5 text-teal-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Vị trí</p>
                <p className="font-medium text-teal-800">{department.location || "Chưa có"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-sky-200 bg-gradient-to-br from-sky-50 to-white">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-sky-100">
                <Phone className="h-5 w-5 text-sky-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Số máy nội bộ</p>
                <p className="font-medium text-sky-800">{department.phoneExtension || "N/A"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-violet-200 bg-gradient-to-br from-violet-50 to-white">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-violet-100">
                <User className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Trưởng khoa</p>
                <p className="font-medium text-violet-800">{department.headDoctorName || "Chưa có"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-white">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-100">
                <Users className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Nhân viên</p>
                <p className="font-medium text-emerald-800">{departmentEmployees.length} người</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Employees List */}
      <Card className="border-2 border-slate-200 shadow-sm overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-teal-500 to-emerald-500" />
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-teal-600" />
            Danh sách nhân viên
            <Badge variant="secondary">{departmentEmployees.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {departmentEmployees.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-3 opacity-40" />
              <p>Chưa có nhân viên nào trong khoa này</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {departmentEmployees.map((emp: Employee) => (
                <div
                  key={emp.id}
                  className="flex items-center gap-3 p-3 rounded-xl border-2 border-slate-100 hover:border-teal-200 hover:bg-teal-50/30 transition-colors cursor-pointer"
                  onClick={() => router.push(`/admin/hr/employees/${emp.id}`)}
                >
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white font-medium">
                    {emp.fullName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-800 truncate">{emp.fullName}</p>
                    <p className="text-xs text-muted-foreground">{emp.role}</p>
                  </div>
                  <Badge variant={emp.status === "ACTIVE" ? "default" : "secondary"} className="text-xs">
                    {emp.status === "ACTIVE" ? "Active" : "Inactive"}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Details Card */}
      <Card className="border-2 border-slate-200 shadow-sm overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-slate-400 to-slate-500" />
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-slate-600" />
            Thông tin chi tiết
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Mã khoa</p>
              <p className="font-mono text-sm bg-slate-100 px-2 py-1 rounded">{department.id}</p>
            </div>
            {department.headDoctorId && (
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Mã trưởng khoa</p>
                <p className="font-mono text-sm bg-slate-100 px-2 py-1 rounded">{department.headDoctorId}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
