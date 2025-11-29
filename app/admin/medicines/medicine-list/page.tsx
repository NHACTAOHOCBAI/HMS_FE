"use client";

import { useMedicine } from "@/hooks/queries/useMedicine";
import { ReusableTable } from "../../_components/MyTable";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useCategory } from "@/hooks/queries/useCategory";
import { useDebounce } from "@/hooks/useDebounce";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CategoryFilter } from "../../_components/CategoryFilter";
import { medicineColumns } from "./columns";

export default function MedicineListPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);

  const { data: categories } = useCategory();
  const { data, isLoading } = useMedicine(page, limit, debouncedSearch);

  return (
    <div>
      <div className="mb-5 flex items-center gap-5">
        <Input
          className="h-[50px] rounded-[30px] w-[460px]"
          type="search"
          placeholder="Search..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); // reset page khi search
          }}
        />
        <CategoryFilter categories={categories ?? []} />
        <Link href="/admin/medicines/add-medicine" className="ml-auto">
          <Button>Add Medicine</Button>
        </Link>
      </div>
      <ReusableTable
        data={data?.items || []}
        columns={medicineColumns}
        loading={isLoading}
        pagination={{
          currentPage: data?.currentPage ?? 1,
          totalPages: data?.totalPages ?? 1,
          rowsPerPage: limit,
          totalItems: data?.totalItems ?? 0,
        }}
        onPageChange={(p) => setPage(p)}
        onRowsPerPageChange={(size) => {
          setLimit(size);
          setPage(1);
        }}
      />
    </div>
  );
}
