"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format, formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import {
  Users,
  Clock,
  UserCheck,
  Play,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  ArrowRight,
  Phone,
  Sparkles,
  Stethoscope,
  ClipboardList,
  Timer,
  Info,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { useDoctorQueue, useCallNextPatient, useCompleteAppointment } from "@/hooks/queries/useQueue";
import {
  getPriorityColor,
  getPriorityReasonLabel,
  QueueItem,
} from "@/services/queue.service";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function DoctorQueuePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [doctorId, setDoctorId] = useState<string>("");
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Fetch employee profile to get employeeId if not in user context
  useEffect(() => {
    const fetchEmployeeProfile = async () => {
      // If already have employeeId from context, use it
      if (user?.employeeId) {
        setDoctorId(user.employeeId);
        setLoadingProfile(false);
        return;
      }

      // Otherwise fetch from hr-service
      try {
        const { default: api } = await import("@/config/axios");
        const response = await api.get("/hr/employees/me");
        const employeeId = response.data?.data?.id;
        if (employeeId) {
          setDoctorId(employeeId);
        }
      } catch (error) {
        console.error("Failed to fetch employee profile:", error);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchEmployeeProfile();
  }, [user?.employeeId]);

  const {
    data: queue,
    isLoading,
    refetch,
    isFetching,
  } = useDoctorQueue(doctorId);

  const callNextMutation = useCallNextPatient();
  const completeMutation = useCompleteAppointment();

  // Current patient: IN_PROGRESS first, then most recent COMPLETED (for exam creation)
  const inProgressPatient = queue?.find((q) => q.status === "IN_PROGRESS");
  const completedPatient = queue?.find((q) => q.status === "COMPLETED");
  const currentPatient = inProgressPatient || completedPatient;
  
  // Waiting patients (SCHEDULED)
  const waitingPatients = queue?.filter((q) => q.status === "SCHEDULED") || [];
  const completedCount = queue?.filter((q) => q.status === "COMPLETED").length || 0;

  const handleCallNext = async () => {
    if (!doctorId) return;
    try {
      const called = await callNextMutation.mutateAsync(doctorId);
      if (called) {
        toast.success(`Đã gọi bệnh nhân: ${called.patient?.fullName || "Bệnh nhân"}`);
      } else {
        toast.info("Không còn bệnh nhân trong hàng đợi");
      }
    } catch {
      toast.error("Không thể gọi bệnh nhân tiếp theo");
    }
  };

  const handleStartExam = async (appointment: QueueItem) => {
    console.log("handleStartExam called with:", appointment);
    
    // Complete the appointment first (backend requires COMPLETED status to create exam)
    try {
      await completeMutation.mutateAsync(appointment.id);
      toast.success("Đã chuẩn bị cho khám bệnh");
    } catch (err) {
      console.warn("Could not complete appointment:", err);
      // Still try to redirect, maybe it's already completed
    }
    
    router.push(`/doctor/exams/new?appointmentId=${appointment.id}`);
  };

  const formatWaitTime = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { locale: vi, addSuffix: false });
  };

  if (loadingProfile) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-48 w-full rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl lg:col-span-2" />
        </div>
      </div>
    );
  }

  if (!doctorId) {
    return (
      <Card className="border-2 border-amber-200 bg-amber-50">
        <CardContent className="flex items-center gap-3 pt-6">
          <XCircle className="h-5 w-5 text-amber-600" />
          <div>
            <p className="font-medium text-amber-800">Không tìm thấy thông tin bác sĩ</p>
            <p className="text-sm text-amber-700">Vui lòng đăng nhập lại.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Gradient Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 via-purple-500 to-fuchsia-500 p-6 text-white shadow-xl">
        {/* Background decorations */}
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
        <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/5" />
        <div className="absolute top-1/2 right-1/4 h-20 w-20 rounded-full bg-white/5" />

        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-white/20 p-3 backdrop-blur-sm">
              <Users className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                Hàng đợi của tôi
                <Badge className="bg-white/20 text-white border-0">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Hôm nay
                </Badge>
                {isFetching && <RefreshCw className="h-4 w-4 animate-spin" />}
              </h1>
              <p className="mt-1 text-purple-200">
                Quản lý bệnh nhân đang chờ khám
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching}
              className="bg-white/10 border-white/30 text-white hover:bg-white/20"
            >
              <RefreshCw className={cn("h-4 w-4 mr-2", isFetching && "animate-spin")} />
              Làm mới
            </Button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/20">
          <div className="text-center">
            <div className="text-3xl font-bold">{waitingPatients.length}</div>
            <div className="text-sm text-purple-200">Đang chờ</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{inProgressPatient ? 1 : 0}</div>
            <div className="text-sm text-purple-200">Đang khám</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{completedCount}</div>
            <div className="text-sm text-purple-200">Đã khám</div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-72 rounded-xl" />
          <Skeleton className="h-72 rounded-xl lg:col-span-2" />
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column: Current Patient + Stats */}
          <div className="space-y-4">
            {/* Current Patient Card */}
            <Card className="border-2 border-violet-200 shadow-sm overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-violet-500 to-purple-500" />
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <UserCheck className="h-5 w-5 text-violet-600" />
                  Đang khám
                </CardTitle>
              </CardHeader>
              <CardContent>
                {currentPatient ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                        {currentPatient.queueNumber}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-lg font-semibold truncate">
                          {currentPatient.patient?.fullName || currentPatient.patientName || `BN #${currentPatient.queueNumber}`}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Timer className="h-3.5 w-3.5" />
                          Đợi: {formatWaitTime(currentPatient.appointmentTime)}
                        </div>
                        <Badge 
                          className={cn(
                            "mt-1",
                            currentPatient.status === "IN_PROGRESS" 
                              ? "bg-amber-100 text-amber-700 border-amber-200" 
                              : "bg-emerald-100 text-emerald-700 border-emerald-200"
                          )}
                        >
                          {currentPatient.status === "IN_PROGRESS" ? "Đang khám" : "Hoàn thành"}
                        </Badge>
                      </div>
                    </div>

                    {currentPatient.reason && (
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <p className="text-xs text-muted-foreground mb-1">Lý do khám:</p>
                        <p className="text-sm">{currentPatient.reason}</p>
                      </div>
                    )}

                    {currentPatient.priorityReason && (
                      <Badge className={cn(getPriorityColor(currentPatient.priority), "px-3 py-1")}>
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        {getPriorityReasonLabel(currentPatient.priorityReason)}
                      </Badge>
                    )}

                    {/* IN_PROGRESS: Show "Bắt đầu khám" to redirect to exam creation */}
                    {currentPatient.status === "IN_PROGRESS" && (
                      <Button
                        className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
                        onClick={() => handleStartExam(currentPatient)}
                      >
                        <Stethoscope className="h-4 w-4 mr-2" />
                        Bắt đầu khám bệnh
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    )}
                    
                    {/* COMPLETED: Already examined, show info */}
                    {currentPatient.status === "COMPLETED" && (
                      <div className="flex items-center justify-center gap-2 py-3 bg-emerald-50 rounded-xl text-emerald-700">
                        <CheckCircle className="h-5 w-5" />
                        <span className="font-medium">Đã hoàn thành khám</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="rounded-full bg-slate-100 p-4 w-fit mx-auto mb-4">
                      <UserCheck className="h-10 w-10 text-slate-400" />
                    </div>
                    <p className="text-muted-foreground mb-4">Chưa có bệnh nhân đang khám</p>
                    {waitingPatients.length > 0 && (
                      <Button 
                        onClick={handleCallNext}
                        className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        Gọi bệnh nhân tiếp
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Info Card */}
            <Card className="border-2 border-sky-200 bg-gradient-to-br from-sky-50 to-white shadow-sm">
              <CardContent className="pt-5">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-sky-100">
                    <Info className="h-4 w-4 text-sky-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-2">Hướng dẫn</h3>
                    <ul className="space-y-1 text-sm text-slate-600">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                        Nhấn "Gọi" để gọi bệnh nhân
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                        Nhấn "Bắt đầu khám" để tạo phiếu khám
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                        Ưu tiên cao sẽ hiển thị trước
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Queue List */}
          <div className="lg:col-span-2">
            <Card className="border-2 border-slate-200 shadow-sm overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-sky-500 to-cyan-500" />
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <ClipboardList className="h-5 w-5 text-sky-600" />
                    Danh sách chờ
                  </CardTitle>
                  <CardDescription>
                    Sắp xếp theo mức ưu tiên và số thứ tự
                  </CardDescription>
                </div>
                {waitingPatients.length > 0 && !inProgressPatient && (
                  <Button
                    onClick={handleCallNext}
                    disabled={callNextMutation.isPending}
                    className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Gọi bệnh nhân tiếp
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {waitingPatients.length === 0 ? (
                  <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-xl">
                    <div className="rounded-full bg-slate-100 p-4 w-fit mx-auto mb-4">
                      <Clock className="h-12 w-12 text-slate-400" />
                    </div>
                    <p className="text-lg font-medium text-slate-700">Không có bệnh nhân trong hàng đợi</p>
                    <p className="text-muted-foreground">Danh sách sẽ hiển thị khi có bệnh nhân đăng ký</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {waitingPatients.map((patient, index) => (
                      <div
                        key={patient.id}
                        className={cn(
                          "flex items-center justify-between p-4 rounded-xl border-2 transition-all",
                          index === 0
                            ? "bg-gradient-to-r from-violet-50 to-purple-50 border-violet-200 shadow-sm"
                            : "border-slate-200 hover:border-sky-200 hover:bg-sky-50/50"
                        )}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={cn(
                              "h-14 w-14 rounded-xl flex items-center justify-center text-xl font-bold shadow-sm",
                              index === 0
                                ? "bg-gradient-to-br from-violet-500 to-purple-600 text-white"
                                : "bg-slate-100 text-slate-600"
                            )}
                          >
                            {patient.queueNumber}
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-semibold">{patient.patient?.fullName || patient.patientName || `BN #${patient.queueNumber}`}</span>
                              {patient.priorityReason && (
                                <Badge className={cn(getPriorityColor(patient.priority), "text-xs")}>
                                  {getPriorityReasonLabel(patient.priorityReason)}
                                </Badge>
                              )}
                              {patient.type === "EMERGENCY" && (
                                <Badge variant="destructive" className="text-xs">
                                  <AlertTriangle className="h-3 w-3 mr-1" />
                                  Cấp cứu
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                Đợi: {formatWaitTime(patient.appointmentTime)}
                              </span>
                              {patient.reason && (
                                <>
                                  <span>•</span>
                                  <span className="truncate max-w-[200px]">
                                    {patient.reason}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {index === 0 && !inProgressPatient && (
                          <Button 
                            size="sm"
                            onClick={handleCallNext}
                            className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
                          >
                            Gọi
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
