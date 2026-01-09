"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import {
  useCreatePrescription,
  useUpdatePrescription,
  useMedicalExam,
  usePrescriptionByExam,
} from "@/hooks/queries/useMedicalExam";
import { PrescriptionForm } from "@/app/admin/exams/_components/prescription-form";
import { useAuth } from "@/contexts/AuthContext";
import { useMyEmployeeProfile } from "@/hooks/queries/useHr";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PrescriptionFormValues } from "@/lib/schemas/medical-exam";
import { toast } from "sonner";
import Link from "next/link";

export default function CreateOrEditDoctorPrescriptionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const { data: medicalExam, isLoading } = useMedicalExam(id);
  
  // Fetch full prescription data with items using dedicated hook
  const { data: existingPrescription, isLoading: isLoadingPrescription } = usePrescriptionByExam(id);
  
  const { mutateAsync: createPrescription, isPending: isCreating } =
    useCreatePrescription(id);
  const { mutateAsync: updatePrescription, isPending: isUpdating } =
    useUpdatePrescription();
  
  // Get current doctor's employee profile for proper isCreator check
  const { data: myProfile, isLoading: isLoadingProfile } = useMyEmployeeProfile();
  const myEmployeeId = myProfile?.id || user?.employeeId;

  // Determine if we're editing an existing prescription
  const isEditing = !!existingPrescription;

  const onSubmit = async (data: PrescriptionFormValues) => {
    try {
      if (isEditing) {
        // Update existing prescription
        await updatePrescription({ examId: id, data });
        toast.success("Đã cập nhật đơn thuốc thành công!");
      } else {
        // Create new prescription
        await createPrescription(data);
        toast.success("Đã kê đơn thuốc thành công!");
      }
      router.push(`/doctor/exams/${id}`);
    } catch (error) {
      // The hook's onError will handle the toast
    }
  };

  if (isLoading || isLoadingProfile || isLoadingPrescription) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full rounded-2xl" />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-64 w-full rounded-xl" />
            <Skeleton className="h-32 w-full rounded-xl" />
          </div>
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (!medicalExam) {
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
            <h2 className="text-xl font-bold mb-2">Không tìm thấy phiếu khám</h2>
            <p className="text-white/80 mb-6">
              Phiếu khám bạn tìm không tồn tại hoặc đã bị xóa.
            </p>
            <Button
              variant="outline"
              className="bg-white/10 border-white/30 text-white hover:bg-white/20"
              asChild
            >
              <Link href="/doctor/exams">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại danh sách
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Check if doctor is the creator using fetched employeeId
  if (medicalExam.doctor?.id !== myEmployeeId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] py-12">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 p-8 text-white text-center max-w-md">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-white rounded-full" />
          </div>
          <div className="relative z-10">
            <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-bold mb-2">Không có quyền truy cập</h2>
            <p className="text-white/80 mb-6">
              Chỉ bác sĩ tạo phiếu khám mới có thể kê đơn thuốc.
            </p>
            <Button
              variant="outline"
              className="bg-white/10 border-white/30 text-white hover:bg-white/20"
              asChild
            >
              <Link href="/doctor/exams">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại danh sách
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Check if prescription is not ACTIVE (cannot edit DISPENSED or CANCELLED)
  if (isEditing && existingPrescription.status !== "ACTIVE") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] py-12">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-500 to-slate-600 p-8 text-white text-center max-w-md">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-white rounded-full" />
          </div>
          <div className="relative z-10">
            <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-bold mb-2">Không thể chỉnh sửa</h2>
            <p className="text-white/80 mb-6">
              Đơn thuốc đã được {existingPrescription.status === "DISPENSED" ? "phát" : "hủy"},
              không thể chỉnh sửa.
            </p>
            <Button
              variant="outline"
              className="bg-white/10 border-white/30 text-white hover:bg-white/20"
              asChild
            >
              <Link href={`/doctor/exams/${id}/prescription/view`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Xem đơn thuốc
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Prepare default values from existing prescription
  // Use usePrescriptionByExam data which has full items with medicine info
  const defaultValues = isEditing && existingPrescription?.items
    ? {
        items: existingPrescription.items.map((item: any) => ({
          medicineId: String(item.medicine?.id || item.medicineId || ""),
          quantity: item.quantity || 1,
          dosage: item.dosage || "",
          durationDays: item.durationDays || undefined,
          instructions: item.instructions || "",
        })),
        notes: existingPrescription.notes || "",
      }
    : undefined;

  // Debug: log prescription data
  console.log("Existing prescription:", existingPrescription);
  console.log("Default values:", defaultValues);

  return (
    <PrescriptionForm 
      onSubmit={onSubmit} 
      isSubmitting={isCreating || isUpdating}
      defaultValues={defaultValues}
      examId={id}
      patientName={medicalExam.patient?.fullName}
      backHref={isEditing ? `/doctor/exams/${id}/prescription/view` : `/doctor/exams/${id}`}
    />
  );
}
