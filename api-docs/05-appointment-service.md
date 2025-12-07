# 📅 Appointment Service API

**Base Path:** `/api/appointments`  
**Service Port:** 8085  
**Purpose:** Patient appointment booking and management

---

## 5.1 Create Appointment

**Endpoint:** `POST /api/appointments`  
**Access:** ADMIN, DOCTOR, NURSE, PATIENT (own)  
**Description:** Book new appointment

**Request Body:**

```json
{
  "patientId": "p001",
  "doctorId": "emp001",
  "appointmentTime": "2025-12-05T09:00:00",
  "type": "CONSULTATION",
  "reason": "Chest pain"
}
```

**Validation:**

- `appointmentTime`: Must be future, during doctor's schedule
- `type`: One of [CONSULTATION, FOLLOW_UP, EMERGENCY]
- Doctor must have AVAILABLE schedule for this date
- No overlapping appointments for doctor
- **Appointment Duration:** Fixed at 30 minutes (configurable in application.yml)
  - Time slots calculated as: appointmentTime to appointmentTime + 30 minutes
  - Prevents double-booking within this window

**Response:** `201 Created`

```json
{
  "status": "success",
  "data": {
    "id": "apt001",
    "patient": {
      "id": "p001",
      "fullName": "Nguyen Van A"
    },
    "doctor": {
      "id": "emp001",
      "fullName": "Dr. Nguyen Van Hung",
      "department": "Cardiology"
    },
    "appointmentTime": "2025-12-05T09:00:00",
    "status": "SCHEDULED",
    "type": "CONSULTATION",
    "reason": "Chest pain",
    "createdAt": "2025-12-02T10:30:00Z"
  }
}
```

**Error Codes:**

- `400 VALIDATION_ERROR`: Input validation failed
  • patientId is required
  • doctorId is required
  • appointmentTime is required
  • appointmentTime must be valid ISO 8601 datetime
  • type is required
  • type must be one of [CONSULTATION, FOLLOW_UP, EMERGENCY]
  • reason exceeds maximum length (500 characters)
- `400 PAST_APPOINTMENT`: appointmentTime cannot be in the past
- `404 PATIENT_NOT_FOUND`: Patient ID doesn't exist
- `404 EMPLOYEE_NOT_FOUND`: Doctor ID doesn't exist
- `409 DOCTOR_NOT_AVAILABLE`: Doctor has no schedule for this date/time
- `409 TIME_SLOT_TAKEN`: Time slot already booked (30-minute window)

---

## 5.2 Get Appointment by ID

**Endpoint:** `GET /api/appointments/{id}`  
**Access:** Authenticated (own) | ADMIN, DOCTOR, NURSE (all)  
**Description:** Retrieve appointment details. Patients can only view their own appointments.

**Response:** `200 OK`

```json
{
  "status": "success",
  "data": {
    "id": "apt001",
    "patient": {
      "id": "p001",
      "fullName": "Nguyen Van A",
      "phoneNumber": "0901234567"
    },
    "doctor": {
      "id": "emp001",
      "fullName": "Dr. Nguyen Van Hung",
      "department": "Cardiology",
      "phoneNumber": "0901111111"
    },
    "appointmentTime": "2025-12-05T09:00:00",
    "status": "SCHEDULED",
    "type": "CONSULTATION",
    "reason": "Chest pain",
    "notes": null,
    "cancelledAt": null,
    "cancelReason": null,
    "createdAt": "2025-12-02T10:30:00Z",
    "updatedAt": "2025-12-02T10:30:00Z"
  }
}
```

**Error Codes:**

- `401 UNAUTHORIZED`: Missing or invalid access token
- `403 FORBIDDEN`: User not authorized to view this appointment (patients can only view own)
- `404 APPOINTMENT_NOT_FOUND`: Appointment doesn't exist

---

## 5.3 List Appointments

**Endpoint:** `GET /api/appointments`  
**Access:** Authenticated  
**Description:** List appointments with filters. Patients can only see their own appointments. Staff can see all.

