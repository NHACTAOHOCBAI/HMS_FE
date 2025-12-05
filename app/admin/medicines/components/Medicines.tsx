"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// Giả định hook này trả về dữ liệu phân trang (page, limit, totalPages, content)
import { useMedicines } from "@/hooks/queries/useMedicine";
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Search,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { MedicineResponse } from "@/interfaces/medicine";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
// import CategoryDialog from "@/app/admin/medicines/components/CategoryDialog"; // Giữ nguyên
import MedicineDialog from "@/app/admin/medicines/components/MedicineDialog"; // Giữ nguyên
import PaginatedTable from "@/app/admin/_components/PaginatedTable";

// --- UTILITY FUNCTIONS ---
// --- TYPES & COMPONENT ---

export type MedicineFiltersState = {
  search: string;
  categoryId: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
  page: number; // One-based: Trang 1, 2, 3...
  limit: number;
};
interface MedicinesProps {
  setIsMedicineModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isMedicineModalOpen: boolean;
}
const Medicines = ({
  setIsMedicineModalOpen,
  isMedicineModalOpen,
}: MedicinesProps) => {
  const [editingMedicine, setEditingMedicine] =
    useState<MedicineResponse | null>(null);

  const [filters, setFilters] = useState<MedicineFiltersState>({
    search: "",
    categoryId: "",
    sortBy: "createdAt",
    sortOrder: "desc",
    page: 1, // Bắt đầu từ trang 1
    limit: 6,
  });

  const handleOpenMedicineModal = (medicine?: MedicineResponse) => {
    if (medicine) {
      setEditingMedicine(medicine);
    } else {
      setEditingMedicine(null);
    }
    setIsMedicineModalOpen(true);
  };

  // Hook dùng query param filters
  const { data: medicines, isLoading: isLoadingMedicines } =
    useMedicines(filters);

  // Lấy tổng số trang để dùng cho logic disabled/hiển thị phân trang
  const totalPages = medicines?.data?.totalPages || 0;
  const header = [
    "Tên thuốc",
    "Hoạt chất",
    "Danh mục",
    "Tồn kho",
    "Giá bán",
    "Hạn dùng",
    "Thao tác",
  ];
  const rows = (medicine: MedicineResponse) => (
    <TableRow key={medicine.id}>
      <TableCell className="font-medium text-gray-900">
        {medicine.name}
      </TableCell>

      <TableCell>{medicine.activeIngredient}</TableCell>

      <TableCell>
        <Badge variant="outline" className="bg-gray-50">
          {medicine.category?.name ?? "Chưa phân loại"}
        </Badge>
      </TableCell>

      <TableCell>{medicine.quantity}</TableCell>

      <TableCell>{medicine.sellingPrice.toLocaleString("vi-VN")} ₫</TableCell>

      <TableCell>
        {format(new Date(medicine.expiresAt), "dd/MM/yyyy")}
      </TableCell>

      <TableCell className="text-right">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleOpenMedicineModal(medicine)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
  return (
    <div>
      {/* Search and Filter Section */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-lg border shadow-sm">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm thuốc, hoạt chất..."
            className="pl-9"
            value={filters.search}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                search: e.target.value,
                page: 1, // reset page khi search
              }))
            }
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            Lọc theo:
          </span>
          <Select
            // Sử dụng filters.categoryId nếu muốn hiển thị giá trị đang chọn
            value={filters.categoryId || "all"}
            onValueChange={(value) => {
              setFilters((prev) => ({
                ...prev,
                categoryId: value === "all" ? "" : value, // Nếu chọn "Tất cả", đặt categoryId là ""
                page: 1, // Reset về trang đầu tiên khi filter
              }));
            }}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Tất cả danh mục" />
            </SelectTrigger>
            <SelectContent>
              {/* Tùy chọn "Tất cả" */}
              <SelectItem value="all">
                Tất cả
                {/* Có thể hiển thị tổng số lượng nếu API có trả về totalElements */}
              </SelectItem>
              {/* Danh sách các danh mục - hiện đang bị comment, cần hook useCategories */}
              {/* {categories?.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id.toString()}>
                    {cat.name}
                  </SelectItem>
                ))} */}
            </SelectContent>
          </Select>
        </div>
      </div>

      <PaginatedTable
        columns={header}
        data={medicines?.data.content || []}
        page={filters.page}
        totalPages={totalPages}
        onPageChange={(p) => setFilters((prev) => ({ ...prev, page: p }))}
        isLoading={isLoadingMedicines}
        emptyMessage="Không tìm thấy thuốc nào."
        renderRow={rows}
      />

      {/* Medicine Dialog/Modal */}
      <MedicineDialog
        isMedicineModalOpen={isMedicineModalOpen}
        setIsMedicineModalOpen={setIsMedicineModalOpen}
        editingMedicine={editingMedicine}
        setEditingMedicine={setEditingMedicine}
        categories={[]} // Cần truyền categories thực tế từ hook useCategories
      />
    </div>
  );
};
export default Medicines;
