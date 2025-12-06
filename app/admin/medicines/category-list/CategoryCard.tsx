"use client"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ReusableTable } from '../../_components/MyTable'
import { useTableParams } from '@/hooks/useTableParams'
import { useCategory } from '@/hooks/queries/useCategory'
import { categoryListColumns } from './columns'
import { Category } from '@/interfaces/category'
import { useState } from 'react'
import UpdateCategoryDialog from '../update-category/UpdateCategoryDialog'

const CategoryCard = () => {
    const {
        params,
        debouncedSearch,
        updateSearch,
        updateFilter,
        updatePage,
        updateLimit,
        updateSort,
    } = useTableParams();
    const { data, isLoading } = useCategory(params);
    // console.log("Category data:", data);
    const handleOpenDelete = (id: string) => {
        console.log("Deleting category with id:", id);
    };
    const handleOpenUpdate = (category: Category) => {
        setUpdatedCategory(category);
        setOpenUpdate(true);
    };
    const [openUpdate, setOpenUpdate] = useState(false);
    const [updatedCategory, setUpdatedCategory] = useState<Category | null>(null);
    return (<>
        <Card>
            <CardHeader>
                <div className="mb-4 flex items-center gap-4">
                    <Input
                        placeholder="Search category..."
                        className="h-[50px] rounded-[30px] w-[460px]"
                        onChange={(e) => updateSearch(e.target.value)}
                    />

                    <Button
                        className="ml-auto"
                    // onClick={() => setOpenNew(true)}
                    >
                        Thêm Loại Thuốc
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                {/* Table medicine */}
                <ReusableTable
                    data={data?.data.content ?? []}
                    columns={categoryListColumns(handleOpenDelete, handleOpenUpdate)}
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
        <UpdateCategoryDialog
            open={openUpdate}
            setOpen={setOpenUpdate}
            category={updatedCategory}
        />
    </>

    )
}

export default CategoryCard