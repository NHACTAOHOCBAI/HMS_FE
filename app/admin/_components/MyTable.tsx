/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
<<<<<<< HEAD
import { ChevronsUpDown, ChevronUp, ChevronDown } from "lucide-react";
=======

>>>>>>> repoB/master
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
<<<<<<< HEAD
import { ChevronLeft, ChevronRight } from "lucide-react";
=======
>>>>>>> repoB/master
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
<<<<<<< HEAD
=======
import { Skeleton } from "@/components/ui/skeleton";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
>>>>>>> repoB/master

export type Column<T> = {
  key: keyof T | string;
  label: React.ReactNode;
  render?: (row: T) => React.ReactNode;
<<<<<<< HEAD

  // 🆕 Thêm vào đây
  sortable?: boolean;
=======
>>>>>>> repoB/master
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
<<<<<<< HEAD
  pagination: PaginationInfo;

  onPageChange: (page: number) => void;
  onRowsPerPageChange: (size: number) => void;

  loading?: boolean;

  // 🆕 Sorting
  onSort?: (key: string) => void;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

function getPaginationNumbers(current: number, total: number) {
  const pages: (number | string)[] = [];
  pages.push(1);

  if (current > 3) pages.push("...");
  if (current > 2) pages.push(current - 1);
  if (current !== 1 && current !== total) pages.push(current);
  if (current < total - 1) pages.push(current + 1);
  if (current < total - 2) pages.push("...");
  if (total > 1) pages.push(total);

  return pages;
}
=======

  // Pagination từ server
  pagination: PaginationInfo;

  // React Query triggers
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (size: number) => void;

  // Loading từ React Query
  loading?: boolean;
  onRowClick?: (row: T) => void;
  
  // Hide pagination (render it separately)
  hidePagination?: boolean;
};

// Skeleton row component
const TableRowSkeleton = ({ columnsLength }: { columnsLength: number }) => (
  <TableRow>
    {Array.from({ length: columnsLength }).map((_, i) => (
      <TableCell key={i}>
        <Skeleton className="h-6 w-full" />
      </TableCell>
    ))}
  </TableRow>
);
>>>>>>> repoB/master

export function ReusableTable<T>({
  data,
  columns,
  pagination,
  onPageChange,
  onRowsPerPageChange,
  loading = false,
<<<<<<< HEAD

  // 🆕 thêm 2 props
  onSort,
  sortBy,
  sortOrder,
}: Props<T>) {
  const { currentPage, totalPages, rowsPerPage } = pagination;

  const renderSortIcon = (colKey: string, sortable?: boolean) => {
    if (!sortable) return null;

    // ❌ Cột chưa được sort → icon mờ ChevronsUpDown
    if (sortBy !== colKey)
      return <ChevronsUpDown className="ml-1 h-4 w-4 text-gray-400" />;

    // 🔼 Sort ASC
    if (sortOrder === "asc")
      return <ChevronUp className="ml-1 h-4 w-4 text-gray-700" />;

    // 🔽 Sort DESC
    return <ChevronDown className="ml-1 h-4 w-4 text-gray-700" />;
  };

  return (
    <div className="flex flex-col justify-between min-h-[500px] gap-5">
      <div className="border-app-azure-100 rounded-[10px] border">
=======
  onRowClick,
  hidePagination = false,
}: Props<T>) {
  const { currentPage, totalPages, rowsPerPage, totalItems } = pagination;

  return (
    <div className="flex flex-col gap-5">
      <div className="overflow-hidden">
>>>>>>> repoB/master
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col, idx) => (
<<<<<<< HEAD
                <TableHead
                  key={idx}
                  className={
                    col.sortable ? "cursor-pointer select-none" : "select-none"
                  }
                  onClick={() => col.sortable && onSort?.(String(col.key))}
                >
                  <div className="flex items-center">
                    {col.label}
                    {renderSortIcon(String(col.key), col.sortable)}
                  </div>
                </TableHead>
=======
                <TableHead key={idx}>{col.label}</TableHead>
>>>>>>> repoB/master
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
<<<<<<< HEAD
            {/* Loading */}
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
=======
            {/* Loading skeleton */}
            {loading ? (
              Array.from({ length: rowsPerPage }).map((_, i) => (
                <TableRowSkeleton key={i} columnsLength={columns.length} />
              ))
            ) : data.length === 0 ? (
              // Empty state
>>>>>>> repoB/master
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-6"
                >
                  No data available
                </TableCell>
              </TableRow>
<<<<<<< HEAD
            )}

            {/* Data */}
            {!loading &&
              data.map((row, i) => (
                <TableRow key={i}>
=======
            ) : (
              // Data rows
              data.map((row, i) => (
                <TableRow
                  key={i}
                  className={
                    onRowClick ? "cursor-pointer hover:bg-muted/60" : ""
                  }
                  onClick={() => onRowClick?.(row)}
                >
>>>>>>> repoB/master
                  {columns.map((col, idx) => (
                    <TableCell key={idx}>
                      {col.render ? col.render(row) : (row as any)[col.key]}
                    </TableCell>
                  ))}
                </TableRow>
<<<<<<< HEAD
              ))}
=======
              ))
            )}
>>>>>>> repoB/master
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
<<<<<<< HEAD
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm">
          <span>Rows per page</span>
          <Select
            value={rowsPerPage.toString()}
            onValueChange={(v) => onRowsPerPageChange(+v)}
          >
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6">6</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
            </SelectContent>
          </Select>
        </div>

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
                <span key={idx} className="px-2 text-gray-500">
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
                      : "border"
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
=======
      {!hidePagination && (
        <DataTablePagination
          currentPage={currentPage - 1} // Convert from 1-indexed to 0-indexed
          totalPages={totalPages}
          totalElements={totalItems}
          pageSize={rowsPerPage}
          onPageChange={(page) => onPageChange(page + 1)} // Convert back to 1-indexed
          showRowsPerPage={true}
          rowsPerPageOptions={[10, 20, 50]}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={onRowsPerPageChange}
        />
      )}
    </div>
  );
}

export default ReusableTable;
>>>>>>> repoB/master
