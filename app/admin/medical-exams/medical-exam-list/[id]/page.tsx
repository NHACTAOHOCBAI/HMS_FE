"use client";

import React from "react";
import { useParams } from "next/navigation";
import { ExamDetailCard } from "../../components/ExamDetailCard";
import { useExamById } from "@/hooks/queries/useMedicalExam";
import { usePrescriptionByExamId } from "@/hooks/queries/usePrescription";

export default function ExamDetailPage() {
    const { id } = useParams();
    const examId = Array.isArray(id) ? id[0] : id ?? "";
    const { data: resp, isLoading, isError } = useExamById({ id: examId });
    const { data: prescription, isLoading: isPrescriptionLoading, } = usePrescriptionByExamId({ id: examId });

    if (isLoading) return <p className="p-6">Loading...</p>;
    if (isError || !resp?.data) return <p className="p-6">Exam not found.</p>;
    console.log(prescription)
    return <ExamDetailCard exam={resp.data} prescription={prescription?.data} />;
}
