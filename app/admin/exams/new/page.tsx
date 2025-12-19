"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { MedicalExamForm } from "../_components/medical-exam-form";
import { useCreateMedicalExam } from "@/hooks/queries/useMedicalExam";
import { useAppointment } from "@/hooks/queries/useAppointment";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { MedicalExamFormValues } from "@/lib/schemas/medical-exam";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FilePlus } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

export default function NewMedicalExamPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const appointmentId = searchParams.get("appointmentId");
  const { user } = useAuth();

  const createMutation = useCreateMedicalExam();
  
  // Fetch appointment details if ID is provided to pre-fill the form
  const { 
    data: appointment, 
    isLoading: isAppointmentLoading,
    error: appointmentError 
  } = useAppointment(appointmentId || "");

  const onSubmit = (data: MedicalExamFormValues, status: "PENDING" | "FINALIZED") => {
    const payload = {
        ...data,
        status
    };
    
    createMutation.mutate(
      {
        data: payload,
        patientInfo: appointment
          ? {
              id: appointment.patient.id,
              fullName: appointment.patient.fullName,
            }
          : undefined,
        doctorInfo: appointment
          ? {
              id: appointment.doctor.id,
              fullName: appointment.doctor.fullName,
            }
          : undefined,
      },
      {
        onSuccess: (newExam) => {
          console.log("✅ [NewMedicalExamPage] Exam created successfully:", newExam);
          toast.success(`Medical exam ${status.toLowerCase()} successfully`);
          // Handle both direct response and wrapped response
          const examId = newExam?.id || newExam?.data?.id;
          console.log("🔗 [NewMedicalExamPage] Redirecting to exam:", examId);
          if (examId) {
            router.push(`/admin/exams/${examId}`);
          } else {
            console.error("❌ [NewMedicalExamPage] No exam ID in response:", newExam);
            router.push("/admin/exams");
          }
        },
        onError: async (error: any) => {
          const errorCode = error.response?.data?.code;
          if (errorCode === 3301 && appointmentId) {
             toast.info("Medical examination already exists. Redirecting...");
             try {
                // Import dynamically to avoid circular dependencies if any, or just use the service
                const { getMedicalExamByAppointment } = await import("@/services/medical-exam.service");
                const existingExam = await getMedicalExamByAppointment(appointmentId);
                // Handle both wrapped (ApiResponse) and unwrapped responses
                const targetId = existingExam.data?.id || existingExam.id;
                
                if (targetId) {
                    router.push(`/admin/exams/${targetId}`);
                    return;
                }
             } catch (fetchError) {
                console.error("Failed to fetch existing exam", fetchError);
             }
          }
          toast.error(
            error.response?.data?.message || "Failed to create medical exam"
          );
        },
      }
    );
  };

  if (appointmentId && isAppointmentLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size="lg" className="text-primary" />
      </div>
    );
  }

  return (
    <RoleGuard allowedRoles={["ADMIN", "DOCTOR"]}>
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center gap-2">
            <div className="p-3 bg-violet-100 dark:bg-violet-900/30 rounded-xl">
                <FilePlus className="h-6 w-6 text-violet-600 dark:text-violet-400" />
            </div>
            <div>
                <h1 className="text-2xl font-bold tracking-tight">New Medical Examination</h1>
                <p className="text-muted-foreground">Record clinical findings, diagnosis and treatment</p>
            </div>
        </div>

        <Card>
          <CardContent className="pt-6">
            <MedicalExamForm
              appointment={appointment}
              defaultAppointmentId={appointmentId || undefined}
              onSubmitWithStatus={onSubmit}
              onSubmit={() => {}} // Not used because we use onSubmitWithStatus
              isSubmitting={createMutation.isPending}
              userRole={user?.role as UserRole}
            />
          </CardContent>
        </Card>
      </div>
    </RoleGuard>
  );
}