**Query Parameters:**

- `patientId` (string, optional): Filter by patient (ignored for PATIENT role - uses their own)
- `doctorId` (string, optional): Filter by doctor
- `status` (string, optional): Filter by status (SCHEDULED, COMPLETED, CANCELLED, NO_SHOW)
- `startDate` (date, optional): Filter appointments from this date (YYYY-MM-DD)
- `endDate` (date, optional): Filter appointments until this date (YYYY-MM-DD)
- `page` (integer, optional): Page number (default: 0)
- `size` (integer, optional): Page size (default: 20, max: 100)
- `sort` (string, optional): Sort field (default: appointmentTime,desc)

**Response:** `200 OK`

```json
{
  "status": "success",
  "data": {
    "content": [
      {
        "id": "apt001",
        "patient": {
          "id": "p001",
          "fullName": "Nguyen Van A"
        },
        "doctor": {
          "id": "emp001",
          "fullName": "Dr. Nguyen Van Hung",
          "department": "Cardiology"
        },
        "appointmentTime": "2025-12-05T09:00:00",
        "status": "SCHEDULED",
        "type": "CONSULTATION",
        "reason": "Chest pain"
      }
    ],
    "page": 0,
    "size": 20,
    "totalElements": 1,
    "totalPages": 1,
    "last": true
  }
}
```

**Error Codes:**

- `401 UNAUTHORIZED`: Missing or invalid access token
- `400 VALIDATION_ERROR`: Invalid query parameters
  • page must be >= 0
  • size must be between 1 and 100
  • startDate must be valid ISO 8601 date
  • endDate must be valid ISO 8601 date
  • startDate cannot be after endDate

---

## 5.4 Update Appointment

**Endpoint:** `PATCH /api/appointments/{id}`  
**Access:** ADMIN, DOCTOR, NURSE  
**Description:** Update appointment details (reschedule, add notes). Only SCHEDULED appointments can be updated.

**Request Body:**

```json
{
  "appointmentTime": "2025-12-05T10:00:00",
  "type": "FOLLOW_UP",
  "reason": "Follow-up consultation",
  "notes": "Rescheduled per patient request"
}
```

**Business Rules:**

- Only appointments with `status = SCHEDULED` can be updated
- COMPLETED, CANCELLED, and NO_SHOW appointments are immutable (audit integrity)
- If rescheduling (`appointmentTime` changed), validates doctor availability and no time slot conflicts

**Response:** `200 OK`

```json
{
  "status": "success",
  "data": {
    "id": "apt001",
    "patient": {
      "id": "p001",
      "fullName": "Nguyen Van A"
    },
    "doctor": {
      "id": "emp001",
      "fullName": "Dr. Nguyen Van Hung",
      "department": "Cardiology"
    },
    "appointmentTime": "2025-12-05T10:00:00",
    "status": "SCHEDULED",
    "type": "FOLLOW_UP",
    "reason": "Follow-up consultation",
    "notes": "Rescheduled per patient request",
    "createdAt": "2025-12-02T10:30:00Z",
    "updatedAt": "2025-12-02T11:00:00Z",
    "updatedBy": "550e8400-e29b-41d4-a716-446655440001"
  }
}
```

**Error Codes:**

- `401 UNAUTHORIZED`: Missing or invalid access token
- `400 VALIDATION_ERROR`: Input validation failed
  • appointmentTime must be valid ISO 8601 datetime
  • type must be one of [CONSULTATION, FOLLOW_UP, EMERGENCY]
  • reason exceeds maximum length (500 characters)
  • notes exceeds maximum length (1000 characters)
