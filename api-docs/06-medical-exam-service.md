# 🏥 Medical Exam Service API

**Base Path:** `/api/exams`  
**Service Port:** 8086  
**Purpose:** Medical examination records and prescriptions

---

## 6.1 Create Medical Exam

**Endpoint:** `POST /api/exams`  
**Access:** ADMIN, DOCTOR

**Request Body:**

```json
{
  "appointmentId": "apt001",
  "diagnosis": "Hypertension Stage 1",
  "symptoms": "Headache, dizziness",
  "treatment": "Lifestyle changes, medication",
  "temperature": 36.8,
  "bloodPressureSystolic": 145,
  "bloodPressureDiastolic": 95,
  "heartRate": 78,
  "weight": 75.5,
  "height": 175.0,
  "notes": "Follow-up in 2 weeks"
}
```

**Validation:**

- `appointmentId`: Must exist and be COMPLETED
- `temperature`: 30.0 - 45.0 (Celsius)
- `bloodPressureSystolic`: 50 - 250 (mmHg)
- `bloodPressureDiastolic`: 30 - 150 (mmHg)
- `heartRate`: 30 - 200 (bpm)
- `weight`, `height`: Must be positive
- Unique constraint: One exam per appointment

**Response:** `201 Created`

```json
{
  "status": "success",
  "data": {
    "id": "exam001",
    "appointment": { "id": "apt001", "appointmentTime": "2025-12-05T09:00:00" },
    "patient": { "id": "p001", "fullName": "Nguyen Van A" },
    "doctor": { "id": "emp001", "fullName": "Dr. Nguyen Van Hung" },
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
    "createdAt": "2025-12-05T10:30:00Z"
  }
}
```

**Error Codes:**

- `400 VALIDATION_ERROR`: Invalid vitals range or required fields
- `400 APPOINTMENT_NOT_COMPLETED`: Appointment must be completed first
- `403 FORBIDDEN`: Only assigned doctor can create (ADMIN can create for any)
- `404 APPOINTMENT_NOT_FOUND`: Appointment doesn't exist
- `409 EXAM_EXISTS`: Exam already exists for this appointment

---

## 6.2 Get Medical Exam by ID

**Endpoint:** `GET /api/exams/{id}`  
**Access:** ADMIN, DOCTOR, NURSE, PATIENT (own)

Returns full exam details with vitals.

**Error Codes:**

- `403 FORBIDDEN`: Patients can only view own
- `404 EXAM_NOT_FOUND`: Exam doesn't exist

---

## 6.3 Get Medical Exam by Appointment

**Endpoint:** `GET /api/exams/by-appointment/{appointmentId}`  
**Access:** ADMIN, DOCTOR, NURSE, PATIENT (own)

**Error Codes:**

- `404 APPOINTMENT_NOT_FOUND`: Appointment doesn't exist
- `404 EXAM_NOT_FOUND`: No exam for this appointment

---

## 6.4 List Medical Exams

**Endpoint:** `GET /api/exams`  
**Access:** ADMIN, DOCTOR, NURSE (all), PATIENT (own)

**Query Parameters:**

- `patientId` (string): Filter by patient
- `doctorId` (string): Filter by doctor
- `startDate`, `endDate` (date): Date range filter
- `page` (int, default=0), `size` (int, default=20, max=100)
- `sort` (string, default=examDate,desc)

---

## 6.5 Update Medical Exam

**Endpoint:** `PATCH /api/exams/{id}`  
**Access:** ADMIN, DOCTOR

**Business Rules:**

- Only the doctor who created can update (ADMIN can update any)
- Cannot update after 24 hours (audit integrity)

**Error Codes:**

- `400 EXAM_NOT_MODIFIABLE`: Cannot modify after 24 hours
- `403 FORBIDDEN`: Only creator can update

---

## 6.6 Create Prescription

**Endpoint:** `POST /api/exams/{examId}/prescriptions`  
**Access:** ADMIN, DOCTOR

**Request Body:**

```json
{
  "notes": "Take with food, avoid alcohol",
  "items": [
    {
      "medicineId": "med001",
      "quantity": 20,
      "dosage": "1 capsule twice daily",
      "durationDays": 10,
      "instructions": "Take with food"
    }
  ]
}
```

**Validation:**

- `items[]`: Required, non-empty array
- `medicineId`: Must exist with sufficient stock
- `quantity`: Must be > 0 and <= available stock

**Side Effects:**

- Decrements medicine stock in medicine-service
- Triggers billing service to auto-generate invoice

**Business Rules:**

- Prescriptions are **immutable** after creation (no update endpoint)
- One prescription per medical exam

**Error Codes:**

- `400 VALIDATION_ERROR`: Missing required fields
- `400 INSUFFICIENT_STOCK`: Not enough medicine in stock
- `403 FORBIDDEN`: Only exam creator can create prescription
- `404 EXAM_NOT_FOUND`: Exam doesn't exist
- `404 MEDICINE_NOT_FOUND`: Medicine doesn't exist
- `409 PRESCRIPTION_EXISTS`: Already has prescription

---

## 6.7 Get Prescription by ID

**Endpoint:** `GET /api/exams/prescriptions/{id}`  
**Access:** ADMIN, DOCTOR, NURSE, PATIENT (own)

---

## 6.8 Get Prescription by Exam

**Endpoint:** `GET /api/exams/{examId}/prescription`  
**Access:** ADMIN, DOCTOR, NURSE, PATIENT (own)

---

## 6.9 Get Prescriptions by Patient

**Endpoint:** `GET /api/exams/prescriptions/by-patient/{patientId}`  
**Access:** ADMIN, DOCTOR, NURSE, PATIENT (own)

**Query Parameters:**

- `page` (int, default=0), `size` (int, default=20, max=100)
