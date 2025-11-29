"use client";
import { useMedicine } from "@/hooks/queries/useMedicine";
import { Column, ReusableTable } from "../../_components/MyTable";
import { useState } from "react";
import { Medicine } from "@/interfaces/medicine";
import { Input } from "@/components/ui/input";
import { CategoryFilter } from "../../_components/CategoryFilter";
export const medicineColumns: Column<Medicine>[] = [
    { key: "id", label: "Id" },

    { key: "name", label: "Name" },
    { key: "purchasePrice", label: "Purchase Price" },
    { key: "sellingPrice", label: "Selling Price" },
    { key: "expiresAt", label: "Expires At" },
    { key: "unit", label: "Unit" },
    { key: "quantity", label: "Quantity" },


    {
        key: "action",
        label: "Action",
        render: () => (
            <div className="flex gap-2">
                <button className="text-blue-500">Edit</button>
                <button className="text-red-500">Delete</button>
            </div>
        ),
    },
];

const categories = [
    { id: "1", name: "Antibiotics" },
    { id: "2", name: "Analgesics" },
    { id: "3", name: "Antipyretics" },
    { id: "4", name: "Antihistamines" }]

export default function MedicineListPage() {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(6);


    const { data, isLoading } = useMedicine(page, limit);
    return (
        <div>
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Input type="search" placeholder={"Search..."}
                        className="w-[300px]" />
                    <CategoryFilter categories={categories} />
                </div>
            </div>
            <ReusableTable
                data={data?.items ?? []}
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
                    setPage(1); // reset page
                }}
            />
        </div>
    );
}