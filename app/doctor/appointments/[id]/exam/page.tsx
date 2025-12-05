"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  medicalExamSchema,
  MedicalExamFormValues,
} from "@/lib/schemas/medical-exam";
import { useAppointment } from "@/hooks/queries/useAppointment";
import {
  useCreateMedicalExam,
  useMedicalExamByAppointment,
} from "@/hooks/queries/useMedicalExam";

type ExamStatus = "PENDING" | "FINALIZED";

export default function DoctorAppointmentExamPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const appointmentId = params.id;

  const { data: appointment, isLoading: loadingAppointment } =
    useAppointment(appointmentId);
  const { data: existingExam } = useMedicalExamByAppointment(appointmentId);
  const createExam = useCreateMedicalExam();

  const form = useForm<MedicalExamFormValues>({
    resolver: zodResolver(medicalExamSchema) as any,
    defaultValues: {
      appointmentId,
      diagnosis: "",
      symptoms: "",
      treatment: "",
      temperature: 37,
      bloodPressureSystolic: 120,
      bloodPressureDiastolic: 80,
      heartRate: 75,
      weight: 70,
      height: 170,
      notes: "",
    },
  });

  useEffect(() => {
    if (appointment?.id) {
      form.setValue("appointmentId", appointment.id);
    }
  }, [appointment?.id, form]);

  useEffect(() => {
    if (existingExam?.id) {
      toast.info("Exam already exists, redirecting...");
      router.replace(`/admin/exams/${existingExam.id}`);
    }
  }, [existingExam?.id, router]);

  const submitWithStatus = (status: ExamStatus) =>
    form.handleSubmit(async (values) => {
      try {
        const exam = await createExam.mutateAsync({
          ...values,
          appointmentId,
          status,
        });
        const examId = (exam as any)?.id;
        toast.success(
          status === "FINALIZED" ? "Exam finalized" : "Draft saved"
        );
        if (examId) {
          router.push(`/admin/exams/${examId}`);
        }
      } catch (error: any) {
        const code = error?.response?.data?.error?.code || error?.message;
        if (code === "EXAM_ALREADY_EXISTS" || code === "EXAM_EXISTS") {
          toast.info("Exam already exists, redirecting...");
          if (existingExam?.id) {
            router.replace(`/admin/exams/${existingExam.id}`);
          }
          return;
        }
        toast.error("Could not save exam. Please try again.");
      }
    })();

  if (loadingAppointment) {
    return <p className="p-6 text-muted-foreground">Đang tải lịch hẹn...</p>;
  }

  if (!appointment) {
    return (
      <div className="page-shell py-10 space-y-3">
        <p className="text-lg font-semibold text-destructive">
          Không tìm thấy lịch hẹn
        </p>
        <Button variant="outline" onClick={() => router.push("/doctor/appointments")}>
          Quay lại
        </Button>
      </div>
    );
  }

  return (
    <div className="page-shell space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Khám bệnh</h1>
          <p className="text-muted-foreground">
            Tạo hồ sơ khám cho lịch hẹn #{appointment.id}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/doctor/appointments")}>
            Quay lại
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Thông tin lịch hẹn</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Bệnh nhân</p>
            <p className="font-medium">{appointment.patient.fullName}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Bác sĩ</p>
            <p className="font-medium">{appointment.doctor.fullName}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Thời gian</p>
            <p className="font-medium">
              {new Date(appointment.appointmentTime).toLocaleString("vi-VN")}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Loại khám</p>
            <p className="font-medium">{appointment.type}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Thông tin khám</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Appointment ID</label>
              <Input readOnly {...form.register("appointmentId")} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Nhiệt độ (°C)</label>
              <Input type="number" step="0.1" {...form.register("temperature", { valueAsNumber: true })} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Huyết áp tâm thu</label>
              <Input type="number" {...form.register("bloodPressureSystolic", { valueAsNumber: true })} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Huyết áp tâm trương</label>
              <Input type="number" {...form.register("bloodPressureDiastolic", { valueAsNumber: true })} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Nhịp tim (bpm)</label>
              <Input type="number" {...form.register("heartRate", { valueAsNumber: true })} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Cân nặng (kg)</label>
              <Input type="number" step="0.1" {...form.register("weight", { valueAsNumber: true })} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Chiều cao (cm)</label>
              <Input type="number" {...form.register("height", { valueAsNumber: true })} />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Triệu chứng</label>
              <Textarea
                className="min-h-[100px]"
                placeholder="Mô tả triệu chứng..."
                {...form.register("symptoms")}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Chẩn đoán</label>
              <Textarea
                className="min-h-[100px]"
                placeholder="Nhập chẩn đoán..."
                {...form.register("diagnosis")}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phác đồ điều trị</label>
              <Textarea
                className="min-h-[100px]"
                placeholder="Kế hoạch điều trị..."
                {...form.register("treatment")}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Ghi chú</label>
              <Textarea
                className="min-h-[80px]"
                placeholder="Ghi chú thêm..."
                {...form.register("notes")}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={createExam.isPending}
              onClick={() => submitWithStatus("PENDING")}
            >
              Lưu nháp
            </Button>
            <Button
              type="button"
              disabled={createExam.isPending}
              onClick={() => submitWithStatus("FINALIZED")}
            >
              {createExam.isPending ? "Đang lưu..." : "Lưu & Hoàn tất"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
