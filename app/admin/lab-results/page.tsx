"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FlaskConical,
  Search,
  Activity,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Calendar,
  LayoutGrid,
  RefreshCcw,
  Eye,
  User,
  Beaker,
  TrendingUp,
  AlertCircle,
  XCircle,
} from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { useLabResults } from "@/hooks/queries/useLab";
import { LabTestResult, ResultStatus, LabTestCategory } from "@/services/lab.service";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebounce } from "@/hooks/useDebounce";
import { DateRangeFilter, DateRange } from "@/components/ui/date-range-filter";

const formatDateShort = (value: string) =>
  new Date(value).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

const formatDateFull = (value: string) =>
  new Date(value).toLocaleString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const formatTime = (value: string) =>
  new Date(value).toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });

// Status config
const statusConfig: Record<ResultStatus, { label: string; icon: React.ElementType; color: string; bgColor: string }> = {
  PENDING: { label: "Chờ xử lý", icon: Clock, color: "text-amber-700", bgColor: "bg-amber-50 border-amber-200" },
  PROCESSING: { label: "Đang thực hiện", icon: Activity, color: "text-blue-700", bgColor: "bg-blue-50 border-blue-200" },
  COMPLETED: { label: "Hoàn thành", icon: CheckCircle2, color: "text-emerald-700", bgColor: "bg-emerald-50 border-emerald-200" },
  CANCELLED: { label: "Đã hủy", icon: XCircle, color: "text-red-700", bgColor: "bg-red-50 border-red-200" },
};

const categoryLabels: Record<LabTestCategory, { label: string; color: string }> = {
  LAB: { label: "Xét nghiệm", color: "bg-blue-100 text-blue-700" },
  IMAGING: { label: "Chẩn đoán hình ảnh", color: "bg-purple-100 text-purple-700" },
  PATHOLOGY: { label: "Mô bệnh học", color: "bg-orange-100 text-orange-700" },
};

// Status filter options
const STATUS_OPTIONS = [
  { value: "ALL", label: "Tất cả", icon: FlaskConical },
  { value: "PENDING", label: "Chờ xử lý", icon: Clock },
  { value: "PROCESSING", label: "Đang XL", icon: Activity },
  { value: "COMPLETED", label: "Hoàn thành", icon: CheckCircle2 },
  { value: "CANCELLED", label: "Đã hủy", icon: XCircle },
];

// Group results by date
function groupResultsByDate(results: LabTestResult[]) {
  const groups: { [key: string]: LabTestResult[] } = {};
  results.forEach((result) => {
    const date = new Date(result.createdAt || new Date()).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(result);
  });
  return Object.entries(groups).sort(
    ([a], [b]) => new Date(b).getTime() - new Date(a).getTime()
  );
}

// View Toggle Button
function ViewToggle({
  view,
  onChange,
}: {
  view: "table" | "timeline" | "cards";
  onChange: (v: "table" | "timeline" | "cards") => void;
}) {
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
        <LayoutGrid className="h-4 w-4" />
        Bảng
      </button>
      <button
        onClick={() => onChange("timeline")}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
          view === "timeline"
            ? "bg-white text-slate-900 shadow-sm"
            : "text-slate-600 hover:text-slate-900"
        }`}
      >
        <Calendar className="h-4 w-4" />
        Timeline
      </button>
      <button
        onClick={() => onChange("cards")}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
          view === "cards"
            ? "bg-white text-slate-900 shadow-sm"
            : "text-slate-600 hover:text-slate-900"
        }`}
      >
        <Beaker className="h-4 w-4" />
        Cards
      </button>
    </div>
  );
}

