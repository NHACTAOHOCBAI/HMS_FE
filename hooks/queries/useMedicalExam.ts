import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { TableParams } from "../useTableParams";
import { getMedicalExamById, getMedicalExams } from "@/services/medicalExam.service";

export const useMedicalExams = (params: TableParams) => {
    return useQuery({
        queryKey: ["medical-exams", params],
        queryFn: () => getMedicalExams(params),
        placeholderData: keepPreviousData,
    });
};
//useExamById
export const useExamById = ({ id }: { id: string }) => {
    return useQuery({
        queryKey: ["medical-exam", id],
        queryFn: () => getMedicalExamById(id), // Giả sử getMedicalExams có thể lấy theo ID
    });
}