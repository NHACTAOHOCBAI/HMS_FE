# 🔧 Error Codes Reference

## HTTP Status Codes

| Code  | Meaning               | Usage                                               |
| ----- | --------------------- | --------------------------------------------------- |
| `200` | OK                    | Successful GET, PUT, PATCH                          |
| `201` | Created               | Successful POST (resource created)                  |
| `204` | No Content            | Successful DELETE                                   |
| `400` | Bad Request           | Validation errors, invalid input                    |
| `401` | Unauthorized          | Missing/invalid JWT token                           |
| `403` | Forbidden             | Valid token but insufficient permissions            |
| `404` | Not Found             | Resource doesn't exist                              |
| `409` | Conflict              | Resource conflict (duplicate, constraint violation) |
| `500` | Internal Server Error | Server-side error                                   |

---

## Application Error Codes

| Code                        | HTTP Status | Description               |
| --------------------------- | ----------- | ------------------------- |
| `VALIDATION_ERROR`          | 400         | Input validation failed   |
| `INVALID_CREDENTIALS`       | 401         | Wrong email/password      |
| `INVALID_TOKEN`             | 401         | JWT token expired/invalid |
| `FORBIDDEN`                 | 403         | Insufficient permissions  |
| `NOT_FOUND`                 | 404         | Resource not found        |
| `EMAIL_ALREADY_EXISTS`      | 409         | Duplicate email           |
| `SCHEDULE_EXISTS`           | 409         | Schedule already exists   |
| `INSUFFICIENT_STOCK`        | 400         | Not enough medicine       |
| `APPOINTMENT_NOT_COMPLETED` | 400         | Prerequisite not met      |
| `DOCTOR_NOT_AVAILABLE`      | 409         | Doctor unavailable        |
| `TIME_SLOT_TAKEN`           | 409         | Appointment slot taken    |

---

## Auth Service Errors

- `EMAIL_ALREADY_EXISTS` - Email already registered
- `INVALID_CREDENTIALS` - Wrong email/password
- `INVALID_TOKEN` - Token expired/invalid/revoked

## Patient Service Errors

- `PATIENT_NOT_FOUND` - Patient doesn't exist
- `ACCOUNT_NOT_FOUND` - Account ID doesn't exist
- `HAS_FUTURE_APPOINTMENTS` - Cannot delete with scheduled appointments

## Medicine Service Errors

- `MEDICINE_NOT_FOUND` - Medicine doesn't exist
- `CATEGORY_NOT_FOUND` - Category doesn't exist
- `INSUFFICIENT_STOCK` - Not enough stock
- `MEDICINE_IN_USE` - Referenced in prescriptions
- `CATEGORY_ALREADY_EXISTS` - Duplicate category name
- `CATEGORY_HAS_MEDICINES` - Category has assigned medicines

## HR Service Errors

- `DEPARTMENT_NOT_FOUND` - Department doesn't exist
- `DEPARTMENT_NAME_EXISTS` - Duplicate department name
- `DEPARTMENT_HAS_EMPLOYEES` - Has assigned employees
- `EMPLOYEE_NOT_FOUND` - Employee doesn't exist
- `LICENSE_NUMBER_EXISTS` - Duplicate license number
- `SCHEDULE_NOT_FOUND` - Schedule doesn't exist
- `SCHEDULE_EXISTS` - Schedule already exists for date
- `HAS_APPOINTMENTS` - Cannot modify booked schedule

## Appointment Service Errors

- `APPOINTMENT_NOT_FOUND` - Appointment doesn't exist
- `PAST_APPOINTMENT` - Time cannot be in the past
- `DOCTOR_NOT_AVAILABLE` - No schedule for date/time
- `TIME_SLOT_TAKEN` - Slot already booked
- `APPOINTMENT_NOT_MODIFIABLE` - Cannot modify finalized appointment
- `APPOINTMENT_NOT_CANCELLABLE` - Cannot cancel completed/no-show
- `ALREADY_CANCELLED` - Already cancelled
- `ALREADY_COMPLETED` - Already completed

## Medical Exam Service Errors

- `EXAM_NOT_FOUND` - Exam doesn't exist
- `EXAM_EXISTS` - Exam already exists for appointment
- `APPOINTMENT_NOT_COMPLETED` - Appointment not completed
- `EXAM_NOT_MODIFIABLE` - Cannot modify after 24 hours
- `PRESCRIPTION_NOT_FOUND` - Prescription doesn't exist
- `PRESCRIPTION_EXISTS` - Prescription already exists

## Billing Service Errors

- `INVOICE_NOT_FOUND` - Invoice doesn't exist
- `INVOICE_EXISTS` - Invoice already exists
- `INVOICE_ALREADY_PAID` - Already fully paid
- `INVOICE_CANCELLED` - Cannot pay cancelled invoice
- `PAYMENT_NOT_FOUND` - Payment doesn't exist
- `DUPLICATE_PAYMENT` - Idempotency key already used
