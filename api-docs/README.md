# HMS API Documentation

**Project:** HMS Backend  
**Scope:** 3-Week MVP Implementation (6 New Services + Foundation Enhancement)  
**API Gateway:** Spring Cloud Gateway (Port 8080)  
**Architecture:** RESTful APIs with JWT Authentication  
**Date:** December 2, 2025

---

## 🎯 Overview

This documentation defines ALL API contracts for the 3-week MVP, including:

- **Total Services:** 8 services (3 existing enhanced + 5 new)
- **Total Endpoints:** ~95 REST endpoints
- **Authentication:** JWT Bearer tokens via API Gateway
- **Response Format:** JSON with consistent structure
- **Error Handling:** Standard HTTP status codes + error response schema

---

## 📚 Documentation Index

| Document                                                   | Description                                                      |
| ---------------------------------------------------------- | ---------------------------------------------------------------- |
| [00-common.md](./00-common.md)                             | API Gateway Architecture, Authentication, RBAC, Response Schemas |
| [01-auth-service.md](./01-auth-service.md)                 | Auth Service API - User authentication and token management      |
| [02-patient-service.md](./02-patient-service.md)           | Patient Service API - Patient profile and health information     |
| [03-medicine-service.md](./03-medicine-service.md)         | Medicine Service API - Medicine catalog and inventory management |
| [04-hr-service.md](./04-hr-service.md)                     | HR Service API - Staff and department management                 |
| [05-appointment-service.md](./05-appointment-service.md)   | Appointment Service API - Patient appointment booking            |
| [06-medical-exam-service.md](./06-medical-exam-service.md) | Medical Exam Service API - Examinations and prescriptions        |
| [07-billing-service.md](./07-billing-service.md)           | Billing Service API - Invoice and payment management             |
| [08-reports-service.md](./08-reports-service.md)           | Reports Service API - Analytics and reporting                    |
| [09-error-codes.md](./09-error-codes.md)                   | Error Codes Reference and HTTP Status Codes                      |
| [10-guidelines.md](./10-guidelines.md)                     | API Development Guidelines and Best Practices                    |

---

## 🏗️ Service Architecture

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

## 📊 Endpoint Count by Service

| Service                  | Endpoints | Entity Resources                            |
| ------------------------ | --------- | ------------------------------------------- |
| **Auth Service**         | 5         | Account                                     |
| **Patient Service**      | 5         | Patient                                     |
| **Medicine Service**     | 10        | Medicine, Category                          |
| **HR Service**           | 15        | Department, Employee, DoctorSchedule        |
| **Appointment Service**  | 8         | Appointment                                 |
| **Medical Exam Service** | 12        | MedicalExam, Prescription, PrescriptionItem |
| **Billing Service**      | 12        | Invoice, InvoiceItem, Payment               |
| **Reports Service**      | 5         | ReportCache                                 |
| **TOTAL**                | **~95**   | **15 entities**                             |

---

**Total APIs: ~95 endpoints across 8 services** 🚀