// Timeline View Component
function TimelineView({
  results,
  isLoading,
}: {
  results: LabTestResult[];
  isLoading: boolean;
}) {
  const [collapsedDates, setCollapsedDates] = useState<Set<string>>(new Set());

  const toggleDate = (dateStr: string) => {
    setCollapsedDates((prev) => {
      const next = new Set(prev);
      if (next.has(dateStr)) {
        next.delete(dateStr);
      } else {
        next.add(dateStr);
      }
      return next;
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-4">
            <Skeleton className="h-4 w-4 rounded-full mt-1" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-32 w-full rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-slate-500">
        <FlaskConical className="h-12 w-12 text-slate-300 mb-4" />
        <p className="text-lg font-medium">Chưa có kết quả xét nghiệm</p>
        <p className="text-sm text-slate-400">Các kết quả sẽ hiển thị tại đây</p>
      </div>
    );
  }

  const groupedResults = groupResultsByDate(results);

  return (
    <div className="relative p-6">
      {/* Vertical Timeline Line */}
      <div className="absolute left-[29px] top-6 bottom-6 w-0.5 bg-gradient-to-b from-teal-400 via-cyan-500 to-blue-400 rounded-full" />

      <div className="space-y-8">
        {groupedResults.map(([dateStr, dayResults]) => {
          const isCollapsed = collapsedDates.has(dateStr);
          const pendingCount = dayResults.filter((r) => r.status === "PENDING").length;
          const completedCount = dayResults.filter((r) => r.status === "COMPLETED").length;
          const abnormalCount = dayResults.filter((r) => r.isAbnormal).length;

          return (
            <div key={dateStr} className="relative">
              {/* Date Header - Clickable */}
              <button
                onClick={() => toggleDate(dateStr)}
                className="flex items-center gap-4 mb-4 w-full text-left group"
              >
                <div className="relative z-10 h-4 w-4 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 shadow-lg shadow-teal-500/30 ring-4 ring-white" />
                <div className="flex items-center gap-2 flex-1">
                  <span className="font-semibold text-slate-800 capitalize group-hover:text-teal-600 transition-colors">
                    {formatDateFull(dayResults[0].createdAt || new Date().toISOString())}
                  </span>
                  <Badge variant="secondary" className="bg-teal-100 text-teal-700">
                    {dayResults.length} kết quả
                  </Badge>
                  {pendingCount > 0 && (
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                      {pendingCount} chờ XL
                    </Badge>
                  )}
                  {abnormalCount > 0 && (
                    <Badge variant="destructive">{abnormalCount} bất thường</Badge>
                  )}
                </div>
                <ChevronDown
                  className={`h-5 w-5 text-slate-400 group-hover:text-teal-500 transition-all duration-300 ${
                    isCollapsed ? "-rotate-90" : ""
                  }`}
                />
              </button>

              {/* Result Cards - Collapsible */}
              <div
                className={`ml-8 space-y-3 transition-all duration-300 ease-in-out overflow-hidden ${
                  isCollapsed ? "max-h-0 opacity-0" : "max-h-[5000px] opacity-100"
                }`}
              >
                {dayResults.map((result) => {
                  const statusInfo = statusConfig[result.status];
                  const StatusIcon = statusInfo?.icon || Clock;
                  const categoryInfo = result.labTestCategory
                    ? categoryLabels[result.labTestCategory]
                    : null;

                  return (
                    <Link
                      key={result.id}
                      href={`/admin/lab-results/${result.id}`}
                      className="block"
                    >
                      <div
                        className={`relative overflow-hidden rounded-xl border-2 p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${
                          result.isAbnormal
                            ? "border-red-200 bg-red-50/50 hover:border-red-300"
                            : "border-slate-200 bg-white hover:border-teal-300"
                        }`}
                      >
                        {/* Left accent bar */}
                        <div
                          className={`absolute top-0 left-0 w-1.5 h-full rounded-l-xl ${
                            result.status === "COMPLETED"
                              ? "bg-emerald-500"
                              : result.status === "PROCESSING"
                              ? "bg-blue-500"
                              : result.status === "CANCELLED"
                              ? "bg-red-500"
                              : "bg-amber-500"
                          }`}
                        />

                        <div className="flex items-start justify-between gap-4 pl-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-semibold text-slate-800">
                                {result.labTestName}
                              </span>
                              <Badge
                                variant="outline"
                                className={`${statusInfo?.color} border-current`}
                              >
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {statusInfo?.label}
                              </Badge>
                              {result.isAbnormal && (
                                <Badge variant="destructive">
                                  <AlertTriangle className="h-3 w-3 mr-1" />
                                  Bất thường
                                </Badge>
                              )}
                            </div>

                            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                              <span className="flex items-center gap-1">
                                <User className="h-3.5 w-3.5" />
                                {result.patientName}
                              </span>
                              <span className="font-mono text-xs">
                                Mã: {result.labTestCode}
                              </span>
                              {categoryInfo && (
                                <Badge variant="secondary" className={categoryInfo.color}>
                                  {categoryInfo.label}
                                </Badge>
                              )}
                            </div>

                            {result.resultValue && (
                              <div
                                className={`mt-2 p-2 rounded-lg ${
                                  result.isAbnormal
                                    ? "bg-red-100 text-red-700"
                                    : "bg-emerald-100 text-emerald-700"
                                }`}
                              >
                                <span className="font-semibold">{result.resultValue}</span>
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col items-end gap-2">
                            <span className="text-xs text-slate-500 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatTime(result.createdAt || new Date().toISOString())}
                            </span>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-teal-600 hover:text-teal-700 hover:bg-teal-50"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Xem
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Cards View Component
function CardsView({
  results,
  isLoading,
}: {
  results: LabTestResult[];
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-48 rounded-xl" />
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-slate-500">
        <FlaskConical className="h-12 w-12 text-slate-300 mb-4" />
        <p className="text-lg font-medium">Chưa có kết quả xét nghiệm</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
      {results.map((result) => {
        const statusInfo = statusConfig[result.status];
        const StatusIcon = statusInfo?.icon || Clock;
        const categoryInfo = result.labTestCategory
          ? categoryLabels[result.labTestCategory]
          : null;

        return (
          <Link key={result.id} href={`/admin/lab-results/${result.id}`}>
            <Card
              className={`h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                result.isAbnormal
                  ? "border-red-200 bg-gradient-to-br from-red-50 to-white"
                  : "border-slate-200 bg-gradient-to-br from-white to-slate-50"
              }`}
            >
              {/* Top accent */}
              <div
                className={`h-1 ${
                  result.status === "COMPLETED"
                    ? "bg-gradient-to-r from-emerald-400 to-green-500"
                    : result.status === "PROCESSING"
                    ? "bg-gradient-to-r from-blue-400 to-cyan-500"
                    : result.status === "CANCELLED"
                    ? "bg-gradient-to-r from-red-400 to-rose-500"
                    : "bg-gradient-to-r from-amber-400 to-yellow-500"
                }`}
              />
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-1">
                      {result.labTestName}
                    </h3>
                    <p className="text-sm text-slate-500 font-mono">
                      {result.labTestCode}
                    </p>
                  </div>
                  {result.isAbnormal && (
                    <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <div className="h-7 w-7 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
                    {result.patientName?.charAt(0)?.toUpperCase() || "P"}
                  </div>
                  <span className="text-sm text-slate-700">{result.patientName}</span>
                </div>

                {result.resultValue && (
                  <div
                    className={`p-2 rounded-lg mb-3 ${
                      result.isAbnormal
                        ? "bg-red-100 text-red-700"
                        : "bg-emerald-50 text-emerald-700"
                    }`}
                  >
                    <p className="text-sm font-medium">{result.resultValue}</p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <Badge variant="outline" className={`${statusInfo?.color} border-current`}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {statusInfo?.label}
                  </Badge>
                  {categoryInfo && (
                    <Badge variant="secondary" className={`${categoryInfo.color} text-xs`}>
                      {categoryInfo.label}
                    </Badge>
                  )}
                </div>

                <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDateShort(result.createdAt || new Date().toISOString())}
                </p>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}

// Table Row Component
function ResultTableRow({ result }: { result: LabTestResult }) {
  const statusInfo = statusConfig[result.status];
  const StatusIcon = statusInfo?.icon || Clock;
  const categoryInfo = result.labTestCategory
    ? categoryLabels[result.labTestCategory]
    : null;

  return (
    <TableRow className="hover:bg-slate-50/50 transition-colors">
      <TableCell>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-white font-semibold text-xs">
            {result.patientName?.charAt(0)?.toUpperCase() || "P"}
          </div>
          <span className="font-medium text-slate-900">{result.patientName}</span>
        </div>
      </TableCell>
      <TableCell>
        <div>
          <p className="font-medium text-slate-800">{result.labTestName}</p>
          <p className="text-xs text-slate-500 font-mono">{result.labTestCode}</p>
        </div>
      </TableCell>
      <TableCell>
        {categoryInfo && (
          <Badge variant="secondary" className={categoryInfo.color}>
            {categoryInfo.label}
          </Badge>
        )}
      </TableCell>
      <TableCell>
        {result.resultValue ? (
          <div
            className={`inline-block px-2 py-1 rounded-lg text-sm font-medium ${
              result.isAbnormal
                ? "bg-red-100 text-red-700"
                : "bg-emerald-50 text-emerald-700"
            }`}
          >
            {result.resultValue}
            {result.isAbnormal && (
              <AlertTriangle className="h-3 w-3 inline ml-1" />
            )}
          </div>
        ) : (
          <span className="text-slate-400 italic text-sm">Chưa có</span>
        )}
      </TableCell>
      <TableCell>
        <Badge variant="outline" className={`${statusInfo?.color} border-current`}>
          <StatusIcon className="h-3 w-3 mr-1" />
          {statusInfo?.label}
        </Badge>
      </TableCell>
      <TableCell className="text-slate-600 text-sm">
        {formatDateShort(result.createdAt || new Date().toISOString())}
      </TableCell>
      <TableCell>
        <Link href={`/admin/lab-results/${result.id}`}>
          <Button size="sm" variant="ghost" className="text-teal-600 hover:text-teal-700">
            <Eye className="h-4 w-4 mr-1" />
            Xem
          </Button>
        </Link>
      </TableCell>
    </TableRow>
  );
}

export default function AdminLabResultsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [size] = useState(20);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [viewMode, setViewMode] = useState<"table" | "timeline" | "cards">("timeline");
  const [abnormalOnly, setAbnormalOnly] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const debouncedSearch = useDebounce(search, 300);
  const { data, isLoading, refetch, isFetching } = useLabResults({ page, size });

  const results = data?.content || [];
  const totalPages = data?.totalPages || 1;
  const totalElements = data?.totalElements || 0;

  // Filter results client-side
  const filteredResults = useMemo(() => {
    let filtered = results;

    if (statusFilter !== "ALL") {
      filtered = filtered.filter((r: LabTestResult) => r.status === statusFilter);
    }

    if (abnormalOnly) {
      filtered = filtered.filter((r: LabTestResult) => r.isAbnormal);
    }

    if (debouncedSearch) {
      const searchLower = debouncedSearch.toLowerCase();
      filtered = filtered.filter(
        (r: LabTestResult) =>
          r.patientName?.toLowerCase().includes(searchLower) ||
          r.labTestName?.toLowerCase().includes(searchLower) ||
          r.labTestCode?.toLowerCase().includes(searchLower)
      );
    }
    // Date range filter
    if (dateRange?.from) {
      filtered = filtered.filter((r: LabTestResult) => {
        const createdAt = r.createdAt ? new Date(r.createdAt) : null;
        if (!createdAt) return true;
        const from = dateRange.from;
        const to = dateRange.to || dateRange.from;
        return createdAt >= from! && createdAt <= to!;
      });
    }

    return filtered;
  }, [results, statusFilter, abnormalOnly, debouncedSearch, dateRange]);

  // Calculate stats
  const stats = useMemo(() => {
    const pending = results.filter((r: LabTestResult) => r.status === "PENDING").length;
    const processing = results.filter((r: LabTestResult) => r.status === "PROCESSING").length;
    const completed = results.filter((r: LabTestResult) => r.status === "COMPLETED").length;
    const abnormal = results.filter((r: LabTestResult) => r.isAbnormal).length;
    return { total: results.length, pending, processing, completed, abnormal };
  }, [results]);

  return (
    <div className="space-y-6">
      {/* Enhanced Gradient Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-teal-600 via-cyan-500 to-blue-500 p-6 text-white shadow-lg">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
        <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/5" />

        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-white/20 p-3 backdrop-blur-sm">
              <FlaskConical className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Kết quả Xét nghiệm
              </h1>
              <p className="mt-1 text-cyan-100">
                Quản lý và theo dõi tất cả kết quả xét nghiệm
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="hidden md:flex gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-cyan-100 text-sm">
                <TrendingUp className="h-4 w-4" />
                Tổng số
              </div>
              <div className="text-2xl font-bold">{stats.total}</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-cyan-100 text-sm">
                <Clock className="h-4 w-4" />
                Chờ XL
              </div>
              <div className="text-2xl font-bold">{stats.pending}</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-cyan-100 text-sm">
                <Activity className="h-4 w-4" />
                Đang XL
              </div>
              <div className="text-2xl font-bold">{stats.processing}</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-cyan-100 text-sm">
                <CheckCircle2 className="h-4 w-4" />
                Hoàn thành
              </div>
              <div className="text-2xl font-bold">{stats.completed}</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-cyan-100 text-sm">
                <AlertCircle className="h-4 w-4" />
                Bất thường
              </div>
              <div className="text-2xl font-bold text-yellow-300">{stats.abnormal}</div>
            </div>
          </div>

          {/* Refresh Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="bg-white/10 border-2 border-white/40 text-white hover:bg-white/20 font-medium"
          >
            <RefreshCcw className={`h-4 w-4 mr-2 ${isFetching ? "animate-spin" : ""}`} />
            Làm mới
          </Button>
        </div>

        {/* Progress Bar */}
        {stats.total > 0 && (
          <div className="mt-6">
            <div className="flex justify-between text-xs text-cyan-100 mb-2">
              <span>Tiến độ xử lý</span>
              <span>{Math.round((stats.completed / stats.total) * 100)}% hoàn thành</span>
            </div>
            <Progress value={(stats.completed / stats.total) * 100} className="h-2 bg-white/20" />
          </div>
        )}
      </div>

      {/* Filter Toolbar */}
      <div className="space-y-3 rounded-xl bg-slate-50/80 p-4 border border-slate-200 shadow-sm">
        {/* Row 1: View Toggle + Date Range Filter */}
        <div className="flex flex-wrap items-center gap-3">
          {/* View Toggle */}
          <ViewToggle view={viewMode} onChange={setViewMode} />

          {/* Divider */}
          <div className="h-8 w-px bg-slate-200 hidden lg:block" />

          {/* Date Range Filter */}
          <DateRangeFilter
            value={dateRange}
            onChange={(range) => {
              setDateRange(range);
              setPage(0);
            }}
            theme="teal"
            presetKeys={["all", "today", "7days", "30days", "thisMonth"]}
          />
        </div>

        {/* Row 2: Status Pills + Abnormal + Search */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Pills */}
          <div className="flex gap-2 flex-wrap">
            {STATUS_OPTIONS.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.value}
                  onClick={() => {
                    setStatusFilter(option.value);
                    setPage(0);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    statusFilter === option.value
                      ? "bg-teal-600 text-white shadow-md"
                      : "bg-white text-slate-600 hover:bg-slate-100 border"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {option.label}
                </button>
              );
            })}
          </div>

          {/* Abnormal Filter */}
          <button
            onClick={() => {
              setAbnormalOnly(!abnormalOnly);
              setPage(0);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              abnormalOnly
                ? "bg-red-500 text-white shadow-md"
                : "bg-white text-slate-600 hover:bg-red-50 border border-red-200"
            }`}
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            Bất thường
          </button>

          {/* Search */}
          <div className="relative flex-1 min-w-[200px] ml-auto">
            <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder="Tìm theo tên BN, tên XN, mã XN..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              className="h-9 rounded-lg pl-9 bg-white"
            />
          </div>
        </div>
      </div>

      {/* Content Card */}
      <Card className="shadow-sm overflow-hidden">
        <CardContent className="p-0">
          {viewMode === "table" ? (
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead>Bệnh nhân</TableHead>
                  <TableHead>Xét nghiệm</TableHead>
                  <TableHead>Danh mục</TableHead>
                  <TableHead>Kết quả</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead className="w-24">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-12 text-center">
                      <span className="inline-flex items-center gap-2 text-muted-foreground">
                        <Spinner size="sm" /> Đang tải...
                      </span>
                    </TableCell>
                  </TableRow>
                ) : filteredResults.length > 0 ? (
                  filteredResults.map((result: LabTestResult) => (
                    <ResultTableRow key={result.id} result={result} />
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="py-12 text-center text-slate-500">
                      <div className="flex flex-col items-center gap-2">
                        <FlaskConical className="h-10 w-10 text-slate-300" />
                        <span>Không có kết quả xét nghiệm nào</span>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          ) : viewMode === "timeline" ? (
            <TimelineView results={filteredResults} isLoading={isLoading} />
          ) : (
            <CardsView results={filteredResults} isLoading={isLoading} />
          )}

          {!isLoading && totalElements > 0 && (
            <div className="px-6 py-4 border-t">
              <DataTablePagination
                currentPage={page}
                totalPages={totalPages}
                totalElements={totalElements}
                pageSize={size}
                onPageChange={setPage}
                infoText={`Hiển thị ${page * size + 1}-${Math.min(
                  (page + 1) * size,
                  totalElements
                )} / ${totalElements}`}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
