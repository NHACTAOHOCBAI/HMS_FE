"use client"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ReusableTable } from '../../_components/MyTable'
import { useMedicine } from '@/hooks/queries/useMedicine'
import { useTableParams } from '@/hooks/useTableParams'
import { medicineListColumns } from './columns'
import { Medicine } from '@/services/medicine.service'
import { useCategory } from '@/hooks/queries/useCategory'
import UpdateMedicineDialog from '../update-medicine/UpdateMedicineDialog'
import { useState } from 'react'

const MedicineCard = () => {
    const {
        params,
        debouncedSearch,
        updateSearch,
        updateFilter,
        updatePage,
        updateLimit,
        updateSort,
    } = useTableParams();
    const { data, isLoading } = useMedicine({
        ...params,
        search: debouncedSearch,
        sortOrder: params.sortOrder as "asc" | "desc" | undefined,
    });
    const { data: categoryData } = useCategory({ limit: 1000, page: 1 });
    const handleOpenDelete = (id: string) => {
        console.log("Deleting medicine with id:", id);
    };
    const handleOpenUpdate = (medicine: Medicine) => {
        setUpdatedMedicine(medicine);
        setOpenUpdate(true);
    };
    const [openUpdate, setOpenUpdate] = useState(false);
    const [updatedMedicine, setUpdatedMedicine] = useState<Medicine | null>(null);
    return (
        <>
            <Card>
                <CardHeader>
                    <div className="mb-4 flex items-center gap-4">
                        <Input
                            placeholder="Search medicine..."
                            className="h-[50px] rounded-[30px] w-[460px]"
                            onChange={(e) => updateSearch(e.target.value)}
                        />
                        <Select
                            onValueChange={(value) => updateFilter("categoryId", value === "all" ? "" : value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Tất cả" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả</SelectItem>
                                {categoryData?.data.content.map((category) => (
                                    <SelectItem key={category.id} value={category.id}>
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Button
                            className="ml-auto"
                        // onClick={() => setOpenNew(true)}
                        >
                            Thêm Thuốc
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Table medicine */}
                    <ReusableTable
                        data={data?.data.content ?? []}
                        columns={medicineListColumns(handleOpenDelete, handleOpenUpdate)}
                        loading={isLoading}
                        pagination={{
                            currentPage: params.page,
                            totalPages: data?.data.totalPages ?? 1,
                            rowsPerPage: params.limit,
                            totalItems: data?.data.totalElements ?? 0,
                        }}
                        onPageChange={updatePage}
                        onRowsPerPageChange={updateLimit}
                        onSort={updateSort}
                        sortBy={params.sortBy}
                        sortOrder={params.sortOrder as "asc" | "desc" | undefined}
                    />
                </CardContent>

            </Card>
            <UpdateMedicineDialog
                open={openUpdate}
                setOpen={setOpenUpdate}
                medicine={updatedMedicine}
            /></>

    )
}

export default MedicineCard