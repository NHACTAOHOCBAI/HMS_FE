"use client";

import { useState } from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  FileText,
  Search,
  Eye,
  ImagePlus,
  CheckCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { useLabResults } from "@/hooks/queries/useLab";
import { LabTestResult, ResultStatus, LabTestCategory } from "@/services/lab.service";

const statusConfig: Record<ResultStatus, { label: string; icon: React.ElementType; color: string }> = {
  PENDING: { label: "Chờ xử lý", icon: Clock, color: "bg-yellow-100 text-yellow-800" },
  PROCESSING: { label: "Đang thực hiện", icon: Clock, color: "bg-blue-100 text-blue-800" },
  COMPLETED: { label: "Hoàn thành", icon: CheckCircle, color: "bg-green-100 text-green-800" },
  CANCELLED: { label: "Đã hủy", icon: AlertTriangle, color: "bg-red-100 text-red-800" },
};

const categoryLabels: Record<LabTestCategory, string> = {
  LAB: "Xét nghiệm",
  IMAGING: "Hình ảnh",
  PATHOLOGY: "Giải phẫu bệnh",
};

interface LabResultsListProps {
  basePath: string; // "/admin/lab-results" or "/doctor/lab-results"
  patientId?: string;
  showPatientColumn?: boolean;
}

export function LabResultsList({
  basePath,
  patientId,
  showPatientColumn = true,
}: LabResultsListProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ResultStatus | "ALL">("ALL");

  const { data, isLoading } = useLabResults({ page: 0, size: 100 });
  const results: LabTestResult[] = data?.content || [];

  // Filter results
  const filteredResults = results.filter((result) => {
    const matchesSearch =
      result.patientName?.toLowerCase().includes(search.toLowerCase()) ||
      result.labTestName.toLowerCase().includes(search.toLowerCase()) ||
      result.labTestCode.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || result.status === statusFilter;
    const matchesPatient = !patientId || result.patientId === patientId;
    return matchesSearch && matchesStatus && matchesPatient;
  });

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: vi });
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Bộ lọc</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm theo tên bệnh nhân hoặc xét nghiệm..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(v) => setStatusFilter(v as ResultStatus | "ALL")}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tất cả</SelectItem>
                <SelectItem value="PENDING">Chờ xử lý</SelectItem>
                <SelectItem value="PROCESSING">Đang thực hiện</SelectItem>
                <SelectItem value="COMPLETED">Hoàn thành</SelectItem>
                <SelectItem value="CANCELLED">Đã hủy</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                {showPatientColumn && <TableHead>Bệnh nhân</TableHead>}
                <TableHead>Loại xét nghiệm</TableHead>
                <TableHead>Mã</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Kết quả</TableHead>
                <TableHead>Bất thường</TableHead>
                <TableHead>Ảnh</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: showPatientColumn ? 9 : 8 }).map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : filteredResults.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={showPatientColumn ? 9 : 8}
                    className="text-center py-8 text-muted-foreground"
                  >
                    Không tìm thấy kết quả xét nghiệm nào
                  </TableCell>
                </TableRow>
              ) : (
                filteredResults.map((result) => {
                  const statusInfo = statusConfig[result.status];
                  const StatusIcon = statusInfo.icon;
                  return (
                    <TableRow key={result.id}>
                      {showPatientColumn && (
                        <TableCell className="font-medium">{result.patientName}</TableCell>
                      )}
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{result.labTestName}</span>
                          <span className="text-xs text-muted-foreground">
                            {categoryLabels[result.labTestCategory]}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{result.labTestCode}</TableCell>
                      <TableCell>
                        <Badge className={statusInfo.color}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusInfo.label}
                        </Badge>
                      </TableCell>
                      <TableCell>{result.resultValue || "-"}</TableCell>
                      <TableCell>
                        {result.isAbnormal ? (
                          <Badge variant="destructive">Bất thường</Badge>
                        ) : result.status === "COMPLETED" ? (
                          <Badge variant="secondary">Bình thường</Badge>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>
                        {result.images?.length > 0 ? (
                          <Badge variant="outline">
                            <ImagePlus className="h-3 w-3 mr-1" />
                            {result.images.length}
                          </Badge>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(result.createdAt)}
                      </TableCell>
                      <TableCell>
                        <Link href={`${basePath}/${result.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            Chi tiết
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
