"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { format, formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import {
  Users,
  Clock,
  UserCheck,
  Play,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ArrowRight,
  Stethoscope,
  Phone,
  Activity,
  Timer,
  Zap,
  Sparkles,
  TrendingUp,
  Heart,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import {
  useAllQueues,
  useDoctorQueue,
  useCallNextPatient,
  useCompleteAppointment,
} from "@/hooks/queries/useQueue";
import { useEmployees } from "@/hooks/queries/useHr";
import {
  getPriorityLabel,
  getPriorityColor,
  getPriorityReasonLabel,
  QueueItem,
} from "@/services/queue.service";
import { toast } from "sonner";

// Animated pulse effect for current patient
const PulseRing = () => (
  <div className="absolute inset-0 rounded-full animate-ping bg-emerald-400 opacity-20" />
);

// Queue number badge with animation
function QueueNumberBadge({ 
  number, 
  isFirst = false, 
  isCurrent = false 
}: { 
  number: number; 
  isFirst?: boolean;
  isCurrent?: boolean;
}) {
  const baseClasses = "h-14 w-14 rounded-2xl flex items-center justify-center text-xl font-bold transition-all duration-300";
  
  if (isCurrent) {
    return (
      <div className="relative">
        <PulseRing />
        <div className={`${baseClasses} bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-200`}>
          {number}
        </div>
      </div>
    );
  }
  
  if (isFirst) {
    return (
      <div className={`${baseClasses} bg-gradient-to-br from-sky-500 to-indigo-600 text-white shadow-lg shadow-sky-200 animate-pulse`}>
        {number}
      </div>
    );
  }
  
  return (
    <div className={`${baseClasses} bg-slate-100 text-slate-600 hover:bg-slate-200`}>
      {number}
    </div>
  );
}

// Priority badge with improved styling
function PriorityBadge({ priority, reason }: { priority: number; reason?: string }) {
  if (priority <= 1) return null;
  
  const colors = {
    2: "bg-amber-100 text-amber-700 border-amber-200",
    3: "bg-orange-100 text-orange-700 border-orange-200", 
    4: "bg-red-100 text-red-700 border-red-200",
    5: "bg-rose-100 text-rose-800 border-rose-300",
  };
  
  return (
    <Badge 
      variant="outline" 
      className={`${colors[priority as keyof typeof colors] || colors[2]} font-medium`}
    >
      <Zap className="h-3 w-3 mr-1" />
      {reason ? getPriorityReasonLabel(reason) : `Ưu tiên ${priority}`}
    </Badge>
  );
}

