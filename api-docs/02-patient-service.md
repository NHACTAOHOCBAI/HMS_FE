# 👤 Patient Service API

**Base Path:** `/api/patients`  
**Service Port:** 8082  
**Purpose:** Patient profile and health information management

---

## 2.1 Create Patient

**Endpoint:** `POST /api/patients`  
**Access:** ADMIN, DOCTOR, NURSE  
**Description:** Create new patient profile

**Request Body:**

```json
{
  "accountId": "550e8400-e29b-41d4-a716-446655440002",
  "fullName": "Nguyen Van A",
  "email": "patient1@gmail.com",
  "dateOfBirth": "1990-01-15",
  "gender": "MALE",
  "phoneNumber": "0901234567",
  "address": "123 Main St, Ho Chi Minh City",
  "identificationNumber": "079090001234",
  "healthInsuranceNumber": "VN123456789",
  "bloodType": "O+",
  "allergies": "Penicillin, Peanuts",
  "relativeFullName": "Nguyen Thi B",
  "relativePhoneNumber": "0907654321",
  "relativeRelationship": "Spouse"
}
```

**Validation:**

- `fullName`: Required, max 255 chars
- `dateOfBirth`: Required, ISO 8601 date format
- `gender`: One of [MALE, FEMALE, OTHER]
- `bloodType`: One of [A+, A-, B+, B-, AB+, AB-, O+, O-] or null
- `phoneNumber`: Valid Vietnamese phone format

**Response:** `201 Created`

```json
{
  "status": "success",
  "data": {
    "id": "p001",
    "accountId": "550e8400-e29b-41d4-a716-446655440002",
    "fullName": "Nguyen Van A",
    "email": "patient1@gmail.com",
    "dateOfBirth": "1990-01-15",
    "gender": "MALE",
    "phoneNumber": "0901234567",
    "bloodType": "O+",
    "allergies": "Penicillin, Peanuts",
    "relativeFullName": "Nguyen Thi B",
    "relativePhoneNumber": "0907654321",
    "relativeRelationship": "Spouse",
    "createdAt": "2025-12-02T10:30:00Z"
  }
}
```

**Error Codes:**

- `400 VALIDATION_ERROR`: Input validation failed
  • fullName is required
  • fullName exceeds maximum length (255 characters)
  • dateOfBirth is required
  • dateOfBirth must be valid ISO 8601 date (YYYY-MM-DD)
  • dateOfBirth cannot be in the future
  • gender must be one of [MALE, FEMALE, OTHER]
  • bloodType must be one of [A+, A-, B+, B-, AB+, AB-, O+, O-] or null
  • phoneNumber must be valid Vietnamese format (10 digits starting with 0)
  • email must be valid format
  • identificationNumber must be 12 digits
- `403 FORBIDDEN`: User role not authorized (requires ADMIN, DOCTOR, or NURSE)
- `404 ACCOUNT_NOT_FOUND`: Account ID doesn't exist

---

## 2.2 Get Patient by ID

**Endpoint:** `GET /api/patients/{id}`  
**Access:** Authenticated (own data) | ADMIN, DOCTOR, NURSE (all)  
**Description:** Retrieve patient by ID

**Path Parameters:**

- `id` (string): Patient UUID

**Response:** `200 OK`

```json
{
  "status": "success",
  "data": {
    "id": "p001",
    "accountId": "550e8400-e29b-41d4-a716-446655440002",
    "fullName": "Nguyen Van A",
    "email": "patient1@gmail.com",
    "dateOfBirth": "1990-01-15",
    "gender": "MALE",
    "phoneNumber": "0901234567",
    "address": "123 Main St, Ho Chi Minh City",
    "identificationNumber": "079090001234",
    "healthInsuranceNumber": "VN123456789",
    "bloodType": "O+",
    "allergies": "Penicillin, Peanuts",
    "relativeFullName": "Nguyen Thi B",
    "relativePhoneNumber": "0907654321",
    "relativeRelationship": "Spouse",
    "createdAt": "2025-12-02T10:30:00Z",
    "updatedAt": "2025-12-02T10:30:00Z"
  }
}
```

**Error Codes:**

- `403 FORBIDDEN`: Not authorized to view this patient
- `404 PATIENT_NOT_FOUND`: Patient doesn't exist

---

## 2.3 List Patients (with filters)

**Endpoint:** `GET /api/patients`  
**Access:** ADMIN, DOCTOR, NURSE  
**Description:** List all patients with pagination and filters

**Query Parameters:**

- `page` (int, default=0): Page number
- `size` (int, default=20, max=100): Page size
- `search` (string): RSQL search query
- `sort` (string, default=createdAt,desc): Sort field and direction

**RSQL Search Examples:**

- `fullName=like='Nguyen*'`
- `bloodType==O+`
- `gender==MALE;bloodType==O+` (AND)
- `bloodType==O+,bloodType==A+` (OR)

**Response:** `200 OK`

```json
{
  "status": "success",
  "data": {
    "content": [
      {
        "id": "p001",
        "fullName": "Nguyen Van A",
        "gender": "MALE",
        "bloodType": "O+",
        "phoneNumber": "0901234567"
      }
    ],
    "page": 0,
    "size": 20,
    "totalElements": 150,
    "totalPages": 8
  }
}
```

**Error Codes:**

- `403 FORBIDDEN`: User role not authorized (requires ADMIN, DOCTOR, or NURSE)

---

## 2.4 Update Patient

**Endpoint:** `PUT /api/patients/{id}`  
**Access:** ADMIN, DOCTOR, NURSE  
**Description:** Update patient information

**Request Body:** (Same as Create, all fields optional)

```json
{
  "fullName": "Nguyen Van A Updated",
  "allergies": "Penicillin, Peanuts, Latex"
}
```

**Response:** `200 OK`

```json
{
  "status": "success",
  "data": {
    "id": "p001",
    "fullName": "Nguyen Van A Updated",
    "allergies": "Penicillin, Peanuts, Latex",
    "updatedAt": "2025-12-02T11:00:00Z"
  }
}
```

**Error Codes:**

- `400 VALIDATION_ERROR`: Input validation failed (same rules as Create Patient)
- `403 FORBIDDEN`: Not authorized to update this patient
- `404 PATIENT_NOT_FOUND`: Patient doesn't exist

---

## 2.5 Delete Patient (Soft Delete)

**Endpoint:** `DELETE /api/patients/{id}`  
**Access:** ADMIN only  
**Description:** Soft delete patient (marks as deleted, preserves audit trail)

**Response:** `200 OK`

```json
{
  "status": "success",
  "data": {
    "id": "p001",
    "deletedAt": "2025-12-05T14:00:00Z",
    "deletedBy": "550e8400-e29b-41d4-a716-446655440001"
  }
}
```

**Business Rules:**

- Patient record is NOT permanently deleted (soft delete only)
- Sets `deletedAt` timestamp and `deletedBy` user ID
- Validates no future appointments exist before deletion
- Deleted patients excluded from all list queries by default

**Error Codes:**

- `404 PATIENT_NOT_FOUND`: Patient doesn't exist
- `403 FORBIDDEN`: User role not authorized (requires ADMIN)
- `409 HAS_FUTURE_APPOINTMENTS`: Cannot delete patient with scheduled future appointments
