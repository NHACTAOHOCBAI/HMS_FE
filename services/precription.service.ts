
const mockprescription = {
    "status": "success",
    "data": {
        "id": "rx001",
        "medicalExam": {
            "id": "exam001"
        },
        "patient": {
            "id": "p001",
            "fullName": "Nguyen Van A"
        },
        "doctor": {
            "id": "emp001",
            "fullName": "Dr. Nguyen Van Hung"
        },
        "prescribedAt": "2025-12-05T10:30:00Z",
        "notes": "Take with food, avoid alcohol",
        "items": [
            {
                "id": "rxi001",
                "medicine": {
                    "id": "med001",
                    "name": "Amoxicillin 500mg"
                },
                "quantity": 20,
                "unitPrice": 8000,
                "dosage": "1 capsule twice daily",
                "durationDays": 10,
                "instructions": "Take with food"
            }
        ],
        "createdAt": "2025-12-05T10:30:00Z",
        "updatedAt": "2025-12-05T10:30:00Z"
    }
}
//getprescriptionByExamId
export const getprescriptionByExamId = async (id: string) => {
    await new Promise((r) => setTimeout(r, 300));

    console.log("Fetching medical exam by ID:", id);

    return mockprescription;
}
//createPrescription
export const createPrescription = async (data: any) => {
    await new Promise((r) => setTimeout(r, 500)); // simulate latency
    console.log("Creating medical exam with data:", data);
    return { ...data, id: "newly-created-id" };
}