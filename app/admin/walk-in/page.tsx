"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  UserPlus,
  Search,
  Stethoscope,
  User,
  Clock,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Sparkles,
  Phone,
  Building2,
  Baby,
  HeartPulse,
  Accessibility,
  ClipboardList,
  Info,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePatients } from "@/hooks/queries/usePatient";
import { useEmployees } from "@/hooks/queries/useHr";
import { useRegisterWalkIn, PriorityReason } from "@/hooks/queries/useQueue";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const priorityReasons = [
  { value: "", label: "Bình thường (không ưu tiên)", icon: User, color: "bg-slate-100 text-slate-600 border-slate-200" },
  { value: "ELDERLY", label: "Người cao tuổi (trên 60)", icon: User, color: "bg-amber-100 text-amber-700 border-amber-200" },
  { value: "PREGNANT", label: "Phụ nữ mang thai", icon: HeartPulse, color: "bg-pink-100 text-pink-700 border-pink-200" },
  { value: "DISABILITY", label: "Người khuyết tật", icon: Accessibility, color: "bg-blue-100 text-blue-700 border-blue-200" },
  { value: "CHILD", label: "Trẻ em dưới 6 tuổi", icon: Baby, color: "bg-green-100 text-green-700 border-green-200" },
  { value: "EMERGENCY", label: "Cấp cứu", icon: AlertTriangle, color: "bg-red-100 text-red-700 border-red-200" },
];

