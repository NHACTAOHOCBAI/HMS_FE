"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DepartmentForm from "../_components/DepartmentForm";
import { DepartmentRequest } from "@/interfaces/hr";
import { useCreateDepartment } from "@/hooks/queries/useHr";
import { toast } from "sonner";
import { Building2, ArrowLeft, Sparkles } from "lucide-react";

export default function NewDepartmentPage() {
  const router = useRouter();
  const createDepartment = useCreateDepartment();

  const handleSubmit = async (values: DepartmentRequest) => {
    createDepartment.mutate(values, {
      onSuccess: () => {
        toast.success("Đã tạo khoa mới thành công!");
        router.push("/admin/departments");
      },
      onError: (error) => {
        console.error("Failed to create department:", error);
        toast.error("Không thể tạo khoa. Vui lòng thử lại.");
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Gradient Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-teal-600 via-cyan-500 to-emerald-500 p-6 text-white shadow-xl">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
        <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/5" />

        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-white/20 p-3 backdrop-blur-sm">
              <Building2 className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                Thêm khoa mới
                <Badge className="bg-white/20 text-white border-0 text-xs">
                  <Sparkles className="h-3 w-3 mr-1" />
                  New
                </Badge>
              </h1>
              <p className="mt-1 text-teal-100">
                Tạo khoa phòng mới cho bệnh viện
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
        <div className="h-1 bg-gradient-to-r from-teal-500 to-emerald-500" />
        <CardContent className="pt-6">
          <DepartmentForm
            initialData={undefined}
            onSubmit={handleSubmit}
            isLoading={createDepartment.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
}
