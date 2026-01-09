"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePatients, useDeletePatient, usePatientStats } from "@/hooks/queries/usePatient";
import { PatientCard } from "./_components";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { 
  Plus, 
  LayoutGrid, 
  List, 
  Users, 
  ArrowUpDown, 
  UserPlus, 
  RefreshCw,
  Heart,
  Activity,
  Calendar,
  Phone,
  Mail,
  Shield,
  TrendingUp,
  Sparkles,
  Search,
  X,
  Filter,
  SlidersHorizontal,
  CalendarDays,
  Baby,
  User2,
} from "lucide-react";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { DataTableRowActions } from "@/components/ui/data-table-row-actions";
import { format, differenceInYears, subDays } from "date-fns";
import { vi } from "date-fns/locale";
import { Patient, PatientListParams, Gender, BloodType } from "@/interfaces/patient";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { appointmentService } from "@/services/appointment.service";
import { Spinner } from "@/components/ui/spinner";
import { BloodTypeBadge } from "@/components/ui/blood-type-badge";
import { GenderBadge } from "@/components/ui/gender-badge";
import { EmptyValue } from "@/components/ui/empty-value";
import { useDebounce } from "@/hooks/useDebounce";
import { DateRangeFilter, DateRange } from "@/components/ui/date-range-filter";

type ViewMode = "table" | "grid";

// View toggle component
function ViewToggle({ view, onChange }: { view: ViewMode; onChange: (v: ViewMode) => void }) {
  return (
    <div className="flex bg-slate-100 rounded-lg p-1">
      <button
        onClick={() => onChange("table")}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
          view === "table"
            ? "bg-white text-slate-900 shadow-sm"
            : "text-slate-600 hover:text-slate-900"
        }`}
      >
        <List className="h-4 w-4" />
        Bảng
      </button>
      <button
        onClick={() => onChange("grid")}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
          view === "grid"
            ? "bg-white text-slate-900 shadow-sm"
            : "text-slate-600 hover:text-slate-900"
        }`}
      >
        <LayoutGrid className="h-4 w-4" />
        Thẻ
      </button>
    </div>
  );
}

// Quick filter pills
function QuickFilterPills({ 
  activeFilter, 
  onFilterChange,
  stats 
}: { 
  activeFilter: string; 
  onFilterChange: (id: string) => void;
  stats?: { male?: number; female?: number; total?: number };
}) {
  const filters = [
    { id: "all", label: "Tất cả", count: stats?.total || 0, color: "bg-slate-600" },
    { id: "male", label: "Nam", count: stats?.male || 0, color: "bg-sky-600" },
    { id: "female", label: "Nữ", count: stats?.female || 0, color: "bg-pink-500" },
    { id: "new", label: "Mới (7 ngày)", count: undefined, color: "bg-emerald-600" },
    { id: "insured", label: "Có BHYT", count: undefined, color: "bg-amber-600" },
  ];

  return (
    <div className="flex gap-2 flex-wrap">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
            activeFilter === filter.id
              ? `${filter.color} text-white shadow-md scale-[1.02]`
              : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
          }`}
        >
          {filter.label}
          {filter.count !== undefined && (
            <Badge 
              variant="secondary" 
              className={`${
                activeFilter === filter.id 
                  ? "bg-white/20 text-white" 
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {filter.count}
            </Badge>
          )}
        </button>
      ))}
    </div>
  );
}

