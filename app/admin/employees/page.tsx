"use client";

<<<<<<< HEAD
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Users, Building2 } from "lucide-react";
import { useState } from "react";
import EmployeeCard from "./employee-list/EmployeeCard";
import DepartmentCard from "./department-list/DepartmentCard";

const EmployeesPage = () => {
    const [activeTab, setActiveTab] = useState("employees");

    return (
        <>
            {/* HEADER */}
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h1 className="text-gray-900 mb-2 text-2xl font-bold tracking-tight sm:text-3xl">
                        Quản lý Nhân sự
                    </h1>
                    <p className="text-gray-600">Quản lý nhân viên và khoa phòng</p>
                </div>
            </div>

            {/* TABS */}
            <div className="mt-4 flex w-full flex-col gap-6">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList>
                        <TabsTrigger value="employees" className="gap-2">
                            <Users className="h-4 w-4" />
                            Nhân viên
                        </TabsTrigger>
                        <TabsTrigger value="departments" className="gap-2">
                            <Building2 className="h-4 w-4" />
                            Khoa phòng
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="employees">
                        <EmployeeCard />
                    </TabsContent>
                    <TabsContent value="departments">
                        <DepartmentCard />
                    </TabsContent>
                </Tabs>
            </div>
        </>
    );
};

export default EmployeesPage;
=======
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  Users,
  User,
  Building2,
  Phone,
  Mail,
  Stethoscope,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Grid3X3,
  List,
  UserCheck,
  UserX,
  Clock,
  Loader2,
  Briefcase,
  Calendar,
  Award,
} from "lucide-react";
import { useEmployees, useDeleteEmployee, useDepartments } from "@/hooks/queries/useHr";
import { useDebounce } from "@/hooks/useDebounce";
import { RoleBadge } from "@/app/admin/hr/_components/role-badge";
import { EmployeeStatusBadge } from "@/app/admin/hr/_components/employee-status-badge";
import { Employee, Department, EmployeeRole, EmployeeStatus } from "@/interfaces/hr";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

// Role colors for avatar gradient
const roleGradients: Record<EmployeeRole, string> = {
  DOCTOR: "from-violet-500 to-purple-600",
  NURSE: "from-sky-500 to-blue-600",
  RECEPTIONIST: "from-amber-500 to-orange-600",
  ADMIN: "from-slate-600 to-slate-800",
};

