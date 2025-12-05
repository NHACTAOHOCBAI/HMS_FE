"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";

// Hàm tạo danh sách trang
function getPaginationNumbers(currentPage: number, totalPages: number) {
  const pages: (number | string)[] = [];

  if (totalPages <= 1) return [];

  pages.push(1);

  let start = Math.max(2, currentPage - 1);
  let end = Math.min(totalPages - 1, currentPage + 1);

  if (start > 2) pages.push("...");
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < totalPages - 1) pages.push("...");
  pages.push(totalPages);

  return pages;
}

export interface PaginatedTableProps {
  columns: string[];
  data: any[];
  renderRow: (item: any) => React.ReactNode;

  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;

  isLoading?: boolean;
  emptyMessage?: string;
}

const PaginatedTable = ({
  columns,
  data,
  renderRow,
  page,
  totalPages,
  onPageChange,
  isLoading = false,
  emptyMessage = "Không có dữ liệu",
}: PaginatedTableProps) => {
  return (
    <div>
      <div className="rounded-md border bg-white shadow-sm overflow-hidden mt-2">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              {columns.map((col, idx) => (
                <TableHead key={idx}>{col}</TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  Đang tải dữ liệu...
                </TableCell>
              </TableRow>
            )}

            {!isLoading && data.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}

            {!isLoading &&
              data.length > 0 &&
              data.map((item) => renderRow(item))}
          </TableBody>
        </Table>
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-end items-center px-4 py-2 mt-[10px]">
          <span className="text-sm text-muted-foreground mr-4">
            Trang {page} / {totalPages}
          </span>

          <Button
            size="icon"
            variant="outline"
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex space-x-1 mx-2">
            {getPaginationNumbers(page, totalPages).map((p, idx) =>
              p === "..." ? (
                <span key={idx} className="px-2 text-gray-500">
                  ...
                </span>
              ) : (
                <Button
                  key={idx}
                  size="icon"
                  onClick={() => onPageChange(p as number)}
                  variant={p === page ? "default" : "outline"}
                >
                  {p}
                </Button>
              )
            )}
          </div>

          <Button
            size="icon"
            variant="outline"
            disabled={page === totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default PaginatedTable;
