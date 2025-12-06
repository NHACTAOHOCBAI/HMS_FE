export interface Prescription {
    id: string;
    medicalExam: PrescriptionExamRef;
    patient: PrescriptionPatient;
    doctor: PrescriptionDoctor;
    prescribedAt: string;  // ISO datetime
    notes: string;
    items: PrescriptionItem[];
    createdAt: string;     // ISO datetime
    updatedAt: string;     // ISO datetime
}

export interface PrescriptionExamRef {
    id: string;
}

export interface PrescriptionPatient {
    id: string;
    fullName: string;
}

export interface PrescriptionDoctor {
    id: string;
    fullName: string;
}

export interface PrescriptionItem {
    id: string;
    medicine: PrescriptionMedicine;
    quantity: number;
    unitPrice: number;
    dosage: string;
    durationDays: number;
    instructions: string;
}

export interface PrescriptionMedicine {
    id: string;
    name: string;
}

export interface CreatePrescriptionItem {
    medicineId: string;
    quantity: number;
    dosage: string;
    durationDays: number;
    instructions?: string;
}

export interface CreatePrescriptionDto {
    notes?: string;
    items: CreatePrescriptionItem[];
}
