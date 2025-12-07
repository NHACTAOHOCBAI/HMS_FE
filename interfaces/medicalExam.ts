export interface MedicalExam {
    id: string;
    appointment: ExamAppointment;
    patient: ExamPatient;
    doctor: ExamDoctor;
    diagnosis: string;
    symptoms: string;
    treatment: string;
    vitals: ExamVitals;
    notes: string;
    examDate: string;   // ISO datetime
    createdAt: string;  // ISO datetime
    updatedAt: string;  // ISO datetime
}

export interface ExamAppointment {
    id: string;
    appointmentTime: string;
}

export interface ExamPatient {
    id: string;
    fullName: string;
}

export interface ExamDoctor {
    id: string;
    fullName: string;
}

export interface ExamVitals {
    temperature: number;
    bloodPressureSystolic: number;
    bloodPressureDiastolic: number;
    heartRate: number;
    weight: number;
    height: number;
}
export interface ExamListItem {
    id: string;
    appointment: {
        id: string;
        appointmentTime: string; // ISO date string
    };
    patient: {
        id: string;
        fullName: string;
    };
    doctor: {
        id: string;
        fullName: string;
    };
    diagnosis: string;
    examDate: string; // ISO date string
}
export interface CreateMedicalExamDto {
    appointmentId: string;
    diagnosis: string;
    symptoms: string;
    treatment: string;
    temperature: number;
    bloodPressureSystolic: number;
    bloodPressureDiastolic: number;
    heartRate: number;
    weight: number;
    height: number;
    notes?: string;
}
export type UpdateMedicalExamDto = {
    diagnosis: string;
    symptoms: string;
    treatment: string;
    temperature: number;
    bloodPressureSystolic: number;
    bloodPressureDiastolic: number;
    heartRate: number;
    weight: number;
    height: number;
    notes?: string;
};
