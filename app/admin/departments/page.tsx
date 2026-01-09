"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Search,
  Building2,
  MapPin,
  Phone,
  User,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Sparkles,
  Grid3X3,
  List,
  CheckCircle,
  XCircle,
  Users,
  Loader2,
} from "lucide-react";
import { useDepartments, useDeleteDepartment, useEmployees } from "@/hooks/queries/useHr";
import { useDebounce } from "@/hooks/useDebounce";
import { DepartmentStatusBadge } from "@/app/admin/hr/_components/department-status-badge";
import { Department, DepartmentStatus, Employee } from "@/interfaces/hr";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export default function DepartmentsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<DepartmentStatus | "ALL">("ALL");
  const [viewMode, setViewMode] = useState<"card" | "list">("card");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState<Department | null>(null);

  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading } = useDepartments({
    size: 100,
    search: debouncedSearch || undefined,
    status: status === "ALL" ? undefined : status,
    sort: "name,asc",
  });

  const { data: employeesData } = useEmployees({ size: 100 });
  const employees = employeesData?.content ?? [];

  const deleteMutation = useDeleteDepartment();

  const departments = data?.content ?? [];
  const totalItems = departments.length;

  // Calculate stats
  const stats = useMemo(() => {
    const active = departments.filter((d: Department) => d.status === "ACTIVE").length;
    const inactive = departments.filter((d: Department) => d.status === "INACTIVE").length;
    
    // Count employees per department
    const employeeCountsByDept: Record<string, number> = {};
    employees.forEach((emp: Employee) => {
      if (emp.departmentId) {
        employeeCountsByDept[emp.departmentId] = (employeeCountsByDept[emp.departmentId] || 0) + 1;
      }
    });
    
    return { active, inactive, employeeCountsByDept };
  }, [departments, employees]);

  const handleDeleteClick = (dept: Department) => {
    setDepartmentToDelete(dept);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!departmentToDelete) return;
    try {
      await deleteMutation.mutateAsync(departmentToDelete.id);
      toast.success(`Đã xóa khoa "${departmentToDelete.name}" thành công`);
      setDeleteDialogOpen(false);
      setDepartmentToDelete(null);
    } catch (error) {
      toast.error("Không thể xóa khoa có nhân viên đang làm việc");
    }
  };

  const filteredDepartments = departments.filter((dept: Department) => {
    if (debouncedSearch) {
      const searchLower = debouncedSearch.toLowerCase();
      if (!dept.name.toLowerCase().includes(searchLower)) {
        return false;
      }
    }
    if (status !== "ALL" && dept.status !== status) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-teal-600 via-cyan-500 to-emerald-500 p-6 text-white shadow-xl">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
        <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/5" />

        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-white/20 p-3 backdrop-blur-sm">
              <Building2 className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                Quản lý khoa phòng
                <Badge className="bg-white/20 text-white border-0 text-xs">
                  {totalItems} khoa
                </Badge>
              </h1>
              <p className="mt-1 text-teal-100">
                Quản lý các khoa trong bệnh viện
              </p>
            </div>
          </div>

          {isAdmin && (
            <Button
              onClick={() => router.push("/admin/hr/departments/new")}
              className="bg-white text-teal-700 hover:bg-white/90"
            >
              <Plus className="mr-2 h-4 w-4" /> Thêm khoa mới
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-2 border-teal-200 bg-gradient-to-br from-teal-50 to-white">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-teal-100">
                <Building2 className="h-5 w-5 text-teal-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-teal-700">{totalItems}</p>
                <p className="text-xs text-muted-foreground">Tổng số khoa</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-white">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-100">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-700">{stats.active}</p>
                <p className="text-xs text-muted-foreground">Đang hoạt động</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-slate-100">
                <XCircle className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-700">{stats.inactive}</p>
                <p className="text-xs text-muted-foreground">Ngừng hoạt động</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-sky-200 bg-gradient-to-br from-sky-50 to-white">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-sky-100">
                <Users className="h-5 w-5 text-sky-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-sky-700">{employees.length}</p>
                <p className="text-xs text-muted-foreground">Tổng nhân viên</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-2 border-slate-200 shadow-sm">
        <CardContent className="py-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
              <Input
                placeholder="Tìm kiếm khoa..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 rounded-xl pl-9 border-2"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setStatus("ALL")}
                className={cn(
                  "px-3 py-1.5 rounded-full text-sm font-medium transition-all",
                  status === "ALL"
                    ? "bg-teal-600 text-white shadow-md"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                )}
              >
                Tất cả
              </button>
              <button
                onClick={() => setStatus("ACTIVE")}
                className={cn(
                  "px-3 py-1.5 rounded-full text-sm font-medium transition-all",
                  status === "ACTIVE"
                    ? "bg-emerald-600 text-white shadow-md"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                )}
              >
                Hoạt động ({stats.active})
              </button>
              <button
                onClick={() => setStatus("INACTIVE")}
                className={cn(
                  "px-3 py-1.5 rounded-full text-sm font-medium transition-all",
                  status === "INACTIVE"
                    ? "bg-slate-600 text-white shadow-md"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                )}
              >
                Ngừng ({stats.inactive})
              </button>
            </div>

            <div className="ml-auto flex items-center gap-1 bg-slate-100 rounded-xl p-1">
              <Button
                variant={viewMode === "card" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("card")}
                className={cn("rounded-lg px-3", viewMode === "card" && "bg-teal-600 hover:bg-teal-700")}
              >
                <Grid3X3 className="h-4 w-4 mr-1" />
                Cards
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={cn("rounded-lg px-3", viewMode === "list" && "bg-teal-600 hover:bg-teal-700")}
              >
                <List className="h-4 w-4 mr-1" />
                List
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Departments Grid/List */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="border-2 border-slate-200">
              <CardContent className="pt-6">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : viewMode === "card" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDepartments.map((dept: Department) => {
            const employeeCount = stats.employeeCountsByDept[dept.id] || 0;
            return (
              <Card
                key={dept.id}
                className={cn(
                  "border-2 shadow-sm hover:shadow-md transition-all cursor-pointer group overflow-hidden",
                  dept.status === "ACTIVE" ? "border-teal-200 hover:border-teal-300" : "border-slate-200 hover:border-slate-300"
                )}
                onClick={() => router.push(`/admin/hr/departments/${dept.id}`)}
              >
                {/* Top gradient bar */}
                <div className={cn(
                  "h-1.5",
                  dept.status === "ACTIVE" 
                    ? "bg-gradient-to-r from-teal-500 to-emerald-500" 
                    : "bg-gradient-to-r from-slate-400 to-slate-500"
                )} />

                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "p-2 rounded-lg",
                        dept.status === "ACTIVE" ? "bg-teal-100" : "bg-slate-100"
                      )}>
                        <Building2 className={cn(
                          "h-5 w-5",
                          dept.status === "ACTIVE" ? "text-teal-600" : "text-slate-600"
                        )} />
                      </div>
                      <div>
                        <CardTitle className="text-lg group-hover:text-teal-700 transition-colors">
                          {dept.name}
                        </CardTitle>
                        <DepartmentStatusBadge status={dept.status} />
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/admin/hr/departments/${dept.id}`);
                        }}>
                          <Eye className="h-4 w-4 mr-2" />
                          Xem chi tiết
                        </DropdownMenuItem>
                        {isAdmin && (
                          <>
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/admin/hr/departments/${dept.id}/edit`);
                            }}>
                              <Edit className="h-4 w-4 mr-2" />
                              Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClick(dept);
                              }}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Xóa
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  {dept.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {dept.description}
                    </p>
                  )}

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4 text-slate-400" />
                      <span className="truncate">{dept.location || "Chưa có"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4 text-slate-400" />
                      <span>{dept.phoneExtension || "N/A"}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-slate-400" />
                      <span className="text-sm">
                        {dept.headDoctorName ? (
                          <span className="font-medium text-slate-800">{dept.headDoctorName}</span>
                        ) : (
                          <span className="text-muted-foreground">Chưa có trưởng khoa</span>
                        )}
                      </span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      <Users className="h-3 w-3 mr-1" />
                      {employeeCount} NV
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {filteredDepartments.length === 0 && (
            <div className="col-span-full py-12 text-center text-muted-foreground">
              <Building2 className="h-12 w-12 mx-auto mb-3 opacity-40" />
              <p>Không tìm thấy khoa phòng nào</p>
            </div>
          )}
        </div>
      ) : (
        /* LIST VIEW */
        <Card className="border-2 border-slate-200 shadow-sm overflow-hidden">
          <div className="divide-y divide-slate-200">
            {filteredDepartments.map((dept: Department) => {
              const employeeCount = stats.employeeCountsByDept[dept.id] || 0;
              return (
                <div
                  key={dept.id}
                  className="flex items-center gap-4 p-4 hover:bg-slate-50 cursor-pointer transition-colors"
                  onClick={() => router.push(`/admin/hr/departments/${dept.id}`)}
                >
                  <div className={cn(
                    "p-2 rounded-lg",
                    dept.status === "ACTIVE" ? "bg-teal-100" : "bg-slate-100"
                  )}>
                    <Building2 className={cn(
                      "h-5 w-5",
                      dept.status === "ACTIVE" ? "text-teal-600" : "text-slate-600"
                    )} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-slate-800">{dept.name}</h3>
                      <DepartmentStatusBadge status={dept.status} />
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {dept.description || "Không có mô tả"}
                    </p>
                  </div>

                  <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" />
                      {dept.location || "N/A"}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <User className="h-4 w-4" />
                      {dept.headDoctorName || "Chưa có trưởng khoa"}
                    </div>
                    <Badge variant="secondary">
                      {employeeCount} NV
                    </Badge>
                  </div>

                  {isAdmin && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/admin/hr/departments/${dept.id}/edit`);
                        }}>
                          <Edit className="h-4 w-4 mr-2" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(dept);
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              );
            })}

            {filteredDepartments.length === 0 && (
              <div className="py-12 text-center text-muted-foreground">
                <Building2 className="h-12 w-12 mx-auto mb-3 opacity-40" />
                <p>Không tìm thấy khoa phòng nào</p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa khoa phòng</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa khoa "{departmentToDelete?.name}"? 
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
