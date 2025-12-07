import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TableParams } from "../useTableParams";
import { createMedicalExam, getMedicalExamById, getMedicalExams, updateMedicalExam } from "@/services/medicalExam.service";
import { create } from "domain";

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
//useCreateMedicalExam
export const useCreateMedicalExam = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createMedicalExam,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["medicalExams"] });
        },
    });
};
//useUpdateMedicalExam
export const useUpdateMedicalExam = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => {
            return updateMedicalExam(id, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["medicalExams"] });
        },
    });
}