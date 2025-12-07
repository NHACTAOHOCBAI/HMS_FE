# 🏥 HR Service API

**Base Path:** `/api/hr`  
**Service Port:** 8084  
**Purpose:** Hospital staff and department management

---

## 4.1 Department APIs

### Create Department

**Endpoint:** `POST /api/hr/departments`  
**Access:** ADMIN

**Request Body:**

```json
{
  "name": "Cardiology",
  "description": "Heart and cardiovascular diseases",
  "location": "Building A - Floor 3",
  "phoneExtension": "301",
  "status": "ACTIVE"
}
```

**Response:** `201 Created`

```json
{
  "status": "success",
  "data": {
    "id": "dept001",
    "name": "Cardiology",
    "description": "Heart and cardiovascular diseases",
    "location": "Building A - Floor 3",
    "phoneExtension": "301",
    "status": "ACTIVE",
    "createdAt": "2025-12-02T10:30:00Z"
  }
}
```

**Error Codes:**

- `400 VALIDATION_ERROR`: Input validation failed
  • name is required
  • name exceeds maximum length (255 characters)
  • status must be one of [ACTIVE, INACTIVE]
- `403 FORBIDDEN`: User role not authorized (requires ADMIN)
- `409 DEPARTMENT_NAME_EXISTS`: Department name already exists

---

### Get Department by ID

**Endpoint:** `GET /api/hr/departments/{id}`  
**Access:** Authenticated  
**Description:** Retrieve department details by ID

**Path Parameters:**

- `id` (string): Department UUID

**Response:** `200 OK`

```json
{
  "status": "success",
  "data": {
    "id": "dept001",
    "name": "Cardiology",
    "description": "Heart and cardiovascular diseases",
    "location": "Building A - Floor 3",
    "phoneExtension": "301",
    "status": "ACTIVE",
    "headDoctorId": "emp001",
    "headDoctor": {
      "id": "emp001",
      "fullName": "Dr. Nguyen Van Hung"
    },
    "createdAt": "2025-12-02T10:30:00Z",
    "updatedAt": "2025-12-02T10:30:00Z"
  }
}
```

**Error Codes:**

- `401 UNAUTHORIZED`: Missing or invalid access token
- `404 DEPARTMENT_NOT_FOUND`: Department doesn't exist

---

### List Departments

**Endpoint:** `GET /api/hr/departments`  
**Access:** Authenticated  
**Description:** List all departments with optional filters

**Query Parameters:**

- `page` (int, default=0): Page number
- `size` (int, default=20, max=100): Page size
- `sort` (string, default=name,asc): Sort field and direction
- `status` (string): Filter by ACTIVE/INACTIVE
- `search` (string): RSQL search query

**Response:** `200 OK`

```json
{
  "status": "success",
  "data": {
    "content": [
      {
        "id": "dept001",
        "name": "Cardiology",
        "description": "Heart and cardiovascular diseases",
        "location": "Building A - Floor 3",
        "status": "ACTIVE",
        "headDoctor": {
          "id": "emp001",
          "fullName": "Dr. Nguyen Van Hung"
        }
      }
    ],
    "page": 0,
    "size": 20,
    "totalElements": 10,
    "totalPages": 1
  }
}
```

**Error Codes:**

- `401 UNAUTHORIZED`: Missing or invalid access token

---

### Update Department

**Endpoint:** `PATCH /api/hr/departments/{id}`  
**Access:** ADMIN  
**Description:** Partial update department information

**Request Body:** (All fields optional)

```json
{
  "name": "Cardiology - Updated",
  "description": "Heart and cardiovascular diseases - Updated",
  "location": "Building B - Floor 2",
  "phoneExtension": "302",
  "status": "ACTIVE",
  "headDoctorId": "emp002"
}
```

**Response:** `200 OK`

```json
{
  "status": "success",
  "data": {
    "id": "dept001",
    "name": "Cardiology - Updated",
    "description": "Heart and cardiovascular diseases - Updated",
    "location": "Building B - Floor 2",
    "phoneExtension": "302",
    "status": "ACTIVE",
    "headDoctorId": "emp002",
    "headDoctor": {
      "id": "emp002",
      "fullName": "Dr. Tran Van B"
    },
    "createdAt": "2025-12-02T10:30:00Z",
    "updatedAt": "2025-12-02T11:00:00Z"
  }
}
```

**Error Codes:**

- `400 VALIDATION_ERROR`: Input validation failed
  • name exceeds maximum length (255 characters)
  • status must be one of [ACTIVE, INACTIVE]