export default function EmployeesPage() {
  const router = useRouter();
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const [search, setSearch] = useState("");
  const [departmentId, setDepartmentId] = useState<string>("ALL");
  const [role, setRole] = useState<string>("ALL");
  const [status, setStatus] = useState<string>("ALL");
  const [viewMode, setViewMode] = useState<"card" | "list">("card");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);

  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading } = useEmployees({
    size: 100,
    search: debouncedSearch || undefined,
    departmentId: departmentId !== "ALL" ? departmentId : undefined,
    role: role !== "ALL" ? role : undefined,
    status: status !== "ALL" ? status : undefined,
    sort: "fullName,asc",
  });

  const { data: departmentsData } = useDepartments({ size: 100 });
  const deleteEmployee = useDeleteEmployee();

  const employees = data?.content ?? [];
  const departments = departmentsData?.content ?? [];
  const totalItems = employees.length;

  // Calculate stats
  const stats = useMemo(() => {
    const active = employees.filter((e: Employee) => e.status === "ACTIVE").length;
    const onLeave = employees.filter((e: Employee) => e.status === "ON_LEAVE").length;
    const resigned = employees.filter((e: Employee) => e.status === "RESIGNED").length;
    const byRole = {
      DOCTOR: employees.filter((e: Employee) => e.role === "DOCTOR").length,
      NURSE: employees.filter((e: Employee) => e.role === "NURSE").length,
      RECEPTIONIST: employees.filter((e: Employee) => e.role === "RECEPTIONIST").length,
      ADMIN: employees.filter((e: Employee) => e.role === "ADMIN").length,
    };
    return { active, onLeave, resigned, byRole };
  }, [employees]);

  const handleDeleteClick = (emp: Employee) => {
    setEmployeeToDelete(emp);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!employeeToDelete) return;
    try {
      await deleteEmployee.mutateAsync(employeeToDelete.id);
      toast.success(`Đã xóa nhân viên "${employeeToDelete.fullName}" thành công`);
      setDeleteDialogOpen(false);
      setEmployeeToDelete(null);
    } catch (error: any) {
      const message = error.response?.data?.error?.code === "HAS_FUTURE_APPOINTMENTS"
        ? "Không thể xóa: Nhân viên có lịch hẹn trong tương lai."
        : "Không thể xóa nhân viên.";
      toast.error(message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 via-purple-500 to-fuchsia-500 p-6 text-white shadow-xl">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
        <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/5" />

        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-white/20 p-3 backdrop-blur-sm">
              <Users className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                Quản lý nhân viên
                <Badge className="bg-white/20 text-white border-0 text-xs">
                  {totalItems} người
                </Badge>
              </h1>
              <p className="mt-1 text-violet-200">
                Quản lý hồ sơ, chức vụ và trạng thái nhân viên
              </p>
            </div>
          </div>

          {isAdmin && (
            <Button
              onClick={() => router.push("/admin/hr/employees/new")}
              className="bg-white text-violet-700 hover:bg-white/90"
            >
              <Plus className="mr-2 h-4 w-4" /> Thêm nhân viên
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <Card className="border-2 border-violet-200 bg-gradient-to-br from-violet-50 to-white">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-violet-100">
                <Users className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-violet-700">{totalItems}</p>
                <p className="text-xs text-muted-foreground">Tổng số</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-white">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-100">
                <UserCheck className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-700">{stats.active}</p>
                <p className="text-xs text-muted-foreground">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-white">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-100">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-700">{stats.onLeave}</p>
                <p className="text-xs text-muted-foreground">Nghỉ phép</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100">
                <Stethoscope className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-700">{stats.byRole.DOCTOR}</p>
                <p className="text-xs text-muted-foreground">Bác sĩ</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-sky-200 bg-gradient-to-br from-sky-50 to-white">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-sky-100">
                <User className="h-5 w-5 text-sky-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-sky-700">{stats.byRole.NURSE}</p>
                <p className="text-xs text-muted-foreground">Y tá</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-white">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-100">
                <Briefcase className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-700">{stats.byRole.RECEPTIONIST}</p>
                <p className="text-xs text-muted-foreground">Lễ tân</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-slate-100">
                <Award className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-700">{stats.byRole.ADMIN}</p>
                <p className="text-xs text-muted-foreground">Admin</p>
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
                placeholder="Tìm kiếm theo tên, email, số điện thoại..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 rounded-xl pl-9 border-2"
              />
            </div>

            <Select value={departmentId} onValueChange={setDepartmentId}>
              <SelectTrigger className="w-40 bg-white border-2">
                <Building2 className="h-4 w-4 mr-2 text-slate-400" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tất cả khoa</SelectItem>
                {departments.map((dept: Department) => (
                  <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="w-36 bg-white border-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tất cả vai trò</SelectItem>
                <SelectItem value="DOCTOR">Bác sĩ</SelectItem>
                <SelectItem value="NURSE">Y tá</SelectItem>
                <SelectItem value="RECEPTIONIST">Lễ tân</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
              </SelectContent>
            </Select>

            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-32 bg-white border-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tất cả</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="ON_LEAVE">Nghỉ phép</SelectItem>
                <SelectItem value="RESIGNED">Đã nghỉ</SelectItem>
              </SelectContent>
            </Select>

            <div className="ml-auto flex items-center gap-1 bg-slate-100 rounded-xl p-1">
              <Button
                variant={viewMode === "card" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("card")}
                className={cn("rounded-lg px-3", viewMode === "card" && "bg-violet-600 hover:bg-violet-700")}
              >
                <Grid3X3 className="h-4 w-4 mr-1" />
                Cards
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={cn("rounded-lg px-3", viewMode === "list" && "bg-violet-600 hover:bg-violet-700")}
              >
                <List className="h-4 w-4 mr-1" />
                List
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Employees Grid/List */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="border-2 border-slate-200">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : viewMode === "card" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {employees.map((emp: Employee) => (
            <Card
              key={emp.id}
              className="border-2 border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group overflow-hidden"
              onClick={() => router.push(`/admin/hr/employees/${emp.id}`)}
            >
              {/* Top gradient bar */}
              <div className={cn("h-1.5 bg-gradient-to-r", roleGradients[emp.role])} />

              <CardContent className="pt-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                      <AvatarImage src={emp.profileImageUrl || undefined} alt={emp.fullName} />
                      <AvatarFallback className={cn("bg-gradient-to-br text-white font-semibold", roleGradients[emp.role])}>
                        {emp.fullName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-slate-800 group-hover:text-violet-700 transition-colors">
                        {emp.fullName}
                      </h3>
                      <RoleBadge role={emp.role} />
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
                        router.push(`/admin/hr/employees/${emp.id}`);
                      }}>
                        <Eye className="h-4 w-4 mr-2" />
                        Xem chi tiết
                      </DropdownMenuItem>
                      {isAdmin && (
                        <>
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/admin/hr/employees/${emp.id}/edit`);
                          }}>
                            <Edit className="h-4 w-4 mr-2" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClick(emp);
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

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Building2 className="h-4 w-4 text-slate-400" />
                    <span className="truncate">{emp.departmentName || "Chưa có khoa"}</span>
                  </div>
                  {emp.specialization && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Stethoscope className="h-4 w-4 text-slate-400" />
                      <span className="truncate">{emp.specialization}</span>
                    </div>
                  )}
                  {emp.phoneNumber && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4 text-slate-400" />
                      <span>{emp.phoneNumber}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                  <EmployeeStatusBadge status={emp.status} />
                  {emp.hiredAt && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(emp.hiredAt), "dd/MM/yyyy")}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {employees.length === 0 && (
            <div className="col-span-full py-12 text-center text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-3 opacity-40" />
              <p>Không tìm thấy nhân viên nào</p>
            </div>
          )}
        </div>
      ) : (
        /* LIST VIEW */
        <Card className="border-2 border-slate-200 shadow-sm overflow-hidden">
          <div className="divide-y divide-slate-200">
            {employees.map((emp: Employee) => (
              <div
                key={emp.id}
                className="flex items-center gap-4 p-4 hover:bg-slate-50 cursor-pointer transition-colors"
                onClick={() => router.push(`/admin/hr/employees/${emp.id}`)}
              >
                <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                  <AvatarImage src={emp.profileImageUrl || undefined} alt={emp.fullName} />
                  <AvatarFallback className={cn("bg-gradient-to-br text-white font-semibold", roleGradients[emp.role])}>
                    {emp.fullName.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-slate-800">{emp.fullName}</h3>
                    <RoleBadge role={emp.role} />
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {emp.departmentName || "Chưa có khoa"} {emp.specialization && `• ${emp.specialization}`}
                  </p>
                </div>

                <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
                  {emp.phoneNumber && (
                    <div className="flex items-center gap-1.5">
                      <Phone className="h-4 w-4" />
                      {emp.phoneNumber}
                    </div>
                  )}
                  <EmployeeStatusBadge status={emp.status} />
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
                        router.push(`/admin/hr/employees/${emp.id}/edit`);
                      }}>
                        <Edit className="h-4 w-4 mr-2" />
                        Chỉnh sửa
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(emp);
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Xóa
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            ))}

            {employees.length === 0 && (
              <div className="py-12 text-center text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-3 opacity-40" />
                <p>Không tìm thấy nhân viên nào</p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa nhân viên</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa nhân viên <strong>{employeeToDelete?.fullName}</strong>? 
              Hành động này không thể hoàn tác. Nếu nhân viên có lịch hẹn trong tương lai, 
              bạn cần hủy các lịch hẹn đó trước.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteEmployee.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
>>>>>>> repoB/master
