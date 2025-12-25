"use client";

import { useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  ArrowLeft,
  FileText,
  Upload,
  Trash2,
  Download,
  ImageIcon,
  CheckCircle,
  Clock,
  AlertTriangle,
  Save,
  X,
  ZoomIn,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import {
  useLabResult,
  useUpdateLabResult,
  useUploadLabImages,
  useDeleteLabImage,
} from "@/hooks/queries/useLab";
import { ResultStatus, ImageType, DiagnosticImage } from "@/services/lab.service";
import { useDropzone } from "react-dropzone";

const statusConfig: Record<ResultStatus, { label: string; icon: React.ElementType; color: string }> = {
  PENDING: { label: "Chờ xử lý", icon: Clock, color: "bg-yellow-100 text-yellow-800" },
  PROCESSING: { label: "Đang thực hiện", icon: Clock, color: "bg-blue-100 text-blue-800" },
  COMPLETED: { label: "Hoàn thành", icon: CheckCircle, color: "bg-green-100 text-green-800" },
  CANCELLED: { label: "Đã hủy", icon: AlertTriangle, color: "bg-red-100 text-red-800" },
};

export default function AdminLabResultDetailPage() {
  const params = useParams();
  const router = useRouter();
  const resultId = params.id as string;

  const { data: result, isLoading } = useLabResult(resultId);
  const updateMutation = useUpdateLabResult();
  const uploadMutation = useUploadLabImages();
  const deleteMutation = useDeleteLabImage();

  // Form state
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    resultValue: "",
    status: "PENDING" as ResultStatus,
    isAbnormal: false,
    interpretation: "",
    notes: "",
  });

  // Image upload state
  const [uploadOpen, setUploadOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imageType, setImageType] = useState<ImageType>("PHOTO");
  const [imageDescription, setImageDescription] = useState("");

  // Image viewer state
  const [viewingImage, setViewingImage] = useState<DiagnosticImage | null>(null);

  // Dropzone config
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setSelectedFiles((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  // Initialize form when data loads
  const initializeForm = useCallback(() => {
    if (result) {
      setFormData({
        resultValue: result.resultValue || "",
        status: result.status,
        isAbnormal: result.isAbnormal || false,
        interpretation: result.interpretation || "",
        notes: result.notes || "",
      });
    }
  }, [result]);

  const handleEdit = () => {
    initializeForm();
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    initializeForm();
  };

  const handleSave = async () => {
    try {
      await updateMutation.mutateAsync({
        id: resultId,
        data: formData,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update:", error);
    }
  };

  const handleUploadImages = async () => {
    if (selectedFiles.length === 0) return;

    try {
      await uploadMutation.mutateAsync({
        resultId,
        files: selectedFiles,
        imageType,
        description: imageDescription || undefined,
      });
      setUploadOpen(false);
      setSelectedFiles([]);
      setImageDescription("");
    } catch (error) {
      console.error("Failed to upload:", error);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    try {
      await deleteMutation.mutateAsync({ resultId, imageId });
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!result) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">Không tìm thấy kết quả</h3>
            <p className="text-muted-foreground">Kết quả xét nghiệm không tồn tại hoặc đã bị xóa</p>
            <Link href="/admin/lab-results">
              <Button className="mt-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại danh sách
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const StatusIcon = statusConfig[result.status]?.icon || Clock;

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/lab-results">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Chi tiết kết quả xét nghiệm</h1>
            <p className="text-muted-foreground">
              {result.labTestName || "Xét nghiệm"}
            </p>
          </div>
        </div>
        <Badge className={statusConfig[result.status]?.color}>
          <StatusIcon className="mr-1 h-3 w-3" />
          {statusConfig[result.status]?.label}
        </Badge>
      </div>

      {/* Info Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Patient & Exam Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Thông tin bệnh nhân</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Họ tên:</span>
              <span className="font-medium">{result.patientName || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Mã phiếu khám:</span>
              <Link href={`/admin/exams/${result.medicalExamId}`} className="text-blue-600 hover:underline">
                {result.medicalExamId?.slice(0, 8)}...
              </Link>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ngày yêu cầu:</span>
              <span>
                {result.createdAt
                  ? format(new Date(result.createdAt), "dd/MM/yyyy HH:mm", { locale: vi })
                  : "N/A"}
              </span>
            </div>
            {result.performedAt && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ngày thực hiện:</span>
                <span>
                  {format(new Date(result.performedAt), "dd/MM/yyyy HH:mm", { locale: vi })}
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Thông tin xét nghiệm</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tên xét nghiệm:</span>
              <span className="font-medium">{result.labTestName || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Mã xét nghiệm:</span>
              <span>{result.labTestCode || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Loại xét nghiệm:</span>
              <span>{result.labTestCategory || "N/A"}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Result Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Kết quả xét nghiệm</CardTitle>
            <CardDescription>Nhập và quản lý kết quả xét nghiệm</CardDescription>
          </div>
          {!isEditing ? (
            <Button onClick={handleEdit} variant="outline">
              Chỉnh sửa
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button onClick={handleCancel} variant="outline">
                <X className="mr-2 h-4 w-4" />
                Hủy
              </Button>
              <Button onClick={handleSave} disabled={updateMutation.isPending}>
                <Save className="mr-2 h-4 w-4" />
                {updateMutation.isPending ? "Đang lưu..." : "Lưu"}
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {isEditing ? (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Giá trị kết quả</Label>
                  <Input
                    value={formData.resultValue}
                    onChange={(e) => setFormData({ ...formData, resultValue: e.target.value })}
                    placeholder="Nhập giá trị kết quả"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Trạng thái</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: ResultStatus) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">Chờ xử lý</SelectItem>
                      <SelectItem value="PROCESSING">Đang thực hiện</SelectItem>
                      <SelectItem value="COMPLETED">Hoàn thành</SelectItem>
                      <SelectItem value="CANCELLED">Đã hủy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Label>Kết quả bất thường</Label>
                <Switch
                  checked={formData.isAbnormal}
                  onCheckedChange={(checked) => setFormData({ ...formData, isAbnormal: checked })}
                />
              </div>
              <div className="space-y-2">
                <Label>Diễn giải kết quả</Label>
                <Textarea
                  value={formData.interpretation}
                  onChange={(e) => setFormData({ ...formData, interpretation: e.target.value })}
                  placeholder="Nhập diễn giải kết quả"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Ghi chú</Label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Ghi chú thêm"
                  rows={2}
                />
              </div>
            </>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <span className="text-muted-foreground">Giá trị kết quả:</span>
                  <p className={`font-medium ${result.isAbnormal ? "text-red-600" : ""}`}>
                    {result.resultValue || "Chưa có kết quả"}
                    {result.isAbnormal && <Badge variant="destructive" className="ml-2">Bất thường</Badge>}
                  </p>
                </div>
              </div>
              {result.interpretation && (
                <div>
                  <span className="text-muted-foreground">Diễn giải:</span>
                  <p className="mt-1">{result.interpretation}</p>
                </div>
              )}
              {result.notes && (
                <div>
                  <span className="text-muted-foreground">Ghi chú:</span>
                  <p className="mt-1">{result.notes}</p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Images Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Hình ảnh chẩn đoán</CardTitle>
            <CardDescription>Quản lý hình ảnh liên quan đến kết quả xét nghiệm</CardDescription>
          </div>
          <Button onClick={() => setUploadOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Tải lên hình ảnh
          </Button>
        </CardHeader>
        <CardContent>
          {result.images && result.images.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {result.images.map((image) => (
                <div
                  key={image.id}
                  className="relative group rounded-lg overflow-hidden border"
                >
                  <img
                    src={image.downloadUrl}
                    alt={image.description || "Hình ảnh xét nghiệm"}
                    className="w-full h-32 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-white"
                      onClick={() => setViewingImage(image)}
                    >
                      <ZoomIn className="h-5 w-5" />
                    </Button>
                    <a href={image.downloadUrl} download>
                      <Button size="icon" variant="ghost" className="text-white">
                        <Download className="h-5 w-5" />
                      </Button>
                    </a>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-white"
                      onClick={() => handleDeleteImage(image.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Chưa có hình ảnh nào</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upload Dialog */}
      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tải lên hình ảnh</DialogTitle>
            <DialogDescription>Chọn hình ảnh để tải lên cho kết quả xét nghiệm</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              {isDragActive ? (
                <p>Thả file vào đây...</p>
              ) : (
                <p>Kéo thả hoặc click để chọn file</p>
              )}
            </div>
            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                <Label>Đã chọn ({selectedFiles.length} file)</Label>
                <div className="flex flex-wrap gap-2">
                  {selectedFiles.map((file, index) => (
                    <Badge key={index} variant="secondary">
                      {file.name}
                      <button
                        onClick={() => setSelectedFiles(selectedFiles.filter((_, i) => i !== index))}
                        className="ml-1"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Loại hình ảnh</Label>
                <Select value={imageType} onValueChange={(v: ImageType) => setImageType(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PHOTO">Ảnh chụp</SelectItem>
                    <SelectItem value="XRAY">X-quang</SelectItem>
                    <SelectItem value="CT">CT Scan</SelectItem>
                    <SelectItem value="MRI">MRI</SelectItem>
                    <SelectItem value="ULTRASOUND">Siêu âm</SelectItem>
                    <SelectItem value="OTHER">Khác</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Mô tả</Label>
                <Input
                  value={imageDescription}
                  onChange={(e) => setImageDescription(e.target.value)}
                  placeholder="Mô tả hình ảnh"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadOpen(false)}>
              Hủy
            </Button>
            <Button
              onClick={handleUploadImages}
              disabled={selectedFiles.length === 0 || uploadMutation.isPending}
            >
              {uploadMutation.isPending ? "Đang tải..." : "Tải lên"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image Viewer Dialog */}
      <Dialog open={!!viewingImage} onOpenChange={() => setViewingImage(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{viewingImage?.description || "Hình ảnh xét nghiệm"}</DialogTitle>
          </DialogHeader>
          {viewingImage && (
            <img
              src={viewingImage.downloadUrl}
              alt={viewingImage.description || "Hình ảnh"}
              className="w-full max-h-[70vh] object-contain"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
