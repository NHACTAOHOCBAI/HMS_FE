import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { FormItem } from "@/components/ui/form";
import { Category } from "@/interfaces/category";
import { ExamListItem } from "@/interfaces/medicalExam";
import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

export const MedicalExamsColumns = (
    handleOpenDelete: (id: string) => void,
    handleOpenUpdate: (id: string) => void
) => [

        { key: "id", label: "ID", sortable: true },
        {
            key: "patient",
            label: "Patient Name",
            sortable: true,
            render: (item: ExamListItem) => item.patient.fullName,
        },
        {
            key: "doctor",
            label: "Doctor Name",
            sortable: true,
            render: (item: ExamListItem) => item.doctor.fullName,
        },
        {
            key: "diagnosis",
            label: "Diagnosis",
        },
        {
            key: "examDate",
            label: "Exam Date",
            sortable: true,
        },
        {
            key: "action",
            label: "Actions",
            render: (item: ExamListItem) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        {/* navigate khi click */}
                        <Link href={`/admin/medical-exams/medical-exam-list/${item.id}`}>
                            <DropdownMenuItem>
                                <Eye className="w-4 h-4 mr-2"
                                />
                                View
                            </DropdownMenuItem>

                            <DropdownMenuItem onClick={() => handleOpenUpdate(item.id)}>
                                <Pencil className="w-4 h-4 mr-2" />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleOpenDelete(item.id)}>
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                            </DropdownMenuItem>
                        </Link>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },];