export default function WalkInRegistrationPage() {
  const router = useRouter();
  const [patientSearch, setPatientSearch] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>("");
  const [reason, setReason] = useState("");
  const [priorityReason, setPriorityReason] = useState("");

  // Fetch patients - sort by newest first so recently created patients show first
  const { data: patientsData, isLoading: isLoadingPatients } = usePatients({
    search: patientSearch,
    size: 10,
    sort: "createdAt,desc",
  });
  const patients = patientsData?.content || [];

  // Fetch doctors
  const { data: doctorsData, isLoading: isLoadingDoctors } = useEmployees({
    role: "DOCTOR",
    status: "ACTIVE",
  });
  const doctors = (doctorsData?.content || []) as Array<{
    id: string;
    fullName: string;
    departmentName?: string;
    specialization?: string;
  }>;

  // Register mutation
  const registerMutation = useRegisterWalkIn();

  const selectedPatient = patients.find((p) => p.id === selectedPatientId);
  const selectedDoctor = doctors.find((d) => d.id === selectedDoctorId);
  const selectedPriority = priorityReasons.find((p) => p.value === priorityReason);

  const handleSubmit = async () => {
    if (!selectedPatientId) {
      toast.error("Vui lòng chọn bệnh nhân");
      return;
    }
    if (!selectedDoctorId) {
      toast.error("Vui lòng chọn bác sĩ");
      return;
    }

    try {
      const result = await registerMutation.mutateAsync({
        patientId: selectedPatientId,
        doctorId: selectedDoctorId,
        reason: reason || undefined,
        priorityReason: (priorityReason as PriorityReason) || undefined,
      });

      toast.success(
        `Đăng ký thành công! Số thứ tự: #${result.queueNumber}`,
        {
          description: (
            <span>
              <strong className="text-slate-900">{selectedPatient?.fullName || result.patientName || "Bệnh nhân"}</strong>
              {" "}đã được thêm vào hàng đợi
            </span>
          ),
          duration: 5000,
        }
      );

      // Reset form
      setSelectedPatientId("");
      setSelectedDoctorId("");
      setReason("");
      setPriorityReason("");
      setPatientSearch("");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Không thể đăng ký. Vui lòng thử lại."
      );
    }
  };

  const isFormValid = selectedPatientId && selectedDoctorId;

  return (
    <div className="space-y-6">
      {/* Enhanced Gradient Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-teal-600 via-emerald-500 to-green-500 p-6 text-white shadow-xl">
        {/* Background decorations */}
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
        <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/5" />
        <div className="absolute top-1/2 right-1/4 h-20 w-20 rounded-full bg-white/5" />

        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-white/20 p-3 backdrop-blur-sm">
              <UserPlus className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                Tiếp nhận bệnh nhân
                <Badge className="bg-white/20 text-white border-0">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Walk-in
                </Badge>
              </h1>
              <p className="mt-1 text-emerald-100">
                Đăng ký bệnh nhân vào hàng đợi khám bệnh
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex gap-4">
            <div className="text-center px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm">
              <div className="text-2xl font-bold">{patients.length}</div>
              <div className="text-xs text-emerald-100">Kết quả</div>
            </div>
            <div className="text-center px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm">
              <div className="text-2xl font-bold">{doctors.length}</div>
              <div className="text-xs text-emerald-100">Bác sĩ</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: Form - 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Step 1: Patient Selection */}
          <Card className="border-2 border-slate-200 shadow-sm overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-sky-500 to-cyan-500" />
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="flex items-center justify-center h-7 w-7 rounded-full bg-sky-100 text-sky-600 text-sm font-bold">1</div>
                <User className="h-5 w-5 text-sky-500" />
                Chọn bệnh nhân
              </CardTitle>
              <CardDescription>
                Tìm kiếm và chọn bệnh nhân đã có trong hệ thống
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm theo tên, số điện thoại, CCCD..."
                  value={patientSearch}
                  onChange={(e) => setPatientSearch(e.target.value)}
                  className="pl-9 border-2"
                />
              </div>

              {isLoadingPatients ? (
                <div className="flex items-center gap-2 text-muted-foreground p-4">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang tìm kiếm...
                </div>
              ) : patients.length > 0 ? (
                <div className="space-y-2 max-h-[240px] overflow-y-auto">
                  {patients.map((patient) => (
                    <div
                      key={patient.id}
                      onClick={() => setSelectedPatientId(patient.id)}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all",
                        selectedPatientId === patient.id
                          ? "bg-sky-50 border-sky-300 shadow-sm"
                          : "border-slate-200 hover:border-sky-200 hover:bg-sky-50/50"
                      )}
                    >
                      <div className="h-11 w-11 rounded-full bg-gradient-to-br from-sky-400 to-cyan-500 flex items-center justify-center text-white font-semibold">
                        {patient.fullName?.charAt(0) || "?"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{patient.fullName}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          {patient.phoneNumber || patient.email || "Chưa có thông tin"}
                        </div>
                      </div>
                      {selectedPatientId === patient.id && (
                        <CheckCircle className="h-5 w-5 text-sky-500" />
                      )}
                    </div>
                  ))}
                </div>
              ) : patientSearch ? (
                <div className="text-center py-6 border-2 border-dashed border-slate-200 rounded-xl">
                  <User className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-muted-foreground mb-2">Không tìm thấy bệnh nhân</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push("/admin/patients/new")}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Thêm bệnh nhân mới
                  </Button>
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground border-2 border-dashed border-slate-200 rounded-xl">
                  <Search className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                  <p>Nhập từ khóa để tìm kiếm bệnh nhân</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Step 2: Doctor Selection */}
          <Card className="border-2 border-slate-200 shadow-sm overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-violet-500 to-purple-500" />
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="flex items-center justify-center h-7 w-7 rounded-full bg-violet-100 text-violet-600 text-sm font-bold">2</div>
                <Stethoscope className="h-5 w-5 text-violet-500" />
                Chọn bác sĩ khám bệnh
              </CardTitle>
              <CardDescription>Chọn bác sĩ sẽ khám cho bệnh nhân</CardDescription>
            </CardHeader>
            <CardContent>
              <Select
                value={selectedDoctorId}
                onValueChange={setSelectedDoctorId}
              >
                <SelectTrigger className="border-2 h-12">
                  <SelectValue placeholder="Chọn bác sĩ..." />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map((doctor) => (
                    <SelectItem key={doctor.id} value={doctor.id}>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{doctor.fullName}</span>
                        {doctor.departmentName && (
                          <Badge variant="secondary" className="text-xs">
                            {doctor.departmentName}
                          </Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Step 3: Additional Info */}
          <Card className="border-2 border-slate-200 shadow-sm overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-amber-500 to-orange-500" />
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="flex items-center justify-center h-7 w-7 rounded-full bg-amber-100 text-amber-600 text-sm font-bold">3</div>
                <Clock className="h-5 w-5 text-amber-500" />
                Thông tin bổ sung
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Lý do khám</Label>
                <Textarea
                  placeholder="Nhập triệu chứng hoặc lý do khám..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={2}
                  className="border-2"
                />
              </div>

              <div className="space-y-3">
                <Label>Mức độ ưu tiên</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {priorityReasons.map((option) => {
                    const Icon = option.icon;
                    const isSelected = priorityReason === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setPriorityReason(option.value)}
                        className={cn(
                          "flex items-center gap-2 p-3 rounded-xl border-2 text-left transition-all text-sm",
                          isSelected
                            ? cn(option.color, "border-current shadow-sm")
                            : "border-slate-200 hover:border-slate-300 bg-white"
                        )}
                      >
                        <Icon className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{option.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Summary & Submit */}
        <div className="space-y-4">
          <Card className="border-2 border-emerald-200 shadow-sm overflow-hidden sticky top-4">
            <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5" />
                Xác nhận đăng ký
              </CardTitle>
              <CardDescription className="text-white/80">
                Kiểm tra thông tin trước khi đăng ký
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              {/* Patient Summary */}
              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs uppercase tracking-wider">Bệnh nhân</Label>
                {selectedPatient ? (
                  <div className="flex items-center gap-3 p-3 bg-sky-50 rounded-xl border border-sky-200">
                    <div className="h-11 w-11 rounded-full bg-gradient-to-br from-sky-400 to-cyan-500 flex items-center justify-center text-white font-bold">
                      {selectedPatient.fullName?.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium truncate">{selectedPatient.fullName}</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedPatient.phoneNumber}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground italic text-sm p-3 bg-slate-50 rounded-xl">
                    Chưa chọn bệnh nhân
                  </p>
                )}
              </div>

              {/* Doctor Summary */}
              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs uppercase tracking-wider">
                  Bác sĩ khám bệnh
                </Label>
                {selectedDoctor ? (
                  <div className="flex items-center gap-3 p-3 bg-violet-50 rounded-xl border border-violet-200">
                    <div className="h-11 w-11 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center">
                      <Stethoscope className="h-5 w-5 text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium truncate">{selectedDoctor.fullName}</p>
                      {selectedDoctor.departmentName && (
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Building2 className="h-3 w-3" />
                          {selectedDoctor.departmentName}
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground italic text-sm p-3 bg-slate-50 rounded-xl">
                    Chưa chọn bác sĩ
                  </p>
                )}
              </div>

              {/* Priority */}
              {priorityReason && selectedPriority && (
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-xs uppercase tracking-wider">Ưu tiên</Label>
                  <Badge className={cn(selectedPriority.color, "px-3 py-1.5")}>
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    {selectedPriority.label}
                  </Badge>
                </div>
              )}

              {/* Reason */}
              {reason && (
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-xs uppercase tracking-wider">Lý do khám</Label>
                  <p className="text-sm bg-slate-50 p-3 rounded-xl">{reason}</p>
                </div>
              )}

              <Button
                className="w-full mt-4 h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                size="lg"
                onClick={handleSubmit}
                disabled={!isFormValid || registerMutation.isPending}
              >
                {registerMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-5 w-5" />
                    Đăng ký vào hàng đợi
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white shadow-sm">
            <CardContent className="pt-5">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-100">
                  <Info className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 mb-2">Hướng dẫn</h3>
                  <ul className="space-y-1 text-sm text-slate-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                      Tìm và chọn bệnh nhân
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                      Chọn bác sĩ khám
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                      Nhập lý do (tùy chọn)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                      Chọn ưu tiên nếu cần
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
