/* eslint-disable @typescript-eslint/no-explicit-any */
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

export type Column<T> = {
  key: keyof T | string;
  label: React.ReactNode;
  render?: (row: T) => React.ReactNode;
};

type PaginationInfo = {
  currentPage: number;
  totalPages: number;
  rowsPerPage: number;
  totalItems: number;
};

type Props<T> = {
  data: T[];
  columns: Column<T>[];

  // Pagination từ server
  pagination: PaginationInfo;

  // React Query triggers
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (size: number) => void;

  // Loading từ React Query
  loading?: boolean;
};
function getPaginationNumbers(current: number, total: number) {
  const pages: (number | string)[] = [];

  // Trang 1
  pages.push(1);

  // "..." trước khi tới currentPage-1
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

export function ReusableTable<T>({
  data,
  columns,
  pagination,
  onPageChange,
  onRowsPerPageChange,
  loading = false,
}: Props<T>) {
  const { currentPage, totalPages, rowsPerPage } = pagination;

  return (
    <div>
      <div className="border-app-azure-100 rounded-[10px] border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col, idx) => (
                <TableHead key={idx}>{col.label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {/* Loading skeleton */}
            {loading && (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-6"
                >
                  Loading...
                </TableCell>
              </TableRow>
            )}

            {/* Empty state */}
            {!loading && data.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-6"
                >
                  No data available
                </TableCell>
              </TableRow>
            )}

            {/* Data rows */}
            {!loading &&
              data.map((row, i) => (
                <TableRow key={i}>
                  {columns.map((col, idx) => (
                    <TableCell key={idx}>
                      {col.render ? col.render(row) : (row as any)[col.key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination UI giữ nguyên */}
      <div className="flex items-center justify-between p-4">
        {/* Rows per page */}
        <div className="flex items-center space-x-2 text-sm">
          <span>Rows per page</span>
          <div className="relative">
            <select
              value={rowsPerPage}
              onChange={(e) => onRowsPerPageChange(+e.target.value)}
              className="appearance-none border rounded-md px-3 py-1 bg-white pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={6}>6</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>

            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center space-x-2">
          <Button
            size="icon"
            className="border-app-primary-blue-500 border"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex space-x-1">
            {getPaginationNumbers(currentPage, totalPages).map((p, idx) =>
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
                  variant={p === currentPage ? "default" : "outline"}
                  className={
                    p === currentPage
                      ? "border-app-primary-blue-500 border bg-white text-app-primary-blue-700"
                      : " border"
                  }
                  onClick={() => onPageChange(p as number)}
                >
                  {p}
                </Button>
              )
            )}
          </div>

          <Button
            size="icon"
            className="border-app-primary-blue-500 border"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
