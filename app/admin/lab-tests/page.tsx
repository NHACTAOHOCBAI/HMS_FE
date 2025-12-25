"use client";

import { useState } from "react";
import { FlaskConical, Plus, Search, Edit, Trash2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useLabTests,
  useCreateLabTest,
  useUpdateLabTest,
  useDeleteLabTest,
} from "@/hooks/queries/useLab";
import { LabTest, LabTestCategory, LabTestCreateRequest } from "@/services/lab.service";

const categoryLabels: Record<LabTestCategory, string> = {
  LAB: "Xét nghiệm",
  IMAGING: "Chẩn đoán hình ảnh",
  PATHOLOGY: "Giải phẫu bệnh",
};

const categoryColors: Record<LabTestCategory, string> = {
  LAB: "bg-blue-100 text-blue-800",
  IMAGING: "bg-purple-100 text-purple-800",
  PATHOLOGY: "bg-orange-100 text-orange-800",
};

export default function LabTestsPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<LabTestCategory | "ALL">("ALL");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingTest, setEditingTest] = useState<LabTest | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<LabTestCreateRequest>>({
    code: "",
    name: "",
    category: "LAB",
    description: "",
    price: 0,
    unit: "",
    normalRange: "",
    isActive: true,
  });

  const { data, isLoading } = useLabTests({ page: 0, size: 100 });
  const createMutation = useCreateLabTest();
  const updateMutation = useUpdateLabTest();
  const deleteMutation = useDeleteLabTest();

  const labTests: LabTest[] = data?.content || [];

  // Filter tests
  const filteredTests = labTests.filter((test) => {
    const matchesSearch =
      test.name.toLowerCase().includes(search.toLowerCase()) ||
      test.code.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "ALL" || test.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleOpenCreate = () => {
    setFormData({
      code: "",
      name: "",
      category: "LAB",
      description: "",
      price: 0,
      unit: "",
      normalRange: "",
      isActive: true,
    });
    setIsCreateOpen(true);
  };

  const handleOpenEdit = (test: LabTest) => {
    setFormData({
      code: test.code,
      name: test.name,
      category: test.category,
      description: test.description || "",
      price: test.price,
      unit: test.unit || "",
      normalRange: test.normalRange || "",
      isActive: test.isActive,
    });
    setEditingTest(test);
  };

  const handleSubmit = async () => {
    if (editingTest) {
      await updateMutation.mutateAsync({ id: editingTest.id, data: formData });
      setEditingTest(null);
    } else {
      await createMutation.mutateAsync(formData as LabTestCreateRequest);
      setIsCreateOpen(false);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteMutation.mutateAsync(id);
    setDeleteConfirm(null);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="page-header">
          <h1>
            <FlaskConical className="h-6 w-6 text-teal-500" />
            Quản lý Loại Xét nghiệm
          </h1>
          <p>Quản lý danh mục các loại xét nghiệm, chẩn đoán hình ảnh</p>
        </div>
        <Button onClick={handleOpenCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Thêm loại xét nghiệm
        </Button>
      </div>

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
                placeholder="Tìm theo tên hoặc mã..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select
              value={categoryFilter}
              onValueChange={(v) => setCategoryFilter(v as LabTestCategory | "ALL")}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Loại" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tất cả</SelectItem>
                <SelectItem value="LAB">Xét nghiệm</SelectItem>
                <SelectItem value="IMAGING">Chẩn đoán hình ảnh</SelectItem>
                <SelectItem value="PATHOLOGY">Giải phẫu bệnh</SelectItem>
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
                <TableHead>Mã</TableHead>
                <TableHead>Tên xét nghiệm</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Giá</TableHead>
                <TableHead>Đơn vị</TableHead>
                <TableHead>Khoảng bình thường</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 8 }).map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : filteredTests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    Không tìm thấy loại xét nghiệm nào
                  </TableCell>
                </TableRow>
              ) : (
                filteredTests.map((test) => (
                  <TableRow key={test.id}>
                    <TableCell className="font-mono text-sm">{test.code}</TableCell>
                    <TableCell className="font-medium">{test.name}</TableCell>
                    <TableCell>
                      <Badge className={categoryColors[test.category]}>
                        {categoryLabels[test.category]}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatPrice(test.price)}</TableCell>
                    <TableCell>{test.unit || "-"}</TableCell>
                    <TableCell>{test.normalRange || "-"}</TableCell>
                    <TableCell>
                      <Badge variant={test.isActive ? "default" : "secondary"}>
                        {test.isActive ? "Hoạt động" : "Ngừng"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleOpenEdit(test)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setDeleteConfirm(test.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isCreateOpen || !!editingTest} onOpenChange={(open) => {
        if (!open) {
          setIsCreateOpen(false);
          setEditingTest(null);
        }
      }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingTest ? "Chỉnh sửa loại xét nghiệm" : "Thêm loại xét nghiệm mới"}
            </DialogTitle>
            <DialogDescription>
              {editingTest
                ? "Cập nhật thông tin loại xét nghiệm"
                : "Nhập thông tin cho loại xét nghiệm mới"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">Mã xét nghiệm *</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="VD: CBC, XRAY_CHEST"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Loại *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(v) => setFormData({ ...formData, category: v as LabTestCategory })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LAB">Xét nghiệm</SelectItem>
                    <SelectItem value="IMAGING">Chẩn đoán hình ảnh</SelectItem>
                    <SelectItem value="PATHOLOGY">Giải phẫu bệnh</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Tên xét nghiệm *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="VD: Công thức máu, X-Quang ngực"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Giá (VND) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit">Đơn vị</Label>
                <Input
                  id="unit"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  placeholder="VD: mg/dL, cells/μL"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="normalRange">Khoảng bình thường</Label>
              <Input
                id="normalRange"
                value={formData.normalRange}
                onChange={(e) => setFormData({ ...formData, normalRange: e.target.value })}
                placeholder="VD: 4.5-11.0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Mô tả chi tiết về xét nghiệm..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateOpen(false);
                setEditingTest(null);
              }}
            >
              Hủy
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {editingTest ? "Cập nhật" : "Tạo mới"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa loại xét nghiệm này? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
              disabled={deleteMutation.isPending}
            >
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