// Stats header cards
function StatsCards({ 
  stats, 
  isLoading 
}: { 
  stats?: { 
    totalPatients: number; 
    newPatientsThisMonth: number; 
    newPatientsThisYear: number;
    averageAge: number;
    patientsByGender: Record<string, number>;
    patientsByBloodType: Record<string, number>;
  };
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border-2">
            <CardContent className="pt-4">
              <Skeleton className="h-8 w-20 mb-2" />
              <Skeleton className="h-4 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const cards = [
    { 
      icon: Users, 
      label: "Tổng bệnh nhân", 
      value: stats?.totalPatients || 0,
      color: "text-sky-600",
      bgColor: "bg-sky-100",
      borderColor: "border-sky-200"
    },
    { 
      icon: TrendingUp, 
      label: "Mới tháng này", 
      value: stats?.newPatientsThisMonth || 0,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
      borderColor: "border-emerald-200"
    },
    { 
      icon: CalendarDays, 
      label: "Mới năm nay", 
      value: stats?.newPatientsThisYear || 0,
      color: "text-violet-600",
      bgColor: "bg-violet-100",
      borderColor: "border-violet-200"
    },
    { 
      icon: Baby, 
      label: "Tuổi trung bình", 
      value: stats?.averageAge || 0,
      suffix: " tuổi",
      color: "text-amber-600",
      bgColor: "bg-amber-100",
      borderColor: "border-amber-200"
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <Card key={i} className={`border-2 ${card.borderColor} bg-gradient-to-br from-white to-slate-50`}>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <card.icon className={`h-5 w-5 ${card.color}`} />
              </div>
              <div>
                <div className={`text-2xl font-bold ${card.color}`}>
                  {card.value}{card.suffix || ""}
                </div>
                <div className="text-xs text-slate-500">{card.label}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

const genderOptions = [
  { value: "MALE", label: "Nam" },
  { value: "FEMALE", label: "Nữ" },
  { value: "OTHER", label: "Khác" },
];

const bloodTypeOptions: BloodType[] = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function PatientsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const canDelete = user?.role === "ADMIN";
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sort, setSort] = useState<{ field: string; direction: "asc" | "desc" }>({
    field: "fullName",
    direction: "asc",
  });
  
  // Filters
  const [searchInput, setSearchInput] = useState("");
  const [gender, setGender] = useState<Gender | undefined>();
  const [bloodType, setBloodType] = useState<BloodType | undefined>();
  const [hasInsurance, setHasInsurance] = useState<boolean | undefined>();
  const [ageRange, setAgeRange] = useState<[number, number]>([0, 100]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [quickFilter, setQuickFilter] = useState<string>("all");
  
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);
  const [showWarningDialog, setShowWarningDialog] = useState(false);
  const [futureAppointmentsCount, setFutureAppointmentsCount] = useState(0);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const debouncedSearch = useDebounce(searchInput, 300);

  // Build params - let service build RSQL
  const params: PatientListParams = useMemo(() => ({
    page,
    size: pageSize,
    search: debouncedSearch || undefined,
    gender: gender || undefined,
    bloodType: bloodType || undefined,
    hasInsurance: hasInsurance,
    ageMin: ageRange[0] > 0 ? ageRange[0] : undefined,
    ageMax: ageRange[1] < 100 ? ageRange[1] : undefined,
    createdAfter: dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") + "T00:00:00Z" : undefined,
    createdBefore: dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") + "T23:59:59Z" : undefined,
    sort: `${sort.field},${sort.direction}`,
  }), [page, pageSize, debouncedSearch, gender, bloodType, hasInsurance, ageRange, dateRange, sort]);

  const { data, isLoading, refetch, isFetching } = usePatients(params);
  const { data: stats, isLoading: statsLoading } = usePatientStats();
  const { mutate: deletePatient, isPending: isDeleting } = useDeletePatient();

  const patients = data?.content ?? [];
  const totalPages = data?.totalPages ?? 1;
  const totalElements = data?.totalElements ?? 0;

  const toggleSort = useCallback((field: string) => {
    setSort((prev) => {
      if (prev.field === field) {
        return { field, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { field, direction: "asc" };
    });
    setPage(0);
  }, []);

  const handleQuickFilterChange = useCallback((id: string) => {
    setQuickFilter(id);
    // Reset filters
    setGender(undefined);
    setHasInsurance(undefined);
    setDateRange(undefined);
    
    if (id === "male") {
      setGender("MALE");
    } else if (id === "female") {
      setGender("FEMALE");
    } else if (id === "insured") {
      setHasInsurance(true);
    } else if (id === "new") {
      // Last 7 days
      setDateRange({
        from: subDays(new Date(), 7),
        to: new Date()
      });
    }
    setPage(0);
  }, []);

  const clearAllFilters = useCallback(() => {
    setSearchInput("");
    setGender(undefined);
    setBloodType(undefined);
    setHasInsurance(undefined);
    setAgeRange([0, 100]);
    setDateRange(undefined);
    setQuickFilter("all");
    setPage(0);
  }, []);

  const handleDelete = useCallback(async (patient: Patient) => {
    setPatientToDelete(patient);
    const appointments = await appointmentService.list({ patientId: patient.id });
    const futureAppointments = appointments.content.filter(
      (appt) => new Date(appt.appointmentTime) > new Date()
    );

    if (futureAppointments.length > 0) {
      setFutureAppointmentsCount(futureAppointments.length);
      setShowWarningDialog(true);
    } else {
      setDeleteId(patient.id);
    }
  }, []);

  const handleViewPatient = useCallback((patient: Patient) => {
    router.push(`/admin/patients/${patient.id}`);
  }, [router]);

  const confirmDelete = useCallback(() => {
    if (deleteId) {
      deletePatient(deleteId, {
        onSettled: () => {
          setDeleteId(null);
          setPatientToDelete(null);
        },
      });
    }
  }, [deleteId, deletePatient]);

  const formatDate = (date: string | null) => {
    if (!date) return null;
    try {
      return format(new Date(date), "dd/MM/yyyy", { locale: vi });
    } catch {
      return date;
    }
  };

  const calculateAge = (dateOfBirth: string | null) => {
    if (!dateOfBirth) return null;
    try {
      return differenceInYears(new Date(), new Date(dateOfBirth));
    } catch {
      return null;
    }
  };

  const renderSortIcon = (field: string) => {
    if (sort.field !== field) return <ArrowUpDown className="h-4 w-4" />;
    return (
      <ArrowUpDown
        className="h-4 w-4"
        style={{ transform: sort.direction === "asc" ? "rotate(180deg)" : "none" }}
      />
    );
  };

  const hasActiveFilters = searchInput || gender || bloodType || hasInsurance || 
    ageRange[0] > 0 || ageRange[1] < 100 || dateRange;

  return (
    <div className="space-y-6">
      {/* Enhanced Gradient Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-sky-600 via-cyan-500 to-teal-500 p-6 text-white shadow-xl">
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
                Quản lý Bệnh nhân
                {isFetching && <RefreshCw className="h-4 w-4 animate-spin" />}
              </h1>
              <p className="mt-1 text-cyan-100">
                Quản lý hồ sơ và thông tin bệnh nhân
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              asChild
              className="bg-white text-cyan-700 hover:bg-cyan-50 gap-2"
            >
              <Link href="/admin/patients/new">
                <UserPlus className="h-4 w-4" />
                Thêm bệnh nhân
              </Link>
            </Button>
            <Button
              variant="outline"
              onClick={() => refetch()}
              disabled={isFetching}
              className="border-white/30 text-white hover:bg-white/10 gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
              Làm mới
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards from API */}
      <StatsCards stats={stats} isLoading={statsLoading} />

      {/* Filter Toolbar */}
      <div className="space-y-3 rounded-xl bg-slate-50/80 p-4 border border-slate-200 shadow-sm">
        {/* Row 1: Quick filters + View toggle */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <QuickFilterPills 
            activeFilter={quickFilter} 
            onFilterChange={handleQuickFilterChange}
            stats={{
              total: stats?.totalPatients || 0,
              male: stats?.patientsByGender?.MALE || 0,
              female: stats?.patientsByGender?.FEMALE || 0,
            }}
          />
          <ViewToggle view={viewMode} onChange={setViewMode} />
        </div>

        {/* Row 2: Search + Basic filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Tìm theo tên, SĐT, email..."
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                setPage(0);
              }}
              className="pl-9 h-10 bg-white"
            />
            {searchInput && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2"
                onClick={() => setSearchInput("")}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>

          {/* Gender */}
          <Select
            value={gender || "all"}
            onValueChange={(v) => {
              setGender(v === "all" ? undefined : (v as Gender));
              setQuickFilter("all");
              setPage(0);
            }}
          >
            <SelectTrigger className="w-[130px] bg-white">
              <SelectValue placeholder="Giới tính" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              {genderOptions.map((g) => (
                <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Blood type */}
          <Select
            value={bloodType || "all"}
            onValueChange={(v) => {
              setBloodType(v === "all" ? undefined : (v as BloodType));
              setPage(0);
            }}
          >
            <SelectTrigger className="w-[120px] bg-white">
              <SelectValue placeholder="Nhóm máu" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              {bloodTypeOptions.map((type) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select
            value={`${sort.field},${sort.direction}`}
            onValueChange={(val) => {
              const [field, direction] = val.split(",") as [string, "asc" | "desc"];
              setSort({ field, direction });
              setPage(0);
            }}
          >
            <SelectTrigger className="w-[160px] bg-white">
              <SelectValue placeholder="Sắp xếp" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fullName,asc">Tên (A-Z)</SelectItem>
              <SelectItem value="fullName,desc">Tên (Z-A)</SelectItem>
              <SelectItem value="createdAt,desc">Mới nhất</SelectItem>
              <SelectItem value="dateOfBirth,asc">Tuổi (cao nhất)</SelectItem>
            </SelectContent>
          </Select>

          {/* Advanced filters toggle */}
          <Button
            variant={showAdvancedFilters ? "default" : "outline"}
            size="sm"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="gap-2"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Nâng cao
          </Button>

          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearAllFilters} className="gap-1 text-slate-500">
              <X className="h-4 w-4" />
              Xóa bộ lọc
            </Button>
          )}
        </div>

        {/* Row 3: Advanced filters (collapsible) */}
        {showAdvancedFilters && (
          <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-slate-200">
            {/* Insurance filter */}
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-slate-500" />
              <Select
                value={hasInsurance === undefined ? "all" : hasInsurance ? "yes" : "no"}
                onValueChange={(v) => {
                  setHasInsurance(v === "all" ? undefined : v === "yes");
                  setPage(0);
                }}
              >
                <SelectTrigger className="w-[140px] bg-white">
                  <SelectValue placeholder="BHYT" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="yes">Có BHYT</SelectItem>
                  <SelectItem value="no">Không có</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Age range */}
            <div className="flex items-center gap-3">
              <User2 className="h-4 w-4 text-slate-500" />
              <span className="text-sm text-slate-600">Tuổi:</span>
              <div className="w-[200px] px-3">
                <Slider
                  value={ageRange}
                  onValueChange={(v) => {
                    setAgeRange(v as [number, number]);
                    setPage(0);
                  }}
                  min={0}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>
              <span className="text-sm font-medium text-slate-700 min-w-[80px]">
                {ageRange[0]} - {ageRange[1]} tuổi
              </span>
            </div>

            {/* Registration date */}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-slate-500" />
              <span className="text-sm text-slate-600">Ngày ĐK:</span>
              <DateRangeFilter
                value={dateRange}
                onChange={(range) => {
                  setDateRange(range);
                  setQuickFilter("all");
                  setPage(0);
                }}
                theme="teal"
                presetKeys={["all", "today", "7days", "30days", "thisMonth"]}
              />
            </div>
          </div>
        )}
      </div>

      {/* Table/Grid Card */}
      <Card className="border-2 border-slate-200 shadow-md rounded-xl overflow-hidden">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6">
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-[200px]" />
                      <Skeleton className="h-3 w-[150px]" />
                    </div>
                    <Skeleton className="h-8 w-20" />
                  </div>
                ))}
              </div>
            </div>
          ) : patients.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="rounded-full bg-slate-100 p-4 mb-4">
                <Sparkles className="h-12 w-12 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-700">Không tìm thấy bệnh nhân</h3>
              <p className="text-slate-500 mt-1 max-w-md">
                {hasActiveFilters
                  ? "Thử điều chỉnh bộ lọc của bạn"
                  : "Bắt đầu bằng cách thêm bệnh nhân mới"}
              </p>
              {!hasActiveFilters && (
                <Button asChild className="mt-4 gap-2">
                  <Link href="/admin/patients/new">
                    <Plus className="h-4 w-4" />
                    Thêm bệnh nhân
                  </Link>
                </Button>
              )}
            </div>
          ) : viewMode === "grid" ? (
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {patients.map((patient: Patient) => (
                <PatientCard
                  key={patient.id}
                  patient={patient}
                  onDelete={canDelete ? () => handleDelete(patient) : undefined}
                  isDeleting={isDeleting && deleteId === patient.id}
                />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 hover:bg-slate-50">
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead className="cursor-pointer hover:text-slate-900" onClick={() => toggleSort("fullName")}>
                    <div className="flex items-center gap-1">Bệnh nhân {renderSortIcon("fullName")}</div>
                  </TableHead>
                  <TableHead>Liên hệ</TableHead>
                  <TableHead>Giới tính</TableHead>
                  <TableHead className="cursor-pointer hover:text-slate-900" onClick={() => toggleSort("dateOfBirth")}>
                    <div className="flex items-center gap-1">Tuổi {renderSortIcon("dateOfBirth")}</div>
                  </TableHead>
                  <TableHead>Nhóm máu</TableHead>
                  <TableHead>BHYT</TableHead>
                  <TableHead className="w-[70px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patients.map((patient: Patient) => {
                  const isFemale = patient.gender?.toUpperCase() === "FEMALE";
                  return (
                    <TableRow
                      key={patient.id}
                      className="cursor-pointer hover:bg-sky-50/50 border-b border-slate-100 transition-colors"
                      onClick={() => handleViewPatient(patient)}
                    >
                      <TableCell>
                        <Avatar className="h-10 w-10 ring-2 ring-white shadow-sm">
                          <AvatarImage src={patient.profileImageUrl || undefined} alt={patient.fullName} />
                          <AvatarFallback className={`text-white font-semibold ${
                            isFemale 
                              ? "bg-gradient-to-br from-pink-400 to-rose-500" 
                              : "bg-gradient-to-br from-sky-400 to-cyan-500"
                          }`}>
                            {patient.fullName.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-900">{patient.fullName}</span>
                          <span className="text-sm text-slate-500 flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {patient.email || <EmptyValue text="Chưa có email" />}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-slate-700">
                          <Phone className="h-3.5 w-3.5 text-slate-400" />
                          <span>{patient.phoneNumber || <EmptyValue text="—" />}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {patient.gender ? <GenderBadge gender={patient.gender} /> : <EmptyValue text="—" />}
                      </TableCell>
                      <TableCell>
                        {patient.dateOfBirth ? (
                          <div className="flex flex-col">
                            <span className="font-medium text-slate-900">{calculateAge(patient.dateOfBirth)} tuổi</span>
                            <span className="text-xs text-slate-500">{formatDate(patient.dateOfBirth)}</span>
                          </div>
                        ) : <EmptyValue text="—" />}
                      </TableCell>
                      <TableCell>
                        {patient.bloodType ? <BloodTypeBadge bloodType={patient.bloodType} /> : <EmptyValue text="—" />}
                      </TableCell>
                      <TableCell>
                        {patient.healthInsuranceNumber ? (
                          <Badge className="bg-emerald-100 text-emerald-700 border border-emerald-200">
                            <Shield className="h-3 w-3 mr-1" />
                            Có
                          </Badge>
                        ) : <EmptyValue text="Không" />}
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <DataTableRowActions
                          rowId={patient.id}
                          actions={[
                            { label: "Xem chi tiết", href: `/admin/patients/${patient.id}` },
                            { label: "Chỉnh sửa", href: `/admin/patients/${patient.id}/edit` },
                            ...(canDelete ? [{ label: "Xóa", onClick: () => handleDelete(patient), destructive: true, separator: true }] : []),
                          ]}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {patients.length > 0 && (
        <Card className="border-2 border-slate-200 shadow-sm rounded-xl">
          <CardContent className="flex flex-wrap items-center justify-between gap-4 py-4">
            <p className="text-sm text-slate-600">
              Hiển thị <span className="font-semibold">{page * pageSize + 1}</span> đến{" "}
              <span className="font-semibold">{Math.min((page + 1) * pageSize, totalElements)}</span>{" "}
              trong <span className="font-semibold">{totalElements}</span> bệnh nhân
            </p>
            <DataTablePagination
              currentPage={page}
              totalPages={totalPages}
              totalElements={totalElements}
              pageSize={pageSize}
              onPageChange={setPage}
              showRowsPerPage={true}
              rowsPerPageOptions={[10, 20, 50]}
              rowsPerPage={pageSize}
              onRowsPerPageChange={(newSize) => { setPageSize(newSize); setPage(0); }}
            />
          </CardContent>
        </Card>
      )}

      {/* Delete Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa bệnh nhân</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa <strong>{patientToDelete?.fullName}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? <><Spinner size="sm" className="mr-2" />Đang xóa...</> : "Xóa"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Warning Dialog */}
      <AlertDialog open={showWarningDialog} onOpenChange={() => setShowWarningDialog(false)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Không thể xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bệnh nhân có <strong>{futureAppointmentsCount}</strong> lịch hẹn trong tương lai.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowWarningDialog(false)}>Đã hiểu</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
