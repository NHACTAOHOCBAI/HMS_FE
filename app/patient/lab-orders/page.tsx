"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
  FileText,
  Calendar,
  LayoutGrid,
  RefreshCw,
  Stethoscope,
} from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { useQuery } from "@tanstack/react-query";
import { useMyProfile } from "@/hooks/queries/usePatient";
import {
  LabOrderResponse,
  getOrderStatusColor,
  getOrderStatusLabel,
  getPriorityLabel,
  getLabOrdersByPatient,
} from "@/services/lab-order.service";
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

// Status filter options
const STATUS_OPTIONS = [
  { value: "ALL", label: "Tất cả" },
  { value: "ORDERED", label: "Đã yêu cầu" },
  { value: "IN_PROGRESS", label: "Đang thực hiện" },
  { value: "COMPLETED", label: "Hoàn thành" },
  { value: "CANCELLED", label: "Đã hủy" },
];

// Group orders by date
function groupOrdersByDate(orders: LabOrderResponse[]) {
  const groups: { [key: string]: LabOrderResponse[] } = {};
  orders.forEach((order) => {
    const date = new Date(order.orderDate).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(order);
  });
  return Object.entries(groups).sort(([a], [b]) =>
    new Date(b).getTime() - new Date(a).getTime()
  );
}

// View Toggle Button
function ViewToggle({
  view,
  onChange,
}: {
  view: "table" | "timeline";
  onChange: (v: "table" | "timeline") => void;
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
    </div>
  );
}

