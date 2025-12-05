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
import CategoryDialog from "@/app/admin/medicines/components/CategoryDialog";
import MedicineDialog from "@/app/admin/medicines/components/MedicineDialog";
const isExpiringSoon = (expiresAt: string) => {
  const today = new Date();
  const expiryDate = new Date(expiresAt);
  const daysUntilExpiry = Math.ceil(
    (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );
  return daysUntilExpiry <= 30 && daysUntilExpiry >= 0;
};

const isExpired = (expiresAt: string) => {
  return new Date(expiresAt) < new Date();
};
export type MedicineFiltersState = {
  search: string;
  categoryId: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
  page: number;
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
    page: 1,
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
  const { data: medicines, isLoading: isLoadingMedicines } =
    useMedicines(filters);
  return (
    <div>
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
            // value={filters.categoryId}
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
                Tất cả ({medicines?.data.content.length || 0})
              </SelectItem>
              {/* Danh sách các danh mục */}
              {/* {categories?.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id.toString()}>
                    {cat.name}
                  </SelectItem>
                ))} */}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="rounded-md border bg-white shadow-sm overflow-hidden mt-2">
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
            {medicines?.data.content.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="h-24 text-center text-muted-foreground"
                >
                  Không tìm thấy thuốc nào.
                </TableCell>
              </TableRow>
            ) : (
              medicines?.data.content.map((medicine) => (
                <TableRow key={medicine.id}>
                  <TableCell className="font-medium text-gray-900">
                    {medicine.name}
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {medicine.activeIngredient}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-gray-50">
                      {medicine.category?.name ?? "Chưa phân loại"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span
                      className={
                        medicine.quantity < 10
                          ? "text-red-600 font-bold"
                          : "text-gray-700"
                      }
                    >
                      {medicine.quantity}
                    </span>
                  </TableCell>

                  <TableCell className="font-medium">
                    {medicine.sellingPrice.toLocaleString("vi-VN")} ₫
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm ${
                          isExpired(medicine.expiresAt)
                            ? "text-red-600 font-medium"
                            : isExpiringSoon(medicine.expiresAt)
                            ? "text-amber-600 font-medium"
                            : "text-gray-600"
                        }`}
                      >
                        {format(new Date(medicine.expiresAt), "dd/MM/yyyy")}
                      </span>
                      {(isExpired(medicine.expiresAt) ||
                        isExpiringSoon(medicine.expiresAt)) && (
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        onClick={() => handleOpenMedicineModal(medicine)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                        // onClick={() => onDelete(medicine.id)}
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
        {/* Pagination */}
        <div className="flex items-center space-x-2">
          <Button
            size="icon"
            className="border-app-primary-blue-500 border"
            disabled={medicines?.data.page === 1}
            // onClick={() => onPageChange( medicines?.data.page-1 - 1)}
            onClick={() =>
              setFilters((prev) => ({
                ...prev,
                page: medicines?.data.page - 1,
              }))
            }
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex space-x-1">
            {getPaginationNumbers(
              medicines?.data.page - 1,
              medicines?.data.totalPages || 0
            ).map((p, idx) =>
              p === "..." ? (
                <span
                  key={idx}
                  className="flex items-center px-2 text-gray-500"
                >
                  ...
                </span>
              ) : (
                <Button
                  key={idx}
                  size="icon"
                  variant={
                    p === medicines?.data.page - 1 ? "default" : "outline"
                  }
                  className={
                    p === medicines?.data.page - 1
                      ? "border-app-primary-blue-500 border bg-white text-app-primary-blue-700"
                      : " border"
                  }
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      page: p as number,
                    }))
                  }
                >
                  {p}
                </Button>
              )
            )}
          </div>

          <Button
            size="icon"
            className="border-app-primary-blue-500 border"
            disabled={medicines?.data.page - 1 === medicines?.data.totalPages}
            onClick={() =>
              setFilters((prev) => ({
                ...prev,
                page: medicines?.data.page - 1 + 1,
              }))
            }
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <MedicineDialog
        isMedicineModalOpen={isMedicineModalOpen}
        setIsMedicineModalOpen={setIsMedicineModalOpen}
        editingMedicine={editingMedicine}
        setEditingMedicine={setEditingMedicine}
        categories={[]}
      />
    </div>
  );
};
export default Medicines;
function getPaginationNumbers(current: number, total: number) {
  const pages: (number | string)[] = [];

  // Trang 1
  pages.push(1);

  // "..." trước khi tới  medicines?.data.page-1-1
  if (current > 3) {
    pages.push("...");
  }

  // current-1
  if (current > 2) {
    pages.push(current - 1);
  }

  // current
  if (current !== 1 && current !== total) {
    pages.push(current);
  }

  // current+1
  if (current < total - 1) {
    pages.push(current + 1);
  }

  // "..." sau current+1
  if (current < total - 2) {
    pages.push("...");
  }

  // Trang cuối
  if (total > 1) {
    pages.push(total);
  }

  return pages;
}
//   {
//     /* Pagination */
//   }
//   <div className="flex items-center space-x-2">
//     <Button
//       size="icon"
//       className="border-app-primary-blue-500 border"
//       disabled={ medicines?.data.page-1 === 1}
//       onClick={() => onPageChange( medicines?.data.page-1 - 1)}
//     >
//       <ChevronLeft className="h-4 w-4" />
//     </Button>

//     <div className="flex space-x-1">
//       {getPaginationNumbers( medicines?.data.page-1, totalPages).map((p, idx) =>
//         p === "..." ? (
//           <span key={idx} className="flex items-center px-2 text-gray-500">
//             ...
//           </span>
//         ) : (
//           <Button
//             key={idx}
//             size="icon"
//             variant={p ===  medicines?.data.page-1 ? "default" : "outline"}
//             className={
//               p ===  medicines?.data.page-1
//                 ? "border-app-primary-blue-500 border bg-white text-app-primary-blue-700"
//                 : " border"
//             }
//             onClick={() => onPageChange(p as number)}
//           >
//             {p}
//           </Button>
//         )
//       )}
//     </div>

//     <Button
//       size="icon"
//       className="border-app-primary-blue-500 border"
//       disabled={ medicines?.data.page-1 === totalPages}
//       onClick={() => onPageChange( medicines?.data.page-1 + 1)}
//     >
//       <ChevronRight className="h-4 w-4" />
//     </Button>
//   </div>;