export default function QueuePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>("all");

  // Auto-select doctor if logged in as doctor
  useEffect(() => {
    if (user?.employeeId && user.role === "DOCTOR") {
      setSelectedDoctorId(user.employeeId);
    }
  }, [user]);

  // Fetch doctors list for selection
  const { data: doctorsData } = useEmployees({ role: "DOCTOR" });
  const doctors = (doctorsData?.content || []) as Array<{
    id: string;
    fullName: string;
  }>;

  // Fetch all queues for receptionist view
  const {
    data: allQueues,
    isLoading: isLoadingAll,
    refetch: refetchAll,
    isFetching: isFetchingAll,
  } = useAllQueues();

  // Fetch queue for specific doctor
  const {
    data: doctorQueue,
    isLoading: isLoadingDoctor,
    refetch: refetchDoctor,
    isFetching: isFetchingDoctor,
  } = useDoctorQueue(selectedDoctorId === "all" ? "" : selectedDoctorId);

  // Use appropriate data based on selection
  const queue = useMemo(() => {
    if (selectedDoctorId === "all") {
      return allQueues || [];
    }
    return doctorQueue || [];
  }, [selectedDoctorId, allQueues, doctorQueue]);

  const isLoading = selectedDoctorId === "all" ? isLoadingAll : isLoadingDoctor;
  const isFetching = selectedDoctorId === "all" ? isFetchingAll : isFetchingDoctor;
  const refetch = selectedDoctorId === "all" ? refetchAll : refetchDoctor;

  // Mutations
  const callNextMutation = useCallNextPatient();
  const completeMutation = useCompleteAppointment();

  // Current patient (IN_PROGRESS)
  const currentPatient = queue?.find((q) => q.status === "IN_PROGRESS");
  // Waiting patients (SCHEDULED)
  const waitingPatients = queue?.filter((q) => q.status === "SCHEDULED") || [];
  // Completed count
  const completedCount = queue?.filter((q) => q.status === "COMPLETED").length || 0;
  // Total for today
  const totalToday = queue?.length || 0;

  // Check if user can call patients
  const canCallPatient =
    user?.role === "DOCTOR" || user?.role === "NURSE" || user?.role === "ADMIN";

  const handleCallNext = async () => {
    if (!selectedDoctorId || selectedDoctorId === "all") return;
    try {
      const called = await callNextMutation.mutateAsync(selectedDoctorId);
      if (called) {
        toast.success(`Đã gọi bệnh nhân: ${called.patient?.fullName || "Bệnh nhân"}`);
      } else {
        toast.info("Không có bệnh nhân trong hàng chờ");
      }
    } catch {
      toast.error("Không thể gọi bệnh nhân tiếp theo");
    }
  };

  const handleStartExam = (appointment: QueueItem) => {
    router.push(`/doctor/exams/create?appointmentId=${appointment.id}`);
  };

  const handleComplete = async (appointmentId: string) => {
    try {
      await completeMutation.mutateAsync(appointmentId);
      toast.success("Đã hoàn thành khám");
    } catch {
      toast.error("Không thể hoàn thành");
    }
  };

  const formatWaitTime = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), {
      locale: vi,
      addSuffix: false,
    });
  };

  // Progress percentage
  const progressPercent = totalToday > 0 ? Math.round((completedCount / totalToday) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Enhanced Gradient Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 p-6 text-white shadow-xl">
        {/* Background decorations */}
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
        <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-white/5" />

        <div className="relative flex flex-wrap items-start justify-between gap-4">
          {/* Left: Title and controls */}
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-white/20 p-3 backdrop-blur-sm">
              <Users className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                Hàng đợi Bệnh nhân
                {isFetching && (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                )}
              </h1>
              <p className="mt-1 text-purple-100">
                Quản lý và gọi bệnh nhân theo thứ tự ưu tiên
              </p>
            </div>
          </div>

          {/* Right: Stats */}
          <div className="hidden md:flex gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-purple-200 text-sm">
                <Timer className="h-4 w-4" />
                Đang chờ
              </div>
              <div className="text-3xl font-bold">{waitingPatients.length}</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-purple-200 text-sm">
                <Activity className="h-4 w-4" />
                Đang khám
              </div>
              <div className="text-3xl font-bold">{currentPatient ? 1 : 0}</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-purple-200 text-sm">
                <CheckCircle2 className="h-4 w-4" />
                Hoàn thành
              </div>
              <div className="text-3xl font-bold">{completedCount}</div>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 relative">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-purple-200">Tiến độ hôm nay</span>
            <span className="font-medium">{progressPercent}%</span>
          </div>
          <Progress value={progressPercent} className="h-2 bg-white/20" />
        </div>
      </div>

      {/* Doctor Selector + Refresh */}
      <div className="flex flex-wrap items-center gap-3 p-4 rounded-xl bg-slate-50 border">
        {user?.role !== "DOCTOR" && (
          <div className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-violet-500" />
            <Select value={selectedDoctorId} onValueChange={setSelectedDoctorId}>
              <SelectTrigger className="w-[280px] bg-white">
                <SelectValue placeholder="Chọn bác sĩ..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  <span className="font-medium">Tất cả bác sĩ</span>
                </SelectItem>
                {doctors.map((doc) => (
                  <SelectItem key={doc.id} value={doc.id}>
                    BS. {doc.fullName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="ml-auto flex gap-2">
          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={isFetching || !selectedDoctorId}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
            Làm mới
          </Button>
          
          {waitingPatients.length > 0 && !currentPatient && canCallPatient && selectedDoctorId !== "all" && (
            <Button 
              onClick={handleCallNext} 
              disabled={callNextMutation.isPending}
              className="gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
            >
              <Phone className="h-4 w-4" />
              Gọi bệnh nhân tiếp theo
            </Button>
          )}
        </div>
      </div>

      {!selectedDoctorId ? (
        <Card className="p-12 text-center border-2 border-dashed">
          <Stethoscope className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h2 className="text-xl font-semibold mb-2">Chọn bác sĩ để xem hàng đợi</h2>
          <p className="text-muted-foreground">
            Vui lòng chọn bác sĩ từ danh sách phía trên
          </p>
        </Card>
      ) : isLoading ? (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1 space-y-4">
            <Skeleton className="h-64 w-full rounded-xl" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-24 w-full rounded-xl" />
              <Skeleton className="h-24 w-full rounded-xl" />
            </div>
          </div>
          <div className="lg:col-span-2">
            <Skeleton className="h-96 w-full rounded-xl" />
          </div>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left: Current Patient */}
          <div className="lg:col-span-1 space-y-4">
            {/* Current Patient Card */}
            <Card className={`border-2 overflow-hidden ${
              currentPatient 
                ? "border-emerald-300 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50" 
                : "border-slate-200"
            }`}>
              <CardHeader className={`${currentPatient ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white" : "bg-slate-50"}`}>
                <CardTitle className="flex items-center gap-2">
                  {currentPatient ? (
                    <>
                      <Heart className="h-5 w-5 animate-pulse" />
                      Đang khám
                    </>
                  ) : (
                    <>
                      <UserCheck className="h-5 w-5 text-slate-500" />
                      <span className="text-slate-700">Phòng trống</span>
                    </>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {currentPatient ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <QueueNumberBadge number={currentPatient.queueNumber} isCurrent />
                      <div className="flex-1">
                        <p className="text-xl font-bold text-slate-800">
                          {currentPatient.patient?.fullName ||
                            currentPatient.patientName ||
                            `Bệnh nhân #${currentPatient.queueNumber}`}
                        </p>
                        <div className="flex items-center gap-1 text-sm text-emerald-600 mt-1">
                          <Timer className="h-3 w-3" />
                          Đã chờ: {formatWaitTime(currentPatient.appointmentTime)}
                        </div>
                      </div>
                    </div>

                    {currentPatient.reason && (
                      <div className="bg-white/80 p-3 rounded-lg border border-emerald-200">
                        <p className="text-xs text-slate-500 mb-1">Lý do khám:</p>
                        <p className="text-sm font-medium text-slate-700">{currentPatient.reason}</p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button
                        className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                        onClick={() => handleStartExam(currentPatient)}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Bắt đầu khám
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleComplete(currentPatient.id)}
                        disabled={completeMutation.isPending}
                        className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                      >
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Xong
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 text-slate-500">
                    <UserCheck className="h-16 w-16 mx-auto mb-3 opacity-30" />
                    <p className="font-medium">Chưa có bệnh nhân</p>
                    <p className="text-sm mt-1">Nhấn "Gọi bệnh nhân" để bắt đầu</p>
                    
                    {waitingPatients.length > 0 && canCallPatient && selectedDoctorId !== "all" && (
                      <Button className="mt-4" onClick={handleCallNext}>
                        <Phone className="h-4 w-4 mr-2" />
                        Gọi bệnh nhân tiếp theo
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="border-2 border-sky-200 bg-gradient-to-br from-sky-50 to-blue-50">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-sky-100 rounded-lg">
                      <Timer className="h-5 w-5 text-sky-600" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-sky-600">{waitingPatients.length}</p>
                      <p className="text-xs text-slate-500">Đang chờ</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-emerald-600">{completedCount}</p>
                      <p className="text-xs text-slate-500">Hoàn thành</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Average wait time indicator */}
            <Card className="border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-amber-700">Tổng số: {totalToday}</p>
                    <p className="text-xs text-slate-500">Bệnh nhân hôm nay</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Queue List */}
          <div className="lg:col-span-2">
            <Card className="border-2 shadow-sm">
              <CardHeader className="bg-slate-50 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-violet-500" />
                      Danh sách chờ
                    </CardTitle>
                    <CardDescription>
                      Sắp xếp theo độ ưu tiên và thứ tự đăng ký
                    </CardDescription>
                  </div>
                  {waitingPatients.length > 0 && (
                    <Badge variant="secondary" className="text-lg px-3 py-1">
                      {waitingPatients.length} người
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {waitingPatients.length === 0 ? (
                  <div className="text-center py-16 text-slate-500">
                    <Sparkles className="h-16 w-16 mx-auto mb-4 text-violet-300" />
                    <p className="text-lg font-medium">Không có bệnh nhân chờ</p>
                    <p className="text-sm mt-1 text-slate-400">Tất cả bệnh nhân đã được khám</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {waitingPatients.map((patient, index) => (
                      <div
                        key={patient.id}
                        className={`flex items-center justify-between p-4 transition-all duration-200 hover:bg-slate-50 ${
                          index === 0 ? "bg-gradient-to-r from-sky-50 to-indigo-50" : ""
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <QueueNumberBadge number={patient.queueNumber} isFirst={index === 0} />

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-semibold text-slate-800">
                                {patient.patient?.fullName ||
                                  patient.patientName ||
                                  `Bệnh nhân #${patient.queueNumber}`}
                              </span>
                              
                              <PriorityBadge priority={patient.priority} reason={patient.priorityReason} />
                              
                              {patient.type === "EMERGENCY" && (
                                <Badge variant="destructive" className="gap-1">
                                  <AlertTriangle className="h-3 w-3" />
                                  Cấp cứu
                                </Badge>
                              )}
                            </div>

                            <div className="flex items-center gap-3 mt-1 text-sm">
                              <span className="flex items-center gap-1 text-violet-600">
                                <Stethoscope className="h-3 w-3" />
                                BS. {patient.doctor?.fullName || patient.doctorName || "Chưa phân công"}
                              </span>
                              <span className="flex items-center gap-1 text-slate-500">
                                <Clock className="h-3 w-3" />
                                Chờ: {formatWaitTime(patient.appointmentTime)}
                              </span>
                            </div>

                            {patient.reason && (
                              <div className="mt-2 text-sm text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg inline-block">
                                {patient.reason}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Call button for first patient */}
                        {index === 0 && !currentPatient && canCallPatient && selectedDoctorId !== "all" && (
                          <Button 
                            size="sm" 
                            onClick={handleCallNext}
                            className="gap-1 bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600"
                          >
                            <Phone className="h-4 w-4" />
                            Gọi
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