- `400 PAST_APPOINTMENT`: appointmentTime cannot be in the past
- `400 APPOINTMENT_NOT_MODIFIABLE`: Cannot modify appointment with status COMPLETED, CANCELLED, or NO_SHOW
- `403 FORBIDDEN`: User role not authorized (requires ADMIN, DOCTOR, or NURSE)
- `404 APPOINTMENT_NOT_FOUND`: Appointment doesn't exist
- `409 DOCTOR_NOT_AVAILABLE`: Doctor has no schedule for new date/time
- `409 TIME_SLOT_TAKEN`: New time slot already booked (30-minute window conflict)

---

## 5.5 Cancel Appointment

**Endpoint:** `PATCH /api/appointments/{id}/cancel`  
**Access:** ADMIN, DOCTOR, NURSE, PATIENT (own)  
**Description:** Cancel a scheduled appointment. Only SCHEDULED appointments can be cancelled.

**Request Body:**

```json
{
  "cancelReason": "Patient recovered"
}
```

**Validation:**

- `cancelReason`: Required, max 500 characters

**Business Rules:**

- Only appointments with `status = SCHEDULED` can be cancelled
- COMPLETED and NO_SHOW appointments cannot be cancelled (already finalized)
- CANCELLED appointments cannot be cancelled again (idempotency check)
- Patients can only cancel their own appointments

**Response:** `200 OK`

```json
{
  "status": "success",
  "data": {
    "id": "apt001",
    "status": "CANCELLED",
    "cancelledAt": "2025-12-02T11:00:00Z",
    "cancelReason": "Patient recovered",
    "updatedAt": "2025-12-02T11:00:00Z",
    "updatedBy": "550e8400-e29b-41d4-a716-446655440001"
  }
}
```

**Side Effects:**

- Frees up doctor's time slot (makes available for other bookings)
- Triggers cancellation notification to patient/doctor (if notification service enabled)

**Error Codes:**

- `401 UNAUTHORIZED`: Missing or invalid access token
- `400 VALIDATION_ERROR`: Input validation failed
  • cancelReason is required
  • cancelReason exceeds maximum length (500 characters)
- `400 APPOINTMENT_NOT_CANCELLABLE`: Cannot cancel appointment with status COMPLETED or NO_SHOW
- `400 ALREADY_CANCELLED`: Appointment is already cancelled
- `403 FORBIDDEN`: User not authorized to cancel this appointment (patients can only cancel own)
- `404 APPOINTMENT_NOT_FOUND`: Appointment doesn't exist

---

## 5.6 Complete Appointment

**Endpoint:** `PATCH /api/appointments/{id}/complete`  
**Access:** DOCTOR only  
**Description:** Mark appointment as completed after consultation. Only the assigned doctor can complete.

**Business Rules:**

- Only appointments with `status = SCHEDULED` can be completed
- CANCELLED and NO_SHOW appointments cannot be completed
- Only the doctor assigned to the appointment can mark it as completed
- After completion, medical exam record can be created

**Response:** `200 OK`

```json
{
  "status": "success",
  "data": {
    "id": "apt001",
    "patient": {
      "id": "p001",
      "fullName": "Nguyen Van A"
    },
    "doctor": {
      "id": "emp001",
      "fullName": "Dr. Nguyen Van Hung"
    },
    "appointmentTime": "2025-12-05T09:00:00",
    "status": "COMPLETED",
    "type": "CONSULTATION",
    "reason": "Chest pain",
    "updatedAt": "2025-12-05T10:30:00Z",
    "updatedBy": "emp001"
  }
}
```

**Side Effects:**

- Updates appointment status to COMPLETED
- Allows creation of medical exam record for this appointment
- Triggers completion notification to patient (if notification service enabled)

**Error Codes:**

- `401 UNAUTHORIZED`: Missing or invalid access token
- `400 ALREADY_COMPLETED`: Appointment is already marked as completed
- `400 APPOINTMENT_CANCELLED`: Cannot complete a cancelled appointment
- `400 APPOINTMENT_NO_SHOW`: Cannot complete a no-show appointment
- `403 FORBIDDEN`: Only the assigned doctor can complete this appointment
- `404 APPOINTMENT_NOT_FOUND`: Appointment doesn't exist
