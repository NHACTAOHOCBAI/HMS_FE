"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  labTestService,
  labResultService,
  LabTest,
  LabTestCreateRequest,
  LabTestResult,
  LabTestResultCreateRequest,
  LabTestResultUpdateRequest,
  LabTestCategory,
  ImageType,
  DiagnosticImage,
} from "@/services/lab.service";

// ============ Query Keys ============

export const labQueryKeys = {
  labTests: ["labTests"] as const,
  labTestsActive: ["labTests", "active"] as const,
  labTestsByCategory: (category: LabTestCategory) => ["labTests", "category", category] as const,
  labTest: (id: string) => ["labTests", id] as const,
  labResults: ["labResults"] as const,
  labResult: (id: string) => ["labResults", id] as const,
  labResultsByExam: (examId: string) => ["labResults", "exam", examId] as const,
  labResultsByPatient: (patientId: string) => ["labResults", "patient", patientId] as const,
};

// ============ Lab Tests Hooks ============

/**
 * Get paginated list of lab tests
 */
export function useLabTests(params?: { page?: number; size?: number; filter?: string }) {
  return useQuery({
    queryKey: [...labQueryKeys.labTests, params],
    queryFn: () => labTestService.getAll(params),
  });
}

/**
 * Get active lab tests (for dropdowns)
 */
export function useActiveLabTests() {
  return useQuery({
    queryKey: labQueryKeys.labTestsActive,
    queryFn: () => labTestService.getActive(),
  });
}

/**
 * Get lab tests by category
 */
export function useLabTestsByCategory(category: LabTestCategory) {
  return useQuery({
    queryKey: labQueryKeys.labTestsByCategory(category),
    queryFn: () => labTestService.getByCategory(category),
    enabled: !!category,
  });
}

/**
 * Get single lab test by ID
 */
export function useLabTest(id: string) {
  return useQuery({
    queryKey: labQueryKeys.labTest(id),
    queryFn: () => labTestService.getById(id),
    enabled: !!id,
  });
}

/**
 * Create new lab test (ADMIN only)
 */
export function useCreateLabTest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LabTestCreateRequest) => labTestService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: labQueryKeys.labTests });
      toast.success("Đã tạo loại xét nghiệm mới");
    },
    onError: (error: Error) => {
      toast.error(`Lỗi: ${error.message}`);
    },
  });
}

/**
 * Update lab test (ADMIN only)
 */
export function useUpdateLabTest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<LabTestCreateRequest> }) =>
      labTestService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: labQueryKeys.labTests });
      queryClient.invalidateQueries({ queryKey: labQueryKeys.labTest(variables.id) });
      toast.success("Đã cập nhật loại xét nghiệm");
    },
    onError: (error: Error) => {
      toast.error(`Lỗi: ${error.message}`);
    },
  });
}

/**
 * Delete lab test (ADMIN only)
 */
export function useDeleteLabTest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => labTestService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: labQueryKeys.labTests });
      toast.success("Đã xóa loại xét nghiệm");
    },
    onError: (error: Error) => {
      toast.error(`Lỗi: ${error.message}`);
    },
  });
}

// ============ Lab Results Hooks ============

/**
 * Get paginated list of lab results
 */
export function useLabResults(params?: { page?: number; size?: number }) {
  return useQuery({
    queryKey: [...labQueryKeys.labResults, params],
    queryFn: () => labResultService.getAll(params),
  });
}

/**
 * Get single lab result by ID
 */
export function useLabResult(id: string) {
  return useQuery({
    queryKey: labQueryKeys.labResult(id),
    queryFn: () => labResultService.getById(id),
    enabled: !!id,
  });
}

/**
 * Get lab results for a medical exam
 */
export function useLabResultsByExam(examId: string) {
  return useQuery({
    queryKey: labQueryKeys.labResultsByExam(examId),
    queryFn: () => labResultService.getByExam(examId),
    enabled: !!examId,
  });
}

/**
 * Get lab results for a patient
 */
export function useLabResultsByPatient(patientId: string) {
  return useQuery({
    queryKey: labQueryKeys.labResultsByPatient(patientId),
    queryFn: () => labResultService.getByPatient(patientId),
    enabled: !!patientId,
  });
}

/**
 * Order a new lab test
 */
export function useCreateLabResult() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LabTestResultCreateRequest) => labResultService.create(data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: labQueryKeys.labResults });
      if (result.medicalExamId) {
        queryClient.invalidateQueries({
          queryKey: labQueryKeys.labResultsByExam(result.medicalExamId),
        });
      }
      toast.success("Đã yêu cầu xét nghiệm");
    },
    onError: (error: Error) => {
      toast.error(`Lỗi: ${error.message}`);
    },
  });
}

/**
 * Update lab result
 */
export function useUpdateLabResult() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: LabTestResultUpdateRequest }) =>
      labResultService.update(id, data),
    onSuccess: (result, variables) => {
      queryClient.invalidateQueries({ queryKey: labQueryKeys.labResults });
      queryClient.invalidateQueries({ queryKey: labQueryKeys.labResult(variables.id) });
      toast.success("Đã cập nhật kết quả xét nghiệm");
    },
    onError: (error: Error) => {
      toast.error(`Lỗi: ${error.message}`);
    },
  });
}

/**
 * Upload images for a lab result
 */
export function useUploadLabImages() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      resultId,
      files,
      imageType = "PHOTO",
      description,
    }: {
      resultId: string;
      files: File[];
      imageType?: ImageType;
      description?: string;
    }) => labResultService.uploadImages(resultId, files, imageType, description),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: labQueryKeys.labResult(variables.resultId) });
      toast.success("Đã tải lên hình ảnh");
    },
    onError: (error: Error) => {
      toast.error(`Lỗi tải ảnh: ${error.message}`);
    },
  });
}

/**
 * Delete an image
 */
export function useDeleteLabImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ imageId, resultId }: { imageId: string; resultId: string }) =>
      labResultService.deleteImage(imageId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: labQueryKeys.labResult(variables.resultId) });
      toast.success("Đã xóa hình ảnh");
    },
    onError: (error: Error) => {
      toast.error(`Lỗi: ${error.message}`);
    },
  });
}
