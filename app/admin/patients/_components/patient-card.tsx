"use client";

import { Patient } from "@/interfaces/patient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Phone,
  Mail,
  MapPin,
  Calendar,
  User,
  Heart,
  AlertTriangle,
  MoreHorizontal,
  Edit,
  Trash2,
  CreditCard,
  Shield,
  Eye,
} from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useState } from "react";
import Link from "next/link";

interface PatientCardProps {
  patient: Patient;
  onDelete?: (id: string) => void;
  isDeleting?: boolean;
  variant?: "grid" | "detail";
}

export function PatientCard({
  patient,
  onDelete,
  isDeleting = false,
  variant = "grid",
}: PatientCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getGenderLabel = (gender: string | null) => {
    if (!gender) return "N/A";
    const g = gender.toUpperCase();
    if (g === "MALE") return "Nam";
    if (g === "FEMALE") return "Nữ";
    return gender.charAt(0) + gender.slice(1).toLowerCase();
  };

  const formatDate = (date: string | null) => {
    if (!date) return "N/A";
    try {
      return format(new Date(date), "dd/MM/yyyy", { locale: vi });
    } catch {
      return date;
    }
  };

  const calculateAge = (dateOfBirth: string | null) => {
    if (!dateOfBirth) return null;
    try {
      const today = new Date();
      const birth = new Date(dateOfBirth);
      let age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      return age;
    } catch {
      return null;
    }
  };

  const age = calculateAge(patient.dateOfBirth);
  const isMale = patient.gender?.toUpperCase() === "MALE";
  const isFemale = patient.gender?.toUpperCase() === "FEMALE";

  if (variant === "detail") {
    return (
      <div className="space-y-6">
        {/* Header Card */}
        <Card className="border-2 border-slate-200 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20 ring-4 ring-white shadow-lg">
                  <AvatarImage src={patient.profileImageUrl || undefined} alt={patient.fullName} />
                  <AvatarFallback className={`text-xl font-bold text-white ${
                    isFemale 
                      ? "bg-gradient-to-br from-pink-400 to-rose-500" 
                      : "bg-gradient-to-br from-sky-400 to-cyan-500"
                  }`}>
                    {getInitials(patient.fullName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-2xl font-semibold">{patient.fullName}</h1>
                  <p className="text-muted-foreground">
                    Mã BN: {patient.id.slice(0, 8)}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    {patient.gender && (
                      <Badge variant="secondary" className={
                        isFemale ? "bg-pink-100 text-pink-700" : "bg-sky-100 text-sky-700"
                      }>
                        {getGenderLabel(patient.gender)}
                      </Badge>
                    )}
                    {age && <Badge variant="outline">{age} tuổi</Badge>}
                    {patient.bloodType && (
                      <Badge className="bg-red-100 text-red-700 border-red-200">
                        <Heart className="h-3 w-3 mr-1" />
                        {patient.bloodType}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" asChild>
                  <Link href={`/admin/patients/${patient.id}/edit`}>
                    <Edit className="h-4 w-4 mr-2" />
                    Sửa
                  </Link>
                </Button>
                {onDelete && (
                  <Button
                    variant="destructive"
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Xóa
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-2 border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5 text-sky-500" />
                Thông tin liên hệ
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{patient.phoneNumber || "Chưa cập nhật"}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{patient.email || "Chưa cập nhật"}</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                <span>{patient.address || "Chưa cập nhật"}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Ngày sinh: {formatDate(patient.dateOfBirth)}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-5 w-5 text-emerald-500" />
                Thông tin bảo hiểm
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Số CMND/CCCD</p>
                  <p>{patient.identificationNumber || "Chưa cập nhật"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Số BHYT</p>
                  <p>{patient.healthInsuranceNumber || "Chưa cập nhật"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Health & Emergency */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-2 border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                Thông tin sức khỏe
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Nhóm máu</p>
                <p className="font-medium">{patient.bloodType || "Chưa xác định"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  Dị ứng
                </p>
                <p>{patient.allergies || "Không có"}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Phone className="h-5 w-5 text-amber-500" />
                Liên hệ khẩn cấp
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Họ tên</p>
                <p className="font-medium">{patient.relativeFullName || "Chưa cập nhật"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Quan hệ</p>
                <p>{patient.relativeRelationship || "Chưa cập nhật"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Điện thoại</p>
                <p>{patient.relativePhoneNumber || "Chưa cập nhật"}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Delete Dialog */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Xóa bệnh nhân</AlertDialogTitle>
              <AlertDialogDescription>
                Bạn có chắc chắn muốn xóa{" "}
                <strong>{patient.fullName}</strong>? Hành động này không thể hoàn tác.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Hủy</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive hover:bg-destructive/90"
                onClick={() => onDelete?.(patient.id)}
                disabled={isDeleting}
              >
                {isDeleting ? "Đang xóa..." : "Xóa"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  // Grid variant - ENHANCED BEAUTIFUL CARD
  return (
    <>
      <Card className="group relative overflow-hidden border-2 border-slate-200 hover:border-sky-300 hover:shadow-lg transition-all duration-300 bg-white">
        {/* Gradient top border */}
        <div className={`absolute top-0 left-0 right-0 h-1 ${
          isFemale 
            ? "bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500" 
            : "bg-gradient-to-r from-sky-400 via-cyan-400 to-teal-500"
        }`} />
        
        <CardContent className="p-5">
          {/* Header with Avatar and Actions */}
          <div className="flex items-start justify-between mb-4">
            <Link
              href={`/admin/patients/${patient.id}`}
              className="flex items-center gap-3 flex-1 group/link"
            >
              <div className="relative">
                <Avatar className={`h-14 w-14 ring-2 ring-offset-2 shadow-md transition-transform group-hover/link:scale-105 ${
                  isFemale ? "ring-pink-300" : "ring-sky-300"
                }`}>
                  <AvatarImage src={patient.profileImageUrl || undefined} alt={patient.fullName} />
                  <AvatarFallback className={`font-bold text-lg text-white ${
                    isFemale 
                      ? "bg-gradient-to-br from-pink-400 to-rose-500" 
                      : "bg-gradient-to-br from-sky-400 to-cyan-500"
                  }`}>
                    {getInitials(patient.fullName)}
                  </AvatarFallback>
                </Avatar>
                {/* Online indicator */}
                <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full bg-emerald-500 border-2 border-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-slate-800 truncate group-hover/link:text-sky-600 transition-colors">
                  {patient.fullName}
                </p>
                <p className="text-sm text-slate-500 truncate flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  {patient.phoneNumber || "Chưa có SĐT"}
                </p>
              </div>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/admin/patients/${patient.id}`}>
                    <Eye className="h-4 w-4 mr-2" />
                    Xem chi tiết
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/admin/patients/${patient.id}/edit`}>
                    <Edit className="h-4 w-4 mr-2" />
                    Chỉnh sửa
                  </Link>
                </DropdownMenuItem>
                {onDelete && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => setShowDeleteDialog(true)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Xóa
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Info Section */}
          <div className="space-y-2 mb-4">
            {patient.email && (
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Mail className="h-3.5 w-3.5 text-slate-400" />
                <span className="truncate">{patient.email}</span>
              </div>
            )}
            {patient.dateOfBirth && (
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                <span>{formatDate(patient.dateOfBirth)}</span>
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {patient.gender && (
              <Badge 
                variant="secondary" 
                className={`text-xs font-medium ${
                  isFemale 
                    ? "bg-pink-100 text-pink-700 border border-pink-200" 
                    : "bg-sky-100 text-sky-700 border border-sky-200"
                }`}
              >
                {getGenderLabel(patient.gender)}
              </Badge>
            )}
            {age && (
              <Badge variant="outline" className="text-xs font-medium">
                {age} tuổi
              </Badge>
            )}
            {patient.bloodType && (
              <Badge className="text-xs font-medium bg-red-100 text-red-700 border border-red-200">
                {patient.bloodType}
              </Badge>
            )}
            {patient.healthInsuranceNumber && (
              <Badge className="text-xs font-medium bg-emerald-100 text-emerald-700 border border-emerald-200">
                <Shield className="h-3 w-3 mr-1" />
                BHYT
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Delete Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa bệnh nhân</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa{" "}
              <strong>{patient.fullName}</strong>? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={() => onDelete?.(patient.id)}
              disabled={isDeleting}
            >
              {isDeleting ? "Đang xóa..." : "Xóa"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