- `403 FORBIDDEN`: User role not authorized (requires ADMIN)
- `404 DEPARTMENT_NOT_FOUND`: Department doesn't exist
- `404 EMPLOYEE_NOT_FOUND`: Head doctor ID doesn't exist (if headDoctorId provided)
- `409 DEPARTMENT_NAME_EXISTS`: Department name already exists (if name changed)

---

### Delete Department

**Endpoint:** `DELETE /api/hr/departments/{id}`  
**Access:** ADMIN only  
**Description:** Delete department (only if no employees assigned)

**Response:** `204 No Content`

**Business Rules:**

- Cannot delete department if employees are assigned to it
- Consider setting status to INACTIVE instead of deleting

**Error Codes:**

- `403 FORBIDDEN`: User role not authorized (requires ADMIN)
- `404 DEPARTMENT_NOT_FOUND`: Department doesn't exist
- `409 DEPARTMENT_HAS_EMPLOYEES`: Cannot delete department with assigned employees

---

## 4.2 Employee APIs

### Create Employee

**Endpoint:** `POST /api/hr/employees`  
**Access:** ADMIN

**Request Body:**

```json
{
  "accountId": "550e8400-e29b-41d4-a716-446655440003",
  "fullName": "Dr. Nguyen Van Hung",
  "role": "DOCTOR",
  "departmentId": "dept001",
  "specialization": "Interventional Cardiology",
  "licenseNumber": "MD-12345",
  "email": "dr.hung@hms.com",
  "phoneNumber": "0901111111",
  "address": "456 Hospital St",
  "status": "ACTIVE",
  "hiredAt": "2020-01-15"
}
```

**Validation:**

- `role`: One of [DOCTOR, NURSE, RECEPTIONIST, ADMIN]
- `departmentId`: Required for DOCTOR/NURSE
- `licenseNumber`: Required for DOCTOR/NURSE, unique

**Response:** `201 Created`

```json
{
  "status": "success",
  "data": {
    "id": "emp001",
    "accountId": "550e8400-e29b-41d4-a716-446655440003",
    "fullName": "Dr. Nguyen Van Hung",
    "role": "DOCTOR",
    "department": {
      "id": "dept001",
      "name": "Cardiology"
    },
    "specialization": "Interventional Cardiology",
    "licenseNumber": "MD-12345",
    "email": "dr.hung@hms.com",
    "phoneNumber": "0901111111",
    "address": "456 Hospital St",
    "status": "ACTIVE",
    "hiredAt": "2020-01-15T00:00:00Z",
    "createdAt": "2025-12-02T10:30:00Z"
  }
}
```

**Error Codes:**

- `400 VALIDATION_ERROR`: Input validation failed
  • fullName is required
  • fullName exceeds maximum length (255 characters)
  • role is required
  • role must be one of [DOCTOR, NURSE, RECEPTIONIST, ADMIN]
  • departmentId is required for DOCTOR and NURSE roles
  • licenseNumber is required for DOCTOR and NURSE roles
  • email must be valid format
  • phoneNumber must be valid Vietnamese format
  • hiredAt must be valid ISO 8601 date
  • status must be one of [ACTIVE, ON_LEAVE, RESIGNED]
- `404 ACCOUNT_NOT_FOUND`: Account ID doesn't exist
- `404 DEPARTMENT_NOT_FOUND`: Department ID doesn't exist
- `409 LICENSE_NUMBER_EXISTS`: License number already in use

---

### Get Employee by ID

**Endpoint:** `GET /api/hr/employees/{id}`  
**Access:** Authenticated  
**Description:** Retrieve employee details by ID

**Path Parameters:**

- `id` (string): Employee UUID

**Response:** `200 OK`

```json
{
  "status": "success",
  "data": {
    "id": "emp001",
    "accountId": "550e8400-e29b-41d4-a716-446655440003",
    "fullName": "Dr. Nguyen Van Hung",
    "role": "DOCTOR",
    "department": {
      "id": "dept001",
      "name": "Cardiology",
      "location": "Building A - Floor 3"
    },
    "specialization": "Interventional Cardiology",
    "licenseNumber": "MD-12345",
    "email": "dr.hung@hms.com",
    "phoneNumber": "0901111111",
    "address": "456 Hospital St",
    "status": "ACTIVE",
    "hiredAt": "2020-01-15T00:00:00Z",
    "createdAt": "2025-12-02T10:30:00Z",
    "updatedAt": "2025-12-02T10:30:00Z"
  }
}
```

**Error Codes:**

- `401 UNAUTHORIZED`: Missing or invalid access token
- `404 EMPLOYEE_NOT_FOUND`: Employee doesn't exist

---

### List Employees

