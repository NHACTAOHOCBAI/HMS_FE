# 📊 Reports Service API

**Base Path:** `/api/reports`  
**Service Port:** 8088  
**Purpose:** Analytics and reporting

---

## 8.1 Revenue Report

**Endpoint:** `GET /api/reports/revenue`  
**Access:** ADMIN only

**Query Parameters:**

- `startDate` (date, required): Report start date (YYYY-MM-DD)
- `endDate` (date, required): Report end date (YYYY-MM-DD)
- `departmentId` (string, optional): Filter by department

**Response:** `200 OK`

```json
{
  "status": "success",
  "data": {
    "period": { "startDate": "2025-12-01", "endDate": "2025-12-31" },
    "totalRevenue": 50000000,
    "paidRevenue": 45000000,
    "unpaidRevenue": 5000000,
    "invoiceCount": { "total": 150, "paid": 135, "unpaid": 10, "overdue": 5 },
    "revenueByDepartment": [
      {
        "departmentId": "dept001",
        "departmentName": "Cardiology",
        "revenue": 20000000,
        "percentage": 44.4
      }
    ],
    "revenueByPaymentMethod": [
      { "method": "CASH", "amount": 25000000, "percentage": 55.6 },
      { "method": "CREDIT_CARD", "amount": 15000000, "percentage": 33.3 }
    ],
    "generatedAt": "2025-12-02T11:00:00Z"
  }
}
```

**Error Codes:**

- `400 VALIDATION_ERROR`: Missing/invalid dates
- `403 FORBIDDEN`: Requires ADMIN role
- `404 DEPARTMENT_NOT_FOUND`: Department filter invalid

---

## 8.2 Appointment Statistics

**Endpoint:** `GET /api/reports/appointments`  
**Access:** ADMIN, DOCTOR (own statistics)

**Query Parameters:**

- `startDate`, `endDate` (date, required)
- `departmentId` (string, optional)
- `doctorId` (string, optional): DOCTOR role can only see own

**Response:** `200 OK`

```json
{
  "status": "success",
  "data": {
    "period": { "startDate": "2025-12-01", "endDate": "2025-12-31" },
    "totalAppointments": 500,
    "appointmentsByStatus": {
      "SCHEDULED": 150,
      "COMPLETED": 300,
      "CANCELLED": 40,
      "NO_SHOW": 10
    },
    "appointmentsByType": {
      "CONSULTATION": 250,
      "FOLLOW_UP": 200,
      "EMERGENCY": 50
    },
    "appointmentsByDepartment": [
      {
        "departmentId": "dept001",
        "departmentName": "Cardiology",
        "count": 150,
        "percentage": 30.0
      }
    ],
    "dailyTrend": [{ "date": "2025-12-01", "count": 25 }],
    "averagePerDay": 16.7,
    "generatedAt": "2025-12-02T11:00:00Z"
  }
}
```

**Error Codes:**

- `403 FORBIDDEN`: Doctor trying to view other doctor's statistics

---

## 8.3 Doctor Performance Report

**Endpoint:** `GET /api/reports/doctors/performance`  
**Access:** ADMIN only

**Query Parameters:**

- `startDate`, `endDate` (date, required)
- `departmentId` (string, optional)

**Response:** `200 OK`

```json
{
  "status": "success",
  "data": {
    "period": { "startDate": "2025-12-01", "endDate": "2025-12-31" },
    "doctors": [
      {
        "doctorId": "emp001",
        "doctorName": "Dr. Nguyen Van Hung",
        "department": "Cardiology",
        "statistics": {
          "totalAppointments": 80,
          "completedAppointments": 75,
          "cancelledAppointments": 3,
          "noShows": 2,
          "completionRate": 93.8,
          "totalRevenue": 8000000,
          "averageRevenuePerAppointment": 100000,
          "patientsSeen": 60,
          "prescriptionsWritten": 65
        }
      }
    ],
    "generatedAt": "2025-12-02T11:00:00Z"
  }
}
```

---

## 8.4 Patient Activity Report

**Endpoint:** `GET /api/reports/patients/activity`  
**Access:** ADMIN only

**Query Parameters:**

- `startDate`, `endDate` (date, required)

**Response:** `200 OK`

```json
{
  "status": "success",
  "data": {
    "period": { "startDate": "2025-12-01", "endDate": "2025-12-31" },
    "totalPatients": 1500,
    "newPatients": 50,
    "activePatients": 300,
    "patientsByGender": { "MALE": 700, "FEMALE": 750, "OTHER": 50 },
    "patientsByBloodType": { "O+": 450, "A+": 400, "B+": 300 },
    "averageAge": 42.5,
    "topDiagnoses": [{ "diagnosis": "Hypertension", "count": 80 }],
    "generatedAt": "2025-12-02T11:00:00Z"
  }
}
```

---

## 8.5 Clear Report Cache

**Endpoint:** `DELETE /api/reports/cache`  
**Access:** ADMIN only

**Query Parameters:**

- `reportType` (string, optional): revenue, appointments, doctors, patients
  - If not provided, clears all caches

**Response:** `200 OK`

```json
{
  "status": "success",
  "data": {
    "message": "Cache cleared successfully",
    "clearedTypes": ["revenue", "appointments", "doctors", "patients"],
    "clearedAt": "2025-12-02T11:00:00Z"
  }
}
```

**Error Codes:**

- `400 VALIDATION_ERROR`: reportType must be valid
- `403 FORBIDDEN`: Requires ADMIN role
