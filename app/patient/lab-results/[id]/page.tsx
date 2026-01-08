"use client";

import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  FileText,
  Download,
  ImageIcon,
  CheckCircle,
  Clock,
  AlertTriangle,
  ZoomIn,
  User,
  Stethoscope,
  Calendar,
  Printer,
  FlaskConical,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useLabResult } from "@/hooks/queries/useLab";
import { ResultStatus, DiagnosticImage, LabTestCategory } from "@/services/lab.service";

const statusConfig: Record<ResultStatus, { label: string; icon: React.ElementType; color: string; bgColor: string }> = {
  PENDING: { label: "Chờ xử lý", icon: Clock, color: "text-amber-700", bgColor: "bg-amber-50 border-amber-200" },
  PROCESSING: { label: "Đang thực hiện", icon: Clock, color: "text-blue-700", bgColor: "bg-blue-50 border-blue-200" },
  COMPLETED: { label: "Hoàn thành", icon: CheckCircle, color: "text-emerald-700", bgColor: "bg-emerald-50 border-emerald-200" },
  CANCELLED: { label: "Đã hủy", icon: AlertTriangle, color: "text-red-700", bgColor: "bg-red-50 border-red-200" },
};

const categoryLabels: Record<LabTestCategory, { label: string; color: string }> = {
  LAB: { label: "Xét nghiệm", color: "bg-blue-100 text-blue-700 border-blue-200" },
  IMAGING: { label: "Chẩn đoán hình ảnh", color: "bg-purple-100 text-purple-700 border-purple-200" },
  PATHOLOGY: { label: "Mô bệnh học", color: "bg-orange-100 text-orange-700 border-orange-200" },
};