**Endpoint:** `GET /api/hr/employees`  
**Access:** Authenticated  
**Description:** List all employees with pagination and filters

**Query Parameters:**

- `page` (int, default=0): Page number
- `size` (int, default=20, max=100): Page size
- `sort` (string, default=fullName,asc): Sort field and direction
- `departmentId` (string): Filter by department
- `role` (string): Filter by role (DOCTOR, NURSE, RECEPTIONIST, ADMIN)
- `status` (string): Filter by status (ACTIVE, ON_LEAVE, RESIGNED)
- `search` (string): RSQL search query

**RSQL Examples:**

- `fullName=like='*Nguyen*'`
- `role==DOCTOR;status==ACTIVE`
- `specialization=like='*Cardio*'`

**Response:** `200 OK`

```json
{
  "status": "success",
  "data": {
    "content": [
      {
        "id": "emp001",
        "fullName": "Dr. Nguyen Van Hung",
        "role": "DOCTOR",
        "department": {
          "id": "dept001",
          "name": "Cardiology"
        },
        "specialization": "Interventional Cardiology",
        "email": "dr.hung@hms.com",
        "phoneNumber": "0901111111",
        "status": "ACTIVE"
      }
    ],
    "page": 0,
    "size": 20,
    "totalElements": 50,
    "totalPages": 3
  }
}
```

**Error Codes:**

- `401 UNAUTHORIZED`: Missing or invalid access token

---

### Update Employee

**Endpoint:** `PATCH /api/hr/employees/{id}`  
**Access:** ADMIN  
**Description:** Partial update employee information

**Request Body:** (All fields optional)

```json
{
  "fullName": "Dr. Nguyen Van Hung - Updated",
  "departmentId": "dept002",
  "specialization": "Pediatric Cardiology",
  "email": "dr.hung.updated@hms.com",
  "phoneNumber": "0901111112",
  "address": "789 New Hospital St",
  "status": "ON_LEAVE"
}
```

**Response:** `200 OK`

```json
{
  "status": "success",
  "data": {
    "id": "emp001",
    "accountId": "550e8400-e29b-41d4-a716-446655440003",
    "fullName": "Dr. Nguyen Van Hung - Updated",
    "role": "DOCTOR",
    "department": {
      "id": "dept002",
      "name": "Pediatrics"
    },
    "specialization": "Pediatric Cardiology",
    "licenseNumber": "MD-12345",
    "email": "dr.hung.updated@hms.com",
    "phoneNumber": "0901111112",
    "address": "789 New Hospital St",
    "status": "ON_LEAVE",
    "hiredAt": "2020-01-15T00:00:00Z",
    "createdAt": "2025-12-02T10:30:00Z",
    "updatedAt": "2025-12-02T11:00:00Z"
  }
}
```

**Error Codes:**

- `400 VALIDATION_ERROR`: Input validation failed
  • fullName exceeds maximum length (255 characters)
  • role must be one of [DOCTOR, NURSE, RECEPTIONIST, ADMIN]
  • departmentId is required for DOCTOR and NURSE roles
  • licenseNumber is required for DOCTOR and NURSE roles
  • email must be valid format
  • phoneNumber must be valid Vietnamese format
  • hiredAt must be valid ISO 8601 date
  • status must be one of [ACTIVE, ON_LEAVE, RESIGNED]
- `403 FORBIDDEN`: User role not authorized (requires ADMIN)
- `404 EMPLOYEE_NOT_FOUND`: Employee doesn't exist
- `404 DEPARTMENT_NOT_FOUND`: Department ID doesn't exist (if departmentId provided)
- `409 LICENSE_NUMBER_EXISTS`: License number already exists (if licenseNumber changed)

---

### Delete Employee (Soft Delete)

**Endpoint:** `DELETE /api/hr/employees/{id}`  
**Access:** ADMIN only  
**Description:** Soft delete employee (marks as deleted, preserves audit trail)

**Response:** `200 OK`

```json
{
  "status": "success",
  "data": {
    "id": "emp001",
    "deletedAt": "2025-12-05T14:00:00Z",
    "deletedBy": "550e8400-e29b-41d4-a716-446655440001"
  }
}
```

**Business Rules:**

- Employee record is NOT permanently deleted (soft delete only)
- Sets `deletedAt` timestamp and `deletedBy` user ID
- Validates no future appointments exist before deletion
- Deleted employees excluded from all list queries

**Error Codes:**

- `403 FORBIDDEN`: User role not authorized (requires ADMIN)
- `404 EMPLOYEE_NOT_FOUND`: Employee doesn't exist or already deleted
- `409 HAS_FUTURE_APPOINTMENTS`: Cannot delete employee with scheduled future appointments

