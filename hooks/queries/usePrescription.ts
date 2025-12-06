
import { createPrescription, getprescriptionByExamId } from "@/services/precription.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

//useprescriptionByExamId
export const usePrescriptionByExamId = ({ id }: { id: string }) => {
    return useQuery({
        queryKey: ["prescription", id],
        queryFn: () => getprescriptionByExamId(id), // Giả sử getMedicalExams có thể lấy theo ID
    });
}
//useCreatePrescription
export const useCreatePrescription = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createPrescription,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["prescriptions"] });
        },
    });

}