"use client";

import { usePrescriptionByExam, useMedicalExam } from "@/hooks/queries/useMedicalExam";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PrescriptionDetailView } from "@/app/admin/exams/_components/PrescriptionDetailView";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { useMyEmployeeProfile } from "@/hooks/queries/useHr";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, AlertCircle, FileX } from "lucide-react";
import Link from "next/link";

export default function DoctorPrescriptionViewPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const examId = params.id as string;

  const {
    data: prescription,
    isLoading,
    isError,
    error,
  } = usePrescriptionByExam(examId);

  const { data: exam } = useMedicalExam(examId);

  // Get current doctor's employee profile for proper isCreator check
  const { data: myProfile, isLoading: isLoadingProfile } = useMyEmployeeProfile();
  const myEmployeeId = myProfile?.id || user?.employeeId;

  // Doctor can edit if they created the exam and prescription is ACTIVE
  const canEdit =
    user?.role === "DOCTOR" &&
    exam?.doctor?.id === myEmployeeId &&
    prescription?.status === "ACTIVE";

  if (isLoading || isLoadingProfile) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full rounded-2xl" />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-64 w-full rounded-xl" />
            <Skeleton className="h-32 w-full rounded-xl" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-32 w-full rounded-xl" />
            <Skeleton className="h-32 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] py-12">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-rose-500 to-red-500 p-8 text-white text-center max-w-md">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-white rounded-full" />
          </div>
          <div className="relative z-10">
            <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-bold mb-2">Không thể tải đơn thuốc</h2>
            <p className="text-white/80 mb-6">
              {(error as any)?.response?.status === 404
                ? "Không tìm thấy đơn thuốc cho phiếu khám này."
                : (error as any)?.message || "Đã có lỗi xảy ra."}
            </p>
            <Button
              variant="outline"
              className="bg-white/10 border-white/30 text-white hover:bg-white/20"
              asChild
            >
              <Link href={`/doctor/exams/${examId}`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại phiếu khám
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!prescription) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] py-12">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 p-8 text-white text-center max-w-md">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-white rounded-full" />
          </div>
          <div className="relative z-10">
            <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
              <FileX className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-bold mb-2">Chưa có đơn thuốc</h2>
            <p className="text-white/80 mb-6">
              Phiếu khám này chưa được kê đơn thuốc.
            </p>
            <Button
              variant="outline"
              className="bg-white/10 border-white/30 text-white hover:bg-white/20"
              asChild
            >
              <Link href={`/doctor/exams/${examId}`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại phiếu khám
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <PrescriptionDetailView
      prescription={prescription}
      userRole={user?.role as UserRole | undefined}
      examId={examId}
      canEdit={canEdit}
      examBaseHref="/doctor/exams"
    />
  );
}

