import { z } from "zod";

export const medicalExamSchema = z.object({
  appointmentId: z.string().min(1, "Appointment is required"),
  diagnosis: z
    .string()
    .max(2000, "Diagnosis exceeds maximum length")
    .optional(),
  symptoms: z.string().max(2000, "Symptoms exceed maximum length").optional(),
  treatment: z
    .string()
    .max(2000, "Treatment plan exceeds maximum length")
    .optional(),

  temperature: z.coerce.number().min(30).max(45).optional(),
  bloodPressureSystolic: z.coerce.number().min(50).max(250).optional(),
  bloodPressureDiastolic: z.coerce.number().min(30).max(150).optional(),
  heartRate: z.coerce.number().min(30).max(200).optional(),
  weight: z.coerce.number().min(0.1).max(500).optional(),
  height: z.coerce.number().min(1).max(300).optional(),

  notes: z.string().max(2000, "Notes exceed maximum length").optional(),
  
  // Follow-up date for scheduling reminder notification
  followUpDate: z.string().optional(),
});

// Schema matching backend PrescriptionItemRequest
export const prescriptionItemSchema = z.object({
  medicineId: z.string().min(1, "Vui lòng chọn thuốc"),
  quantity: z.coerce.number().min(1, "Số lượng tối thiểu là 1"),
  dosage: z.string().min(1, "Vui lòng nhập liều dùng"),
  durationDays: z.coerce.number().min(1, "Số ngày tối thiểu là 1").optional(),
  instructions: z.string().optional(),
});

export const prescriptionSchema = z.object({
  items: z.array(prescriptionItemSchema).min(1, "Cần ít nhất một loại thuốc"),
  notes: z.string().optional(),
});

export type MedicalExamFormValues = {
  appointmentId: string;
  diagnosis?: string;
  symptoms?: string;
  treatment?: string;
  temperature?: number;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  heartRate?: number;
  weight?: number;
  height?: number;
  notes?: string;
  followUpDate?: string;
};

// Type matching backend PrescriptionCreateRequest
export type PrescriptionFormValues = {
  items: {
    medicineId: string;
    quantity: number;
    dosage: string;
    durationDays?: number;
    instructions?: string;
  }[];
  notes?: string;
};
