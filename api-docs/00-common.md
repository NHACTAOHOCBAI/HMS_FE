# Common API Documentation

## 📊 API Gateway Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     API Gateway (Port 8080)                 │
│                   JWT Validation + Routing                  │
│                                                             │
│  Headers Injected to All Services:                          │
│  - X-User-ID: {userId}                                      │
│  - X-User-Role: {ADMIN|PATIENT|DOCTOR|NURSE|EMPLOYEE}       │
│  - X-User-Email: {email}                                    │
└──────────────────────────────┬──────────────────────────────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
┌───────▼─────────┐  ┌─────────▼──────────┐  ┌──────▼──────────┐
│  Auth Service   │  │  Patient Service   │  │ Medicine Service│
│  Port: 8081     │  │  Port: 8082        │  │ Port: 8083      │
│  /api/auth/**   │  │  /api/patients/**  │  │ /api/medicines/**│
└─────────────────┘  └────────────────────┘  └─────────────────┘

┌─────────────────┐  ┌─────────────────────┐  ┌──────────────────┐
│   HR Service    │  │ Appointment Service │  │ Medical Exam Svc │
│  Port: 8084     │  │  Port: 8085         │  │ Port: 8086       │
│  /api/hr/**     │  │  /api/appointments/**│  │ /api/exams/**    │
└─────────────────┘  └─────────────────────┘  └──────────────────┘

┌─────────────────┐  ┌─────────────────────┐
│ Billing Service │  │  Reports Service    │
│  Port: 8087     │  │  Port: 8088         │
│  /api/billing/**│  │  /api/reports/**    │
└─────────────────┘  └─────────────────────┘
```

**Base URL:** `http://localhost:8080` (API Gateway)  
**All requests routed through API Gateway**

---

## 🔐 Authentication & Authorization

### Global Headers

**All authenticated requests must include:**

```http
Authorization: Bearer {JWT_TOKEN}
```

**API Gateway automatically injects these headers to downstream services:**

```http
X-User-ID: 550e8400-e29b-41d4-a716-446655440001
X-User-Role: DOCTOR
X-User-Email: doctor1@hms.com
```

### Role-Based Access Control (RBAC)

| Role         | Permissions                                                                          |
| ------------ | ------------------------------------------------------------------------------------ |
| **ADMIN**    | Full access to all endpoints                                                         |
| **DOCTOR**   | Read/Write patients, appointments, exams, prescriptions; Read HR, medicines, billing |
| **NURSE**    | Read/Write patients, appointments; Read exams, medicines                             |
| **PATIENT**  | Read own data (patients, appointments, exams, invoices); Create appointments         |
| **EMPLOYEE** | Read patients, appointments, medicines                                               |

---

## 📋 Standard Response Schemas

### Success Response

```json
{
  "status": "success",
  "data": {
    // Response data here
  },
  "timestamp": "2025-12-02T10:30:00Z"
}
```

### Error Response

```json
{
  "status": "error",
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed for one or more fields",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  },
  "timestamp": "2025-12-02T10:30:00Z"
}
```

### Paginated Response

```json
{
  "status": "success",
  "data": {
    "content": [...],
    "page": 0,
    "size": 20,
    "totalElements": 150,
    "totalPages": 8,
    "first": true,
    "last": false
  },
  "timestamp": "2025-12-02T10:30:00Z"
}
```
