"use client"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useTableParams } from '@/hooks/useTableParams'
import { useCategory } from '@/hooks/queries/useCategory'
import { Category } from '@/interfaces/category'
import { use, useState } from 'react'

import { useMedicalExams } from '@/hooks/queries/useMedicalExam'
import { MedicalExamsColumns } from './columns'
import { ReusableTable } from '../../_components/MyTable'
import { AddMedicalExamDialog } from '../add-medical-exam/AddMedicalExamDialog'
import { UpdateMedicalExamDialog } from '../update-medical-exam/UpdateMedicalExamDialog'

const MedicalExamsPage = () => {
    const {
        params,
        debouncedSearch,
        updateSearch,
        updateFilter,
        updatePage,
        updateLimit,
        updateSort,
    } = useTableParams();
    const { data, isLoading } = useMedicalExams(params);
    // console.log("Category data:", data);
    const handleOpenDelete = (id: string) => {

    };
    const handleOpenUpdate = (id: string) => {
        setUpdateMedicalExamId(id);
        setOpenUpdate(true);
    };
    const [openNew, setOpenNew] = useState(false);
    const [openUpdate, setOpenUpdate] = useState(false);
    const [updatedMedicalExamId, setUpdateMedicalExamId] = useState<string | null>(null);

    return (
        <>
            {/* LABEL */}
            <div>
                <h1 className="text-gray-900 mb-2 text-2xl font-bold tracking-tight sm:text-3xl">Quản lý khám bệnh</h1>
                <p className="text-gray-600">Tạo và quản lý hồ sơ khám bệnh</p>
            </div>
            {/* TAB */}
            <div className="mt-4 flex w-full flex-col gap-6">
                {/* Content for Medical Examinations management goes here */}
                <>
                    <Card>
                        <CardHeader>
                            <div className="mb-4 flex items-center gap-4">
                                <Input
                                    placeholder="Tìm kiếm..."
                                    className="h-[50px] rounded-[30px] w-[460px]"
                                    onChange={(e) => updateSearch(e.target.value)}
                                />

                                <Button
                                    className="ml-auto"
                                    onClick={() => setOpenNew(true)}
                                >
                                    Thêm hồ sơ khám bệnh
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <ReusableTable
                                data={data?.data.content ?? []}
                                columns={MedicalExamsColumns(handleOpenDelete, handleOpenUpdate)}
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
                    <AddMedicalExamDialog open={openNew} setOpen={setOpenNew} />
                    <UpdateMedicalExamDialog
                        open={openUpdate}
                        setOpen={setOpenUpdate}
                        medicalExamId={updatedMedicalExamId}
                    />
                </>
            </div>
        </>
    )
}

export default MedicalExamsPage