// Timeline View Component
function TimelineView({
  orders,
  isLoading,
}: {
  orders: LabOrderResponse[];
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

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-slate-500">
        <FlaskConical className="h-12 w-12 text-slate-300 mb-4" />
        <p className="text-lg font-medium">Chưa có phiếu xét nghiệm</p>
        <p className="text-sm text-slate-400">
          Các phiếu xét nghiệm sẽ hiển thị theo timeline tại đây
        </p>
      </div>
    );
  }

  const groupedOrders = groupOrdersByDate(orders);

  return (
    <div className="relative p-6">
      {/* Vertical Timeline Line */}
      <div className="absolute left-[29px] top-6 bottom-6 w-0.5 bg-gradient-to-b from-teal-400 via-cyan-500 to-blue-400 rounded-full" />

      <div className="space-y-8">
        {groupedOrders.map(([dateStr, dayOrders]) => {
          const isCollapsed = collapsedDates.has(dateStr);
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
                    {formatDateFull(dayOrders[0].orderDate)}
                  </span>
                  <Badge
                    variant="secondary"
                    className="bg-teal-100 text-teal-700"
                  >
                    {dayOrders.length} phiếu
                  </Badge>
                </div>
                <ChevronDown
                  className={`h-5 w-5 text-slate-400 group-hover:text-teal-500 transition-all duration-300 ${
                    isCollapsed ? "-rotate-90" : ""
                  }`}
                />
              </button>

              {/* Order Cards for this date - Collapsible */}
              <div
                className={`ml-8 space-y-4 transition-all duration-300 ease-in-out overflow-hidden ${
                  isCollapsed ? "max-h-0 opacity-0" : "max-h-[5000px] opacity-100"
                }`}
              >
                {dayOrders.map((order) => (
                  <div
                    key={order.id}
                    className="relative overflow-hidden rounded-xl border bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:border-teal-300 hover:-translate-y-0.5"
                  >
                    {/* Decorative gradient bar */}
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-teal-400 via-cyan-500 to-blue-400 rounded-l-xl" />

                    <div className="p-4 pl-6">
                      {/* Header Row */}
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <h3 className="font-semibold text-slate-900">
                            Phiếu #{order.orderNumber}
                          </h3>
                          <p className="text-sm text-teal-600 font-mono">
                            {order.totalTests} xét nghiệm
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          {order.priority === "URGENT" && (
                            <Badge className="bg-orange-100 text-orange-700 border-0">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              {getPriorityLabel(order.priority)}
                            </Badge>
                          )}
                          <Badge
                            className={`${getOrderStatusColor(order.status)} border-0`}
                          >
                            {getOrderStatusLabel(order.status)}
                          </Badge>
                        </div>
                      </div>

                      {/* Doctor Info */}
                      {order.orderingDoctorName && (
                        <div className="flex items-center gap-2 text-sm text-slate-600 mb-3">
                          <Stethoscope className="h-4 w-4 text-slate-400" />
                          <span>BS. {order.orderingDoctorName}</span>
                        </div>
                      )}

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                          <span>Tiến độ xét nghiệm</span>
                          <span className="font-medium">
                            {order.completedTests}/{order.totalTests} tests
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2.5">
                          <div
                            className="bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 h-2.5 rounded-full transition-all duration-500"
                            style={{
                              width: `${
                                order.totalTests > 0
                                  ? (order.completedTests / order.totalTests) * 100
                                  : 0
                              }%`,
                            }}
                          />
                        </div>
                      </div>

                      {/* Test Results Preview */}
                      {order.results && order.results.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                            Danh sách xét nghiệm
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {order.results.slice(0, 4).map((result) => (
                              <div
                                key={result.id}
                                className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-100"
                              >
                                <div
                                  className={`h-2.5 w-2.5 rounded-full flex-shrink-0 ${
                                    result.status === "COMPLETED"
                                      ? "bg-green-500"
                                      : result.status === "PROCESSING"
                                      ? "bg-yellow-500 animate-pulse"
                                      : "bg-slate-300"
                                  }`}
                                />
                                <span className="text-sm font-medium text-slate-700 truncate flex-1">
                                  {result.labTestName}
                                </span>
                                {result.isAbnormal && (
                                  <AlertTriangle className="h-3.5 w-3.5 text-red-500 flex-shrink-0" />
                                )}
                              </div>
                            ))}
                          </div>
                          {order.results.length > 4 && (
                            <p className="text-xs text-slate-500 text-center mt-2">
                              + {order.results.length - 4} xét nghiệm khác
                            </p>
                          )}
                        </div>
                      )}

                      {/* Footer - Time & View Button */}
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTime(order.orderDate)}
                        </span>
                        <Link href={`/patient/lab-orders/${order.id}`}>
                          <Button variant="ghost" size="sm" className="text-teal-600 hover:text-teal-700 hover:bg-teal-50">
                            Xem chi tiết
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Component for expandable lab order row (table view)
function LabOrderRow({
  order,
  isExpanded,
  onToggle,
}: {
  order: LabOrderResponse;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <>
      <TableRow
        className="hover:bg-slate-50/50 transition-colors cursor-pointer"
        onClick={onToggle}
      >
        <TableCell className="w-12">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </TableCell>
        <TableCell className="font-mono font-medium text-teal-600">
          {order.orderNumber}
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <Stethoscope className="h-4 w-4 text-slate-400" />
            <span className="text-slate-700">{order.orderingDoctorName || "N/A"}</span>
          </div>
        </TableCell>
        <TableCell className="text-slate-600">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            {formatDateShort(order.orderDate)}
          </div>
        </TableCell>
        <TableCell>
          <Badge className={`${getOrderStatusColor(order.status)} border-0`}>
            {getOrderStatusLabel(order.status)}
          </Badge>
        </TableCell>
        <TableCell>
          {order.priority === "URGENT" && (
            <Badge className="bg-orange-100 text-orange-700 border-0">
              <AlertTriangle className="h-3 w-3 mr-1" />
              {getPriorityLabel(order.priority)}
            </Badge>
          )}
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <div className="w-24 bg-slate-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-teal-500 to-cyan-500 h-2 rounded-full transition-all"
                style={{
                  width: `${
                    order.totalTests > 0
                      ? (order.completedTests / order.totalTests) * 100
                      : 0
                  }%`,
                }}
              />
            </div>
            <span className="text-sm text-slate-600 font-medium">
              {order.completedTests}/{order.totalTests}
            </span>
          </div>
        </TableCell>
      </TableRow>

      {isExpanded && (
        <TableRow className="bg-slate-50/80">
          <TableCell colSpan={7} className="p-0">
            <div className="p-4 border-l-4 border-teal-400 ml-4">
              <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <FlaskConical className="h-4 w-4 text-teal-500" />
                Chi tiết xét nghiệm ({order.results?.length || 0} tests)
              </h4>
              {order.results && order.results.length > 0 ? (
                <div className="grid gap-2">
                  {order.results.map((result) => (
                    <div
                      key={result.id}
                      className="flex items-center justify-between bg-white rounded-lg px-4 py-2.5 border"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-2 w-2 rounded-full ${
                            result.status === "COMPLETED"
                              ? "bg-green-500"
                              : result.status === "PROCESSING"
                              ? "bg-yellow-500"
                              : "bg-slate-300"
                          }`}
                        />
                        <span className="font-medium text-slate-800">
                          {result.labTestName}
                        </span>
                        <span className="text-xs text-slate-500">
                          ({result.labTestCode})
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        {result.resultValue && (
                          <span
                            className={`font-mono text-sm ${
                              result.isAbnormal
                                ? "text-red-600 font-semibold"
                                : "text-slate-700"
                            }`}
                          >
                            {result.resultValue}
                            {result.isAbnormal && (
                              <AlertTriangle className="h-3 w-3 inline ml-1 text-red-500" />
                            )}
                          </span>
                        )}
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            result.status === "COMPLETED"
                              ? "border-green-300 text-green-700"
                              : result.status === "PROCESSING"
                              ? "border-yellow-300 text-yellow-700"
                              : "border-slate-300 text-slate-600"
                          }`}
                        >
                          {result.status === "COMPLETED"
                            ? "Hoàn thành"
                            : result.status === "PROCESSING"
                            ? "Đang xử lý"
                            : "Chờ xử lý"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500 italic">
                  Chưa có kết quả xét nghiệm.
                </p>
              )}
              <div className="mt-4 flex justify-end">
                <Link href={`/patient/lab-orders/${order.id}`}>
                  <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
                    <FileText className="h-4 w-4 mr-2" />
                    Xem chi tiết
                  </Button>
                </Link>
              </div>
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

export default function PatientLabOrdersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<"table" | "timeline">("timeline");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const debouncedSearch = useDebounce(search, 300);
  
  // Get patient ID from profile
  const { data: profile, isLoading: isLoadingProfile } = useMyProfile();
  const patientId = profile?.id || "";

  // Fetch lab orders for patient
  const { data: orders, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["labOrders", "patient", patientId],
    queryFn: () => getLabOrdersByPatient(patientId),
    enabled: !!patientId,
  });

  const labOrders = orders || [];

  // Filter orders client-side
  const filteredOrders = useMemo(() => {
    let result = labOrders;
    if (statusFilter !== "ALL") {
      result = result.filter(
        (o: LabOrderResponse) => o.status === statusFilter
      );
    }
    if (debouncedSearch) {
      const searchLower = debouncedSearch.toLowerCase();
      result = result.filter(
        (o: LabOrderResponse) =>
          o.orderNumber?.toLowerCase().includes(searchLower) ||
          o.orderingDoctorName?.toLowerCase().includes(searchLower)
      );
    }
    // Date range filter
    if (dateRange?.from) {
      result = result.filter((o: LabOrderResponse) => {
        const orderDate = o.orderDate ? new Date(o.orderDate) : null;
        if (!orderDate) return true;
        const from = dateRange.from;
        const to = dateRange.to || dateRange.from;
        return orderDate >= from! && orderDate <= to!;
      });
    }
    return result;
  }, [labOrders, statusFilter, debouncedSearch, dateRange]);

  // Calculate stats
  const stats = useMemo(() => {
    const ordered = labOrders.filter(
      (o: LabOrderResponse) => o.status === "ORDERED"
    ).length;
    const inProgress = labOrders.filter(
      (o: LabOrderResponse) => o.status === "IN_PROGRESS"
    ).length;
    const completed = labOrders.filter(
      (o: LabOrderResponse) => o.status === "COMPLETED"
    ).length;
    const cancelled = labOrders.filter(
      (o: LabOrderResponse) => o.status === "CANCELLED"
    ).length;
    return { total: labOrders.length, ordered, inProgress, completed, cancelled };
  }, [labOrders]);

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  if (isLoadingProfile || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" variant="muted" />
      </div>
    );
  }

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
              <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                Phiếu Xét Nghiệm
                {isFetching && <RefreshCw className="h-4 w-4 animate-spin" />}
              </h1>
              <p className="mt-1 text-teal-100">
                Xem tất cả các phiếu xét nghiệm của bạn
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
              <RefreshCw className={`h-4 w-4 mr-2 ${isFetching ? "animate-spin" : ""}`} />
              Làm mới
            </Button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex flex-wrap gap-6 mt-6 pt-4 border-t border-white/20">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-teal-100 text-sm">
              <Activity className="h-4 w-4" />
              Tổng số
            </div>
            <div className="text-2xl font-bold">{stats.total}</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-teal-100 text-sm">
              <FileText className="h-4 w-4" />
              Đã yêu cầu
            </div>
            <div className="text-2xl font-bold">{stats.ordered}</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-teal-100 text-sm">
              <Clock className="h-4 w-4" />
              Đang xử lý
            </div>
            <div className="text-2xl font-bold">{stats.inProgress}</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-teal-100 text-sm">
              <CheckCircle2 className="h-4 w-4" />
              Hoàn thành
            </div>
            <div className="text-2xl font-bold">{stats.completed}</div>
          </div>
        </div>
      </div>

      {/* Filter Toolbar with View Toggle */}
      <div className="space-y-3 rounded-xl bg-slate-50/80 p-4 border border-slate-200 shadow-sm">
        {/* Row 1: View Toggle + Date Range */}
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
            }}
            theme="teal"
            presetKeys={["all", "today", "7days", "30days", "thisMonth"]}
          />
        </div>

        {/* Row 2: Status Pills + Search */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Pills */}
          <div className="flex gap-2">
            {STATUS_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  setStatusFilter(option.value);
                }}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  statusFilter === option.value
                    ? "bg-teal-600 text-white shadow-md"
                    : "bg-white text-slate-600 hover:bg-slate-100 border"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative flex-1 min-w-[200px] ml-auto">
            <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder="Tìm theo mã phiếu, bác sĩ..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
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
                  <TableHead className="w-12" />
                  <TableHead>Mã phiếu</TableHead>
                  <TableHead>Bác sĩ chỉ định</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ưu tiên</TableHead>
                  <TableHead>Tiến độ</TableHead>
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
                ) : filteredOrders.length > 0 ? (
                  filteredOrders.map((order: LabOrderResponse) => (
                    <LabOrderRow
                      key={order.id}
                      order={order}
                      isExpanded={expandedRows.has(order.id)}
                      onToggle={() => toggleRow(order.id)}
                    />
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="py-12 text-center text-slate-500"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <FlaskConical className="h-10 w-10 text-slate-300" />
                        <span>Không có phiếu xét nghiệm nào</span>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          ) : (
            <TimelineView orders={filteredOrders} isLoading={isLoading} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
