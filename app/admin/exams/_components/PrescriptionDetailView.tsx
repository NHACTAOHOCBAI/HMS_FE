"use client";

import { Prescription, PrescriptionStatus } from "@/interfaces/medical-exam";
import { UserRole } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Printer,
  Pill,
  PackageCheck,
  Loader2,
  Edit,
  User,
  Stethoscope,
  Calendar,
  Clock,
  FileText,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Calculator,
  ExternalLink,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { toast } from "sonner";
import medicalExamService from "@/services/medical-exam.service";

interface PrescriptionDetailViewProps {
  prescription: Prescription;
  userRole?: UserRole;
  onDispensed?: (prescription: Prescription) => void;
  examId?: string;
  canEdit?: boolean;
  examBaseHref?: string;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};

const formatDate = (dateString?: string) => {
  if (!dateString) return "-";
  return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: vi });
};

// Avatar color generator
function getAvatarColor(name: string): string {
  const colors = [
    "from-cyan-400 to-teal-500",
    "from-blue-400 to-indigo-500",
    "from-purple-400 to-pink-500",
    "from-rose-400 to-red-500",
    "from-orange-400 to-amber-500",
    "from-emerald-400 to-green-500",
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

const statusConfig: Record<PrescriptionStatus, { label: string; icon: React.ElementType; color: string; bgColor: string }> = {
  ACTIVE: { label: "Chờ phát thuốc", icon: Clock, color: "text-white", bgColor: "bg-red-500 border-red-500" },
  DISPENSED: { label: "Đã phát thuốc", icon: CheckCircle, color: "text-white", bgColor: "bg-emerald-500 border-emerald-500" },
  CANCELLED: { label: "Đã hủy", icon: XCircle, color: "text-white", bgColor: "bg-slate-500 border-slate-500" },
};

export function PrescriptionDetailView({
  prescription: initialPrescription,
  userRole,
  onDispensed,
  examId,
  canEdit = false,
  examBaseHref = "/admin/exams",
}: PrescriptionDetailViewProps) {
  const router = useRouter();
  const [prescription, setPrescription] = useState(initialPrescription);
  const [isDispensing, setIsDispensing] = useState(false);
  
  const isStaff =
    userRole === "ADMIN" || userRole === "DOCTOR" || userRole === "NURSE";
  const canDispense = isStaff && (!prescription.status || prescription.status === "ACTIVE");

  const totalCost = prescription.items.reduce(
    (acc, item) => acc + item.quantity * item.unitPrice,
    0
  );

  const totalItems = prescription.items.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  const handleDispense = async () => {
    if (!canDispense) return;
    
    setIsDispensing(true);
    try {
      const updated = await medicalExamService.dispensePrescription(prescription.id);
      setPrescription(updated);
      toast.success("Đã phát thuốc thành công! Hóa đơn đã được tạo.");
      onDispensed?.(updated);
    } catch (error: any) {
      toast.error(error.message || "Không thể phát thuốc");
    } finally {
      setIsDispensing(false);
    }
  };

  const statusInfo = statusConfig[prescription.status || "ACTIVE"];
  const StatusIcon = statusInfo.icon;

  return (
    <div className="space-y-6">
      {/* Gradient Header */}
      <div className="relative rounded-2xl bg-gradient-to-r from-violet-600 via-purple-500 to-fuchsia-500 p-6 text-white overflow-hidden shadow-xl">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-white" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-white" />
        </div>

        <div className="relative flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="flex items-start gap-5">
            {/* Back button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="text-white/90 hover:text-white hover:bg-white/20 shrink-0 mt-1"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>

            {/* Icon */}
            <div className="h-16 w-16 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <Pill className="h-8 w-8 text-white" />
            </div>

            {/* Title & Meta */}
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight">
                  Đơn Thuốc
                </h1>
                <Badge
                  variant="outline"
                  className={`${statusInfo.color} border-current bg-white/10`}
                >
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {statusInfo.label}
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm">
                <span className="flex items-center gap-1.5 font-mono">
                  #{prescription.id.slice(0, 8)}...
                </span>
                <span className="flex items-center gap-1.5">
                  <User className="h-4 w-4" />
                  {prescription.patient.fullName}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {formatDate(prescription.prescribedAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-2 shrink-0 ml-auto lg:ml-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.print()}
              className="bg-white/10 border-2 border-white/40 text-white hover:bg-white/20 font-medium"
            >
              <Printer className="mr-2 h-4 w-4" />
              In
            </Button>
            {/* Edit button - backend supports: PUT /exams/{examId}/prescription (only for ACTIVE) */}
            {canEdit && prescription.status === "ACTIVE" && (
              <Button
                size="sm"
                asChild
                className="bg-white/10 border-2 border-white/40 text-white hover:bg-white/20 font-medium"
              >
                <Link href={`${examBaseHref}/${examId}/prescription`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Chỉnh sửa
                </Link>
              </Button>
            )}
            {canDispense && (
              <Button
                size="sm"
                onClick={handleDispense}
                disabled={isDispensing}
                className="bg-white text-violet-600 hover:bg-white/90 font-medium border-2 border-white"
              >
                {isDispensing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <PackageCheck className="h-4 w-4 mr-2" />
                    Phát thuốc
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: Medicine List & Notes */}
        <div className="lg:col-span-2 space-y-6">
          {/* Prescribed Medicines */}
          <Card className="overflow-hidden border-0 shadow-lg">
            <div className="bg-gradient-to-r from-purple-500 to-fuchsia-500 px-5 py-3">
              <h2 className="flex items-center gap-2 text-white font-semibold">
                <Pill className="h-5 w-5" />
                Danh sách thuốc ({prescription.items.length})
              </h2>
            </div>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="w-[50px] font-semibold">#</TableHead>
                    <TableHead className="font-semibold">Thuốc</TableHead>
                    <TableHead className="text-center font-semibold">SL</TableHead>
                    <TableHead className="font-semibold">Liều dùng</TableHead>
                    <TableHead className="font-semibold">Thời gian</TableHead>
                    {isStaff && (
                      <TableHead className="text-right font-semibold">Thành tiền</TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {prescription.items.map((item, index) => (
                    <TableRow key={item.id} className="hover:bg-slate-50/50">
                      <TableCell>
                        <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-purple-400 to-fuchsia-500 flex items-center justify-center text-white font-bold text-xs">
                          {index + 1}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-slate-800">{item.medicine.name}</div>
                        {item.instructions && (
                          <div className="text-xs text-slate-500 mt-1">
                            {item.instructions}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="font-medium">
                          {item.quantity}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-700">{item.dosage}</TableCell>
                      <TableCell>
                        {item.durationDays ? (
                          <span className="text-slate-700">{item.durationDays} ngày</span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </TableCell>
                      {isStaff && (
                        <TableCell className="text-right font-medium text-slate-700">
                          {formatCurrency(item.quantity * item.unitPrice)}
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* General Notes */}
          {prescription.notes && (
            <Card className="overflow-hidden border-0 shadow-lg">
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-3">
                <h2 className="flex items-center gap-2 text-white font-semibold">
                  <FileText className="h-5 w-5" />
                  Lời dặn bác sĩ
                </h2>
              </div>
              <CardContent className="p-5">
                <p className="text-slate-700 whitespace-pre-wrap">{prescription.notes}</p>
              </CardContent>
            </Card>
          )}

          {/* Dispensed Info (if dispensed) */}
          {prescription.status === "DISPENSED" && prescription.dispensedAt && (
            <Card className="overflow-hidden border-0 shadow-lg">
              <div className="bg-gradient-to-r from-emerald-500 to-green-500 px-5 py-3">
                <h2 className="flex items-center gap-2 text-white font-semibold">
                  <PackageCheck className="h-5 w-5" />
                  Thông tin phát thuốc
                </h2>
              </div>
              <CardContent className="p-5">
                <div className="flex flex-wrap gap-6">
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-medium">Thời gian phát</p>
                    <p className="font-medium text-emerald-700">{formatDate(prescription.dispensedAt)}</p>
                  </div>
                  {prescription.dispensedBy && (
                    <div>
                      <p className="text-xs text-slate-500 uppercase font-medium">Người phát</p>
                      <p className="font-medium text-slate-700">{prescription.dispensedBy}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right: Summary Cards */}
        <div className="space-y-6">
          {/* Patient Info */}
          <Card className="overflow-hidden border-0 shadow-lg">
            <div className="bg-gradient-to-r from-sky-500 to-cyan-500 px-4 py-3">
              <h3 className="flex items-center gap-2 text-white font-semibold text-sm">
                <User className="h-4 w-4" />
                Bệnh nhân
              </h3>
            </div>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div
                  className={`h-12 w-12 rounded-full bg-gradient-to-br ${getAvatarColor(
                    prescription.patient.fullName
                  )} flex items-center justify-center text-white font-bold shadow-md`}
                >
                  {prescription.patient.fullName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-slate-800">{prescription.patient.fullName}</p>
                  <p className="text-xs text-slate-500">Bệnh nhân</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Doctor Info */}
          <Card className="overflow-hidden border-0 shadow-lg">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-3">
              <h3 className="flex items-center gap-2 text-white font-semibold text-sm">
                <Stethoscope className="h-4 w-4" />
                Bác sĩ kê đơn
              </h3>
            </div>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div
                  className={`h-12 w-12 rounded-full bg-gradient-to-br ${getAvatarColor(
                    prescription.doctor.fullName
                  )} flex items-center justify-center text-white font-bold shadow-md`}
                >
                  {prescription.doctor.fullName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-slate-800">{prescription.doctor.fullName}</p>
                  <p className="text-xs text-slate-500">Bác sĩ</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cost Summary (Staff only) */}
          {isStaff && (
            <Card className="overflow-hidden border-0 shadow-lg">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-3">
                <h3 className="flex items-center gap-2 text-white font-semibold text-sm">
                  <Calculator className="h-4 w-4" />
                  Tổng kết chi phí
                </h3>
              </div>
              <CardContent className="p-4 space-y-3">
                <div className="space-y-2 text-sm">
                  {prescription.items.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <span className="text-slate-600 truncate max-w-[150px]" title={item.medicine.name}>
                        {item.medicine.name} x{item.quantity}
                      </span>
                      <span className="font-medium text-slate-700">
                        {formatCurrency(item.quantity * item.unitPrice)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-sm text-slate-500">
                    <span>Số loại thuốc:</span>
                    <span className="font-medium">{prescription.items.length}</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-500">
                    <span>Tổng số lượng:</span>
                    <span className="font-medium">{totalItems}</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold mt-2">
                    <span className="text-slate-700">Tổng tiền thuốc:</span>
                    <span className="text-emerald-600">{formatCurrency(totalCost)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Audit Info */}
          <Card className="overflow-hidden border-0 shadow-lg">
            <div className="bg-gradient-to-r from-slate-500 to-slate-600 px-4 py-3">
              <h3 className="flex items-center gap-2 text-white font-semibold text-sm">
                <Clock className="h-4 w-4" />
                Lịch sử
              </h3>
            </div>
            <CardContent className="p-4 space-y-3 text-sm">
              <div>
                <p className="text-xs text-slate-500 uppercase">Ngày kê đơn</p>
                <p className="font-medium">{formatDate(prescription.prescribedAt)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase">Ngày tạo</p>
                <p>{formatDate(prescription.createdAt)}</p>
              </div>
              {prescription.updatedAt && prescription.updatedAt !== prescription.createdAt && (
                <div>
                  <p className="text-xs text-slate-500 uppercase">Cập nhật lần cuối</p>
                  <p className="text-slate-500">{formatDate(prescription.updatedAt)}</p>
                </div>
              )}

              {/* Link to Exam */}
              {examId && (
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="w-full mt-2 border-2 border-violet-300 bg-violet-50 text-violet-700 hover:bg-violet-100 hover:border-violet-400"
                >
                  <Link href={`${examBaseHref}/${examId}`}>
                    Xem phiếu khám
                    <ExternalLink className="h-3 w-3 ml-2" />
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
