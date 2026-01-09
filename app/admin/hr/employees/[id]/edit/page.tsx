"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import EmployeeForm from "../../_components/EmployeeForm";
import { EmployeeRequest, EmployeeRole } from "@/interfaces/hr";
import { useEmployee, useUpdateEmployee } from "@/hooks/queries/useHr";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Users, ArrowLeft, Edit, User } from "lucide-react";
import { cn } from "@/lib/utils";

// Role colors for avatar gradient
const roleGradients: Record<EmployeeRole, string> = {
  DOCTOR: "from-violet-500 to-purple-600",
  NURSE: "from-sky-500 to-blue-600",
  RECEPTIONIST: "from-amber-500 to-orange-600",
  ADMIN: "from-slate-600 to-slate-800",
};

export default function EmployeeEditPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id;

  const { data: employee, isLoading, error } = useEmployee(id);
  const updateEmployee = useUpdateEmployee();

  const handleSubmit = async (values: EmployeeRequest) => {
    updateEmployee.mutate(
      { id, ...values },
      {
        onSuccess: () => {
          toast.success("Đã cập nhật nhân viên thành công!");
          router.push("/admin/employees");
        },
        onError: () => toast.error("Không thể cập nhật. Vui lòng thử lại."),
      }
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-40 w-full rounded-2xl" />
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="space-y-6">
        <Card className="border-2 border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <Users className="h-12 w-12 mx-auto mb-3 text-red-400" />
              <h2 className="text-xl font-semibold text-red-800">Không tìm thấy nhân viên</h2>
              <p className="text-red-600 mt-1">Nhân viên bạn đang tìm không tồn tại.</p>
              <Button
                className="mt-4"
                onClick={() => router.push("/admin/employees")}
              >
                Quay lại danh sách
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const gradient = roleGradients[employee.role as EmployeeRole] || roleGradients.DOCTOR;

  return (
    <div className="space-y-6">
      {/* Gradient Header */}
      <div className={cn(
        "relative overflow-hidden rounded-2xl p-6 text-white shadow-xl bg-gradient-to-r",
        gradient
      )}>
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
        <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/5" />

        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-4 border-white/30 shadow-lg">
              <AvatarImage src={employee.profileImageUrl || undefined} alt={employee.fullName} />
              <AvatarFallback className={cn("bg-white/20 text-white text-2xl font-bold")}>
                {employee.fullName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight">{employee.fullName}</h1>
                <Badge className="bg-white/20 text-white border-0 text-xs">
                  <Edit className="h-3 w-3 mr-1" />
                  Chỉnh sửa
                </Badge>
              </div>
              <p className="mt-1 text-white/80">
                {employee.role} • {employee.departmentName || "Chưa có khoa"}
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
        </div>
      </div>

      {/* Form Card */}
      <Card className="border-2 border-slate-200 shadow-sm overflow-hidden">
        <div className={cn("h-1 bg-gradient-to-r", gradient)} />
        <CardContent className="pt-6">
          <EmployeeForm
            initialData={employee}
            onSubmit={handleSubmit}
            isLoading={updateEmployee.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
}
