import { TableParams } from "@/hooks/useTableParams";
import { MedicalExam } from "@/interfaces/medicalExam";

const mockMedicalExams = [
    {
        id: "exam001",
        appointment: {
            id: "apt001",
            appointmentTime: "2025-12-05T09:00:00",
        },
        patient: {
            id: "p001",
            fullName: "Nguyen Van A",
        },
        doctor: {
            id: "emp001",
            fullName: "Dr. Nguyen Van Hung",
        },
        diagnosis: "Hypertension Stage 1",
        examDate: "2025-12-05T10:30:00Z",
    },
    {
        id: "exam002",
        appointment: {
            id: "apt002",
            appointmentTime: "2025-12-04T14:00:00",
        },
        patient: {
            id: "p002",
            fullName: "Tran Thi B",
        },
        doctor: {
            id: "emp002",
            fullName: "Dr. Le Thanh Son",
        },
        diagnosis: "Acute Gastritis",
        examDate: "2025-12-04T14:40:00Z",
    },
    {
        id: "exam003",
        appointment: {
            id: "apt003",
            appointmentTime: "2025-12-03T10:30:00",
        },
        patient: {
            id: "p003",
            fullName: "Pham Van C",
        },
        doctor: {
            id: "emp003",
            fullName: "Dr. Hoang Mai Anh",
        },
        diagnosis: "Type 2 Diabetes",
        examDate: "2025-12-03T11:05:00Z",
    }
]
//getMedicalExams
export const getMedicalExams = async (params: TableParams) => {
    const { page, limit } = params;
    await new Promise((r) => setTimeout(r, 500)); // simulate latency

    const start = (page - 1) * limit;
    const end = start + limit;

    const paginated = mockMedicalExams.slice(start, end);
    console.log("Fetching medical exams with params:", params);
    return {
        status: "success",
        data: {
            content: paginated,
            page: page,
            size: limit,
            totalElements: mockMedicalExams.length,
            totalPages: Math.ceil(mockMedicalExams.length / limit),
        },
    };
};

//getMedicalExamById
export const getMedicalExamById = async (id: string) => {
    await new Promise((r) => setTimeout(r, 300));

    console.log("Fetching medical exam by ID:", id);

    return {
        "status": "success",
        "data": {
            "id": "exam001",
            "appointment": {
                "id": "apt001",
                "appointmentTime": "2025-12-05T09:00:00"
            },
            "patient": {
                "id": "p001",
                "fullName": "Nguyen Van A"
            },
            "doctor": {
                "id": "emp001",
                "fullName": "Dr. Nguyen Van Hung"
            },
            "diagnosis": "Hypertension Stage 1",
            "symptoms": "Headache, dizziness",
            "treatment": "Lifestyle changes, medication",
            "vitals": {
                "temperature": 36.8,
                "bloodPressureSystolic": 145,
                "bloodPressureDiastolic": 95,
                "heartRate": 78,
                "weight": 75.5,
                "height": 175.0
            },
            "notes": "Follow-up in 2 weeks",
            "examDate": "2025-12-05T10:30:00Z",
            "createdAt": "2025-12-05T10:30:00Z",
            "updatedAt": "2025-12-05T10:30:00Z",
        }
    };
}