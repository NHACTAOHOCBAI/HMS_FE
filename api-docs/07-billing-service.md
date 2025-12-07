# 💰 Billing Service API

**Base Path:** `/api/billing`  
**Service Port:** 8087  
**Purpose:** Invoice and payment management

---

## 7.1 Auto-Generate Invoice

**Endpoint:** `POST /api/billing/invoices/generate`  
**Access:** Internal (triggered by prescription creation)

**Request Body:**

```json
{ "appointmentId": "apt001" }
```

**Business Logic:**

1. Fetch appointment details
2. Add consultation fee (based on doctor's department)
3. Fetch prescription items (required)
4. Calculate subtotal, tax (10%), total
5. Generate invoice number (INV-YYYYMMDD-XXXX)

**Response:** `201 Created`

```json
{
  "status": "success",
  "data": {
    "id": "inv001",
    "invoiceNumber": "INV-20251205-0001",
    "patient": { "id": "p001", "fullName": "Nguyen Van A" },
    "appointment": { "id": "apt001", "appointmentTime": "2025-12-05T09:00:00" },
    "items": [
      {
        "type": "CONSULTATION",
        "description": "Cardiology Consultation",
        "amount": 200000
      },
      {
        "type": "MEDICINE",
        "description": "Amoxicillin 500mg",
        "quantity": 20,
        "unitPrice": 8000,
        "amount": 160000
      }
    ],
    "subtotal": 360000,
    "discount": 0,
    "tax": 36000,
    "totalAmount": 396000,
    "status": "UNPAID"
  }
}
```

**Error Codes:**

- `400 PRESCRIPTION_NOT_FOUND`: Invoice requires prescription
- `404 APPOINTMENT_NOT_FOUND`: Appointment doesn't exist
- `409 INVOICE_EXISTS`: Invoice already exists for appointment

---

## 7.2 Get Invoice by ID

**Endpoint:** `GET /api/billing/invoices/{id}`  
**Access:** ADMIN, PATIENT (own)

Returns full invoice with items, paidAmount, balanceDue, status.

---

## 7.3 Get Invoice by Appointment

**Endpoint:** `GET /api/billing/invoices/by-appointment/{appointmentId}`  
**Access:** ADMIN, PATIENT (own)

---

## 7.4 List Invoices

**Endpoint:** `GET /api/billing/invoices`  
**Access:** ADMIN

**Query Parameters:**

- `patientId` (string): Filter by patient
- `status` (string): UNPAID, PARTIALLY_PAID, PAID, OVERDUE, CANCELLED
- `startDate`, `endDate` (date): Date range filter
- `page` (int, default=0), `size` (int, default=20, max=100)
- `sort` (string, default=invoiceDate,desc)

---

## 7.5 Get Patient Invoices

**Endpoint:** `GET /api/billing/invoices/by-patient/{patientId}`  
**Access:** ADMIN, PATIENT (own)

**Query Parameters:**

- `status` (string): Filter by status
- `page`, `size`: Pagination

---

## 7.6 Create Payment

**Endpoint:** `POST /api/billing/payments`  
**Access:** ADMIN, PATIENT (own invoices)

**Request Body:**

```json
{
  "invoiceId": "inv001",
  "idempotencyKey": "550e8400-e29b-41d4-a716-446655440000",
  "amount": 396000,
  "method": "CASH",
  "notes": "Paid in full"
}
```

**Validation:**

- `idempotencyKey`: Required UUID (prevents duplicate payments on retry)
- `method`: CASH, CREDIT_CARD, BANK_TRANSFER, INSURANCE
- `amount`: Must be > 0 and <= remaining balance

**Idempotency Pattern:**

- Client generates new UUID per payment attempt
- On network failure/timeout, retry with SAME UUID
- Server returns existing payment if key already exists

**Side Effects:**

- Updates invoice status to PAID (fully paid) or PARTIALLY_PAID
- Calculates remaining balance

**Response:** `201 Created`

```json
{
  "status": "success",
  "data": {
    "id": "pay001",
    "invoice": {
      "id": "inv001",
      "invoiceNumber": "INV-20251205-0001",
      "totalAmount": 396000
    },
    "amount": 396000,
    "method": "CASH",
    "status": "COMPLETED",
    "paymentDate": "2025-12-05T11:00:00Z"
  }
}
```

**Error Codes:**

- `400 VALIDATION_ERROR`: Missing/invalid fields, amount exceeds balance
- `403 FORBIDDEN`: Patients can only pay own invoices
- `404 INVOICE_NOT_FOUND`: Invoice doesn't exist
- `409 DUPLICATE_PAYMENT`: Idempotency key already used (returns existing)
- `409 INVOICE_ALREADY_PAID`: Already fully paid
- `409 INVOICE_CANCELLED`: Cannot pay cancelled invoice

---

## 7.7 Get Payment by ID

**Endpoint:** `GET /api/billing/payments/{id}`  
**Access:** ADMIN, PATIENT (own)

---

## 7.8 List Payments by Invoice

**Endpoint:** `GET /api/billing/payments/by-invoice/{invoiceId}`  
**Access:** ADMIN, PATIENT (own)

**Response:**

```json
{
  "status": "success",
  "data": {
    "payments": [
      {
        "id": "pay001",
        "amount": 200000,
        "method": "CASH",
        "paymentDate": "..."
      },
      {
        "id": "pay002",
        "amount": 196000,
        "method": "CREDIT_CARD",
        "paymentDate": "..."
      }
    ],
    "totalPaid": 396000,
    "invoiceTotal": 396000,
    "remainingBalance": 0
  }
}
```