// Avatar color generator
function getAvatarColor(name: string): string {
  const colors = [
    "from-teal-400 to-cyan-500",
    "from-blue-400 to-indigo-500",
    "from-purple-400 to-pink-500",
    "from-rose-400 to-red-500",
    "from-orange-400 to-amber-500",
    "from-emerald-400 to-green-500",
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

export default function PatientLabResultDetailPage() {
  const params = useParams();
  const router = useRouter();
  const resultId = params.id as string;

  const { data: result, isLoading } = useLabResult(resultId);

  // Image viewer state
  const [viewingImage, setViewingImage] = useState<DiagnosticImage | null>(null);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: vi });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-40 w-full rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-64 w-full rounded-xl" />
            <Skeleton className="h-48 w-full rounded-xl" />
          </div>
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] py-12">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-rose-500 to-red-500 p-8 text-white text-center max-w-md">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-white rounded-full" />
          </div>
          <div className="relative z-10">
            <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
              <FlaskConical className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-bold mb-2">Không tìm thấy kết quả xét nghiệm</h2>
            <p className="text-white/80 mb-6">
              Kết quả xét nghiệm bạn tìm không tồn tại hoặc đã bị xóa.
            </p>
            <Button
              variant="outline"
              className="bg-white/10 border-white/30 text-white hover:bg-white/20"
              onClick={() => router.push("/patient/lab-results")}
            >
              Quay lại
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const statusInfo = statusConfig[result.status];
  const StatusIcon = statusInfo.icon;
  const categoryInfo = result.labTestCategory ? categoryLabels[result.labTestCategory] : null;

  return (
    <div className="space-y-6">
      {/* Gradient Header */}
      <div className="relative rounded-2xl bg-gradient-to-r from-teal-600 via-cyan-500 to-blue-500 p-6 text-white overflow-hidden shadow-xl">
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
              <FlaskConical className="h-8 w-8 text-white" />
            </div>

            {/* Title & Meta */}
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight">
                  {result.labTestName}
                </h1>
                <Badge variant="outline" className={`${statusInfo.color} border-current bg-white/10`}>
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {statusInfo.label}
                </Badge>
                {result.isAbnormal && (
                  <Badge variant="destructive" className="font-medium">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Bất thường
                  </Badge>
                )}
                {categoryInfo && (
                  <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                    {categoryInfo.label}
                  </Badge>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm">
                <span className="flex items-center gap-1.5 font-mono">
                  Mã: {result.labTestCode}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {formatDate(result.createdAt)}
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
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status & Result */}
          <Card className="overflow-hidden border-0 shadow-lg">
            <div className="bg-gradient-to-r from-teal-500 to-cyan-500 px-5 py-3">
              <CardTitle className="flex items-center gap-2 text-white font-semibold">
                <FileText className="h-5 w-5" />
                Kết quả Xét nghiệm
              </CardTitle>
            </div>
            <CardContent className="p-6 space-y-5">
              {/* Status & Abnormal badges */}
              <div className="flex flex-wrap items-center gap-6">
                <div>
                  <Label className="text-sm text-slate-500 uppercase font-medium">Trạng thái</Label>
                  <div className="mt-1">
                    <Badge variant="outline" className={`${statusInfo.color} border-current`}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {statusInfo.label}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-slate-500 uppercase font-medium">Kết quả</Label>
                  <div className="mt-1">
                    <Badge variant={result.isAbnormal ? "destructive" : "secondary"}>
                      {result.isAbnormal ? "Bất thường" : "Bình thường"}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Result Value - Highlighted */}
              <div className={`p-4 rounded-xl ${result.isAbnormal ? "bg-red-50 border border-red-200" : "bg-emerald-50 border border-emerald-200"}`}>
                <Label className="text-sm text-slate-500 uppercase font-medium mb-2 block">
                  Giá trị kết quả
                </Label>
                <p className={`text-xl font-bold ${result.isAbnormal ? "text-red-700" : "text-emerald-700"}`}>
                  {result.resultValue || "Chưa có kết quả"}
                </p>
              </div>

              {/* Interpretation */}
              <div className="space-y-2">
                <Label className="text-sm text-slate-500 uppercase font-medium">Nhận định của bác sĩ</Label>
                <p className={`text-sm p-3 rounded-lg ${result.interpretation ? "bg-violet-50 border border-violet-200 text-slate-700" : "text-slate-400 italic"}`}>
                  {result.interpretation || "Chưa có nhận định"}
                </p>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label className="text-sm text-slate-500 uppercase font-medium">Ghi chú</Label>
                <p className={`text-sm ${result.notes ? "text-slate-600" : "text-slate-400 italic"}`}>
                  {result.notes || "Không có ghi chú"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Images - Read only for patient */}
          <Card className="overflow-hidden border-0 shadow-lg">
            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 px-5 py-3">
              <CardTitle className="flex items-center gap-2 text-white font-semibold">
                <ImageIcon className="h-5 w-5" />
                Hình ảnh chẩn đoán ({result.images?.length || 0})
              </CardTitle>
            </div>
            <CardContent className="p-5">
              {result.images?.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {result.images.map((image) => (
                    <div
                      key={image.id}
                      className="relative group aspect-square rounded-xl overflow-hidden border-2 bg-slate-100 shadow-sm hover:shadow-md transition-shadow"
                    >
                      {image.downloadUrl ? (
                        <img
                          src={image.downloadUrl}
                          alt={image.fileName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="h-12 w-12 text-slate-400" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button
                          variant="secondary"
                          size="icon"
                          className="h-10 w-10"
                          onClick={() => setViewingImage(image)}
                        >
                          <ZoomIn className="h-5 w-5" />
                        </Button>
                        {image.downloadUrl && (
                          <a href={image.downloadUrl} download target="_blank" rel="noreferrer">
                            <Button variant="secondary" size="icon" className="h-10 w-10">
                              <Download className="h-5 w-5" />
                            </Button>
                          </a>
                        )}
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                        <p className="text-white text-xs truncate">{image.fileName}</p>
                        {image.imageType && (
                          <Badge variant="secondary" className="text-[10px] mt-1">
                            {image.imageType}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-slate-500">
                  <ImageIcon className="h-16 w-16 mx-auto mb-4 opacity-30" />
                  <p className="font-medium mb-2">Chưa có hình ảnh nào</p>
                  <p className="text-sm text-slate-400">Hình ảnh chẩn đoán sẽ hiển thị tại đây khi có</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Patient Info Card */}
          <Card className="overflow-hidden border-0 shadow-lg">
            <div className="bg-gradient-to-r from-sky-500 to-cyan-500 px-4 py-3">
              <CardTitle className="flex items-center gap-2 text-white font-semibold text-sm">
                <User className="h-4 w-4" />
                Thông tin của bạn
              </CardTitle>
            </div>
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`h-12 w-12 rounded-full bg-gradient-to-br ${getAvatarColor(
                    result.patientName
                  )} flex items-center justify-center text-white font-bold shadow-md`}
                >
                  {result.patientName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-slate-800">{result.patientName}</p>
                  <p className="text-xs text-slate-500">Bệnh nhân</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Test Info Card */}
          <Card className="overflow-hidden border-0 shadow-lg">
            <div className="bg-gradient-to-r from-violet-500 to-purple-500 px-4 py-3">
              <CardTitle className="flex items-center gap-2 text-white font-semibold text-sm">
                <FlaskConical className="h-4 w-4" />
                Thông tin Xét nghiệm
              </CardTitle>
            </div>
            <CardContent className="p-4 space-y-3">
              <div>
                <Label className="text-xs text-slate-500 uppercase">Loại xét nghiệm</Label>
                <p className="font-medium">{result.labTestName}</p>
              </div>
              <div>
                <Label className="text-xs text-slate-500 uppercase">Mã xét nghiệm</Label>
                <p className="font-mono text-sm">{result.labTestCode}</p>
              </div>
              {categoryInfo && (
                <div>
                  <Label className="text-xs text-slate-500 uppercase">Danh mục</Label>
                  <div className="mt-1">
                    <Badge variant="outline" className={categoryInfo.color}>
                      {categoryInfo.label}
                    </Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Audit Info */}
          <Card className="overflow-hidden border-0 shadow-lg">
            <div className="bg-gradient-to-r from-slate-500 to-slate-600 px-4 py-3">
              <CardTitle className="flex items-center gap-2 text-white font-semibold text-sm">
                <Clock className="h-4 w-4" />
                Lịch sử
              </CardTitle>
            </div>
            <CardContent className="p-4 space-y-3 text-sm">
              <div>
                <Label className="text-xs text-slate-500 uppercase">Ngày tạo</Label>
                <p>{formatDate(result.createdAt)}</p>
              </div>
              {result.performedBy && (
                <div>
                  <Label className="text-xs text-slate-500 uppercase">Thực hiện bởi</Label>
                  <p className="flex items-center gap-1">
                    <Stethoscope className="h-3 w-3 text-slate-400" />
                    {result.performedBy}
                  </p>
                </div>
              )}
              {result.performedAt && (
                <div>
                  <Label className="text-xs text-slate-500 uppercase">Thời gian thực hiện</Label>
                  <p>{formatDate(result.performedAt)}</p>
                </div>
              )}
              {result.interpretedBy && (
                <div>
                  <Label className="text-xs text-slate-500 uppercase">Nhận định bởi</Label>
                  <p className="flex items-center gap-1">
                    <Stethoscope className="h-3 w-3 text-slate-400" />
                    {result.interpretedBy}
                  </p>
                </div>
              )}
              {result.completedAt && (
                <div>
                  <Label className="text-xs text-slate-500 uppercase">Thời gian hoàn thành</Label>
                  <p className="text-emerald-600 font-medium">{formatDate(result.completedAt)}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Back to list */}
          <Link href="/patient/lab-results">
            <Button variant="outline" className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại danh sách
            </Button>
          </Link>
        </div>
      </div>

      {/* Image Viewer Dialog */}
      <Dialog open={!!viewingImage} onOpenChange={() => setViewingImage(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
          {viewingImage && (
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 z-10 bg-black/50 text-white hover:bg-black/70"
                onClick={() => setViewingImage(null)}
              >
                <X className="h-5 w-5" />
              </Button>
              <img
                src={viewingImage.downloadUrl}
                alt={viewingImage.fileName}
                className="w-full h-auto max-h-[80vh] object-contain"
              />
              <div className="p-4 bg-slate-50 border-t">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{viewingImage.fileName}</p>
                    {viewingImage.description && (
                      <p className="text-sm text-slate-500">{viewingImage.description}</p>
                    )}
                  </div>
                  {viewingImage.downloadUrl && (
                    <a href={viewingImage.downloadUrl} download target="_blank" rel="noreferrer">
                      <Button size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Tải xuống
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
