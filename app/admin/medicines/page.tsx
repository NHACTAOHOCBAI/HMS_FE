
"use client";

import { useState, useEffect } from "react";
import * as z from "zod";
import { format } from "date-fns";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  AlertCircle,
  Pill,
  Tag,
  MoreHorizontal
} from "lucide-react";

// --- SHADCN IMPORTS (Giả định bạn đã cài đặt đủ) ---
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useMedicines } from "@/hooks/queries/useMedicine";
import { useCategories } from "@/hooks/queries/useCategory";
import { MedicineResponse } from "@/interfaces/medicine";
import { Category } from "@/interfaces/category";
import MedicineDialog from "./components/MedicineDialog";
import CategoryDialog from "./components/CategoryDialog";
export default function Medicine() {
  const [activeTab, setActiveTab] = useState<"medicines" | "categories">("medicines");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("all");
  // Data States
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6);

  const { data: medicines } = useMedicines(page, limit);
  const { data: categories } = useCategories();
  // Modal State
  const [isMedicineModalOpen, setIsMedicineModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingMedicineId, setEditingMedicineId] = useState<string | null>(null);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);

  // Filtered Medicines based on search and category filter
  const filteredMedicines = medicines;
  const filteredCategories = categories;
  //helper functions
  const isExpiringSoon = (expiresAt: string) => {
    const today = new Date();
    const expiryDate = new Date(expiresAt);
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry >= 0;
  };

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date();
  };
  // Medicine Actions
  const handleOpenMedicineModal = (medicine?: MedicineResponse) => {

    setIsMedicineModalOpen(true);
  };


  const handleOpenCategoryModal = (category?: Category) => {
    setIsCategoryModalOpen(true);
  }
  return (
    <div className="space-y-6 p-6 bg-gray-50/50 min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Quản lý Thuốc</h1>
          <p className="text-muted-foreground">Theo dõi kho thuốc và danh mục phân loại</p>
        </div>
        <Button
          onClick={() => activeTab === "medicines" ? handleOpenMedicineModal() : handleOpenCategoryModal()}
          className="bg-blue-600 hover:bg-blue-700 shadow-sm"
        >
          <Plus className="mr-2 h-4 w-4" />
          {activeTab === "medicines" ? "Thêm thuốc" : "Thêm danh mục"}
        </Button>
      </div>

      {/* MAIN CONTENT TABS */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "medicines" | "categories")} className="w-full space-y-6">
        <div className="flex items-center justify-between border-b pb-2">
          <TabsList>
            <TabsTrigger value="medicines" className="gap-2 px-4">
              <Pill className="h-4 w-4" />
              Thuốc
            </TabsTrigger>
            <TabsTrigger value="categories" className="gap-2 px-4">
              <Tag className="h-4 w-4" />
              Danh mục
            </TabsTrigger>
          </TabsList>
        </div>

        {/* FILTERS BAR */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-lg border shadow-sm">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={activeTab === "medicines" ? "Tìm thuốc, hoạt chất..." : "Tìm danh mục..."}
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {activeTab === "medicines" && (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-sm text-muted-foreground whitespace-nowrap">Lọc theo:</span>
              <Select value={selectedCategoryFilter} onValueChange={setSelectedCategoryFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Tất cả danh mục" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả ({medicines && medicines.items.length})</SelectItem>
                  {categories && categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.name}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* MEDICINES TAB CONTENT */}
        <TabsContent value="medicines" className="m-0">
          <div className="rounded-md border bg-white shadow-sm overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead>Tên thuốc</TableHead>
                  <TableHead>Hoạt chất</TableHead>
                  <TableHead>Danh mục</TableHead>
                  <TableHead>Tồn kho</TableHead>
                  <TableHead>Giá bán</TableHead>
                  <TableHead>Hạn dùng</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMedicines?.items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                      Không tìm thấy thuốc nào.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMedicines?.items.map((medicine) => (
                    <TableRow key={medicine.id}>
                      <TableCell className="font-medium text-gray-900">{medicine.name}</TableCell>
                      <TableCell className="text-gray-500">{medicine.activeIngredient}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-gray-50">
                          {medicine.category?.name ?? "Chưa phân loại"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className={medicine.quantity < 10 ? "text-red-600 font-bold" : "text-gray-700"}>
                          {medicine.quantity}
                        </span>
                      </TableCell>

                      <TableCell className="font-medium">
                        {medicine.sellingPrice.toLocaleString("vi-VN")} ₫
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm ${isExpired(medicine.expiresAt) ? "text-red-600 font-medium" :
                            isExpiringSoon(medicine.expiresAt) ? "text-amber-600 font-medium" : "text-gray-600"
                            }`}>
                            {format(new Date(medicine.expiresAt), "dd/MM/yyyy")}
                          </span>
                          {(isExpired(medicine.expiresAt) || isExpiringSoon(medicine.expiresAt)) && (
                            <AlertCircle className="w-4 h-4 text-red-500" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost" size="icon"
                            className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            onClick={() => handleOpenMedicineModal(medicine)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost" size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => onDelete(medicine.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* CATEGORIES TAB CONTENT */}
        <TabsContent value="categories" className="m-0">
          <div className="rounded-md border bg-white shadow-sm overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="w-[300px]">Tên danh mục</TableHead>
                  <TableHead>Mô tả</TableHead>
                  <TableHead className="w-[150px]">Số lượng thuốc</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories && filteredCategories.map((category) => {
                  const count = medicines?.items.filter(m => m.category?.id === category.id).length;
                  return (
                    <TableRow key={category.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                            <Tag className="h-4 w-4" />
                          </div>
                          <span className="font-medium text-gray-900">{category.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-500">{category.description}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="hover:bg-blue-100 bg-blue-50 text-blue-700 border-blue-200">
                          {count} thuốc
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost" size="icon"
                            className="h-8 w-8 text-blue-600 hover:bg-blue-50"
                            onClick={() => handleOpenCategoryModal(category)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost" size="icon"
                            className="h-8 w-8 text-red-500 hover:bg-red-50"
                            onClick={() => handleDeleteCategoryConfirm(category.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
      {/* ---- MEDICINE DIALOG (FORM) --- */}
      <MedicineDialog isMedicineModalOpen={isMedicineModalOpen} setIsMedicineModalOpen={setIsMedicineModalOpen}
        editingMedicineId={editingMedicineId} categories={categories} />

      {/* --- CATEGORY DIALOG (FORM) --- */}
      <CategoryDialog isCategoryModalOpen={isCategoryModalOpen} setIsCategoryModalOpen={setIsCategoryModalOpen}
        editingCategoryId={editingCategoryId} />
    </div>

  );
}