---

### List Doctors by Department

**Endpoint:** `GET /api/hr/doctors`  
**Access:** Authenticated  
**Description:** List doctors for appointment booking, filtered by department or specialization

**Query Parameters:**

- `departmentId` (string, optional): Filter by department UUID
- `specialization` (string, optional): Filter by specialization keyword
- `status` (string, optional): Filter by status (default: ACTIVE only)
- `page` (integer, optional): Page number (default: 0)
- `size` (integer, optional): Page size (default: 20, max: 100)

**Response:** `200 OK`

```json
{
  "status": "success",
  "data": {
    "content": [
      {
        "id": "emp001",
        "fullName": "Dr. Nguyen Van Hung",
        "department": {
          "id": "dept001",
          "name": "Cardiology"
        },
        "specialization": "Interventional Cardiology",
        "licenseNumber": "MD-12345",
        "phoneNumber": "0901111111",
        "email": "dr.hung@hms.com",
        "status": "ACTIVE"
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

- `400 VALIDATION_ERROR`: Invalid query parameters
  • page must be >= 0
  • size must be between 1 and 100
- `404 DEPARTMENT_NOT_FOUND`: departmentId doesn't exist (if provided)

---

## 4.3 Employee Schedule APIs

### Create Employee Schedule

**Endpoint:** `POST /api/hr/schedules`  
**Access:** ADMIN only  
**Description:** Create work schedule for any employee (doctor, nurse, receptionist, admin). Only administrators can create schedules to ensure proper coverage and coordination.

**Request Body:**

```json
{
  "employeeId": "emp001",
  "workDate": "2025-12-05",
  "startTime": "08:00",
  "endTime": "17:00",
  "status": "AVAILABLE",
  "notes": "Regular working hours"
}
```

**Validation:**

- `workDate`: Cannot be in the past
- `startTime` < `endTime`
- Unique constraint: (employeeId, workDate) - one schedule per employee per day

**Response:** `201 Created`

```json
{
  "status": "success",
  "data": {
    "id": "sch001",
    "employeeId": "emp001",
    "employee": {
      "id": "emp001",
      "fullName": "Dr. Nguyen Van Hung",
      "role": "DOCTOR",
      "department": {
        "id": "dept001",
        "name": "Cardiology"
      }
    },
    "workDate": "2025-12-05",
    "startTime": "08:00",
    "endTime": "17:00",
    "status": "AVAILABLE",
    "notes": "Regular working hours",
    "createdAt": "2025-12-02T10:30:00Z",
    "createdBy": "550e8400-e29b-41d4-a716-446655440001"
  }
}
```

**Error Codes:**

- `400 VALIDATION_ERROR`: Input validation failed
  • employeeId is required
  • workDate is required
  • workDate must be valid ISO 8601 date (YYYY-MM-DD)
  • workDate cannot be in the past
  • startTime is required (format: HH:mm)
  • endTime is required (format: HH:mm)
  • startTime must be before endTime
  • status must be one of [AVAILABLE, BOOKED, CANCELLED]
- `403 FORBIDDEN`: User role not authorized (requires ADMIN)
- `404 EMPLOYEE_NOT_FOUND`: Employee ID doesn't exist
- `409 SCHEDULE_EXISTS`: Schedule already exists for this employee on this date

---

### Get Own Schedules

**Endpoint:** `GET /api/hr/schedules/me`  
**Access:** Authenticated (any employee)  
**Description:** Get current user's own schedules within date range

**Query Parameters:**

- `startDate` (date, required): Start date (YYYY-MM-DD)
- `endDate` (date, required): End date (YYYY-MM-DD)
- `status` (string, optional): Filter by status (AVAILABLE, BOOKED, CANCELLED)

**Response:** `200 OK`

```json
{
  "status": "success",
  "data": [
    {
      "id": "sch001",
      "workDate": "2025-12-05",
      "startTime": "08:00",
      "endTime": "17:00",
      "status": "AVAILABLE",
      "notes": "Regular working hours",
      "createdAt": "2025-12-02T10:30:00Z"
    }
  ]
}
```

**Error Codes:**

- `400 VALIDATION_ERROR`: Input validation failed
  • startDate is required
  • endDate is required
  • startDate cannot be after endDate

---

### List Doctor Schedules (for Appointment Booking)

**Endpoint:** `GET /api/hr/schedules/doctors`  
**Access:** Authenticated  
**Description:** List available doctor schedules for appointment booking. Filters only DOCTOR role employees.

**Query Parameters:**

- `departmentId` (string, optional): Filter by department
- `doctorId` (string, optional): Filter by specific doctor
- `startDate` (date, required): Start date (YYYY-MM-DD)
- `endDate` (date, required): End date (YYYY-MM-DD)
- `status` (string, optional): Filter by status (default: AVAILABLE)
- `page` (integer, optional): Page number (default: 0)
- `size` (integer, optional): Page size (default: 20, max: 100)
- `sort` (string, optional): Sort field (default: workDate,asc)

**Response:** `200 OK`

```json
{
  "status": "success",
  "data": {
    "content": [
      {
        "id": "sch001",
        "workDate": "2025-12-05",
        "startTime": "08:00",
        "endTime": "17:00",
        "status": "AVAILABLE",
        "doctor": {
          "id": "emp001",
          "fullName": "Dr. Nguyen Van Hung",
          "specialization": "Interventional Cardiology",
          "department": {
            "id": "dept001",
            "name": "Cardiology"
          }
        }
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

- `400 VALIDATION_ERROR`: Input validation failed
  • startDate is required
  • endDate is required
  • startDate cannot be after endDate
  • page must be >= 0
  • size must be between 1 and 100
- `404 DEPARTMENT_NOT_FOUND`: Department ID doesn't exist (if departmentId provided)
- `404 EMPLOYEE_NOT_FOUND`: Doctor ID doesn't exist (if doctorId provided)

---

### Update Employee Schedule

**Endpoint:** `PATCH /api/hr/schedules/{id}`  
**Access:** ADMIN only  
**Description:** Update schedule details (employee, time, status, notes). Only administrators can modify schedules.

**Request Body:** (All fields optional)

```json
{
  "employeeId": "emp002",
  "workDate": "2025-12-06",
  "startTime": "09:00",
  "endTime": "18:00",
  "status": "AVAILABLE",
  "notes": "Updated schedule - reassigned to different employee"
}
```

**Validation:**

- `employeeId`: Must exist in employees table (if provided)
- `workDate`: Cannot be in the past (if provided)
- `startTime` < `endTime` (if either provided)
- Unique constraint: (employeeId, workDate) - cannot create duplicate

**Response:** `200 OK`

```json
{
  "status": "success",
  "data": {
    "id": "sch001",
    "employeeId": "emp002",
    "employee": {
      "id": "emp002",
      "fullName": "Nurse Tran Thi B",
      "role": "NURSE",
      "department": {
        "id": "dept001",
        "name": "Cardiology"
      }
    },
    "workDate": "2025-12-06",
    "startTime": "09:00",
    "endTime": "18:00",
    "status": "AVAILABLE",
    "notes": "Updated schedule - reassigned to different employee",
    "createdAt": "2025-12-02T10:30:00Z",
    "createdBy": "550e8400-e29b-41d4-a716-446655440001",
    "updatedAt": "2025-12-02T11:00:00Z",
    "updatedBy": "550e8400-e29b-41d4-a716-446655440001"
  }
}
```

**Error Codes:**

- `400 VALIDATION_ERROR`: Input validation failed
  • workDate must be valid ISO 8601 date (YYYY-MM-DD)
  • workDate cannot be in the past
  • startTime must be valid format (HH:mm)
  • endTime must be valid format (HH:mm)
  • startTime must be before endTime
  • status must be one of [AVAILABLE, BOOKED, CANCELLED]
  • notes exceeds maximum length (1000 characters)
- `403 FORBIDDEN`: User role not authorized (requires ADMIN)
- `404 SCHEDULE_NOT_FOUND`: Schedule doesn't exist
- `404 EMPLOYEE_NOT_FOUND`: Employee ID doesn't exist (if employeeId provided)
- `409 SCHEDULE_EXISTS`: Schedule already exists for employee on this date (if employeeId or workDate changed)
- `409 HAS_APPOINTMENTS`: Cannot modify schedule with booked appointments

**Note:** The Appointment Service uses this endpoint internally to update schedule status to `BOOKED` when appointments are created.

---

### Delete Employee Schedule

**Endpoint:** `DELETE /api/hr/schedules/{id}`  
**Access:** ADMIN only  
**Description:** Delete an employee schedule. Only administrators can delete schedules.

**Response:** `204 No Content`

**Business Rules:**

- Cannot delete schedule with booked appointments (status = BOOKED)
- Consider setting status to CANCELLED instead

**Error Codes:**

- `403 FORBIDDEN`: User role not authorized (requires ADMIN)
- `404 SCHEDULE_NOT_FOUND`: Schedule doesn't exist
- `409 HAS_APPOINTMENTS`: Cannot delete schedule with booked appointments
