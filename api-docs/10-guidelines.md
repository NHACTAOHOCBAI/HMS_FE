# 🚀 API Development Guidelines

## 1. Consistent Response Format

All APIs return JSON with standard structure:

```json
{
  "status": "success|error",
  "data": {...} | "error": {...},
  "timestamp": "ISO 8601 datetime"
}
```

---

## 2. Pagination Standards

- Default page size: 20
- Max page size: 100
- Page numbers start at 0
- Sort format: `field,direction` (e.g., `createdAt,desc`)

---

## 3. RSQL Search Syntax

- Equality: `field==value`
- Like: `field=like='*pattern*'`
- Comparison: `field>value`, `field<value`
- AND: `;` (e.g., `field1==value1;field2==value2`)
- OR: `,` (e.g., `field==value1,field==value2`)

---

## 4. Date/Time Formats

- Date: `YYYY-MM-DD` (ISO 8601)
- DateTime: `YYYY-MM-DDTHH:mm:ssZ` (ISO 8601 with timezone)
- Time: `HH:mm` (24-hour format)

---

## 5. Security Best Practices

- All endpoints (except auth) require JWT
- API Gateway validates JWT before routing
- Services receive user context via headers
- Implement rate limiting (10 req/sec per user)
- Log all API calls for audit

---

## 6. Error Handling

- Return appropriate HTTP status codes
- Include detailed error messages
- Use application error codes for client handling
- Never expose stack traces in production

---

## 📖 Postman Collection

**Collection Name:** HMS Backend - 3 Week MVP

**Variables:**

- `baseUrl`: `http://localhost:8080`
- `accessToken`: (auto-updated from login)
- `patientId`, `doctorId`, `appointmentId`: Test data IDs

**Folders:**

1. Auth Service (5 requests)
2. Patient Service (5 requests)
3. Medicine Service (10 requests)
4. HR Service (15 requests)
5. Appointment Service (8 requests)
6. Medical Exam Service (12 requests)
7. Billing Service (12 requests)
8. Reports Service (5 requests)

**Pre-request Scripts:**

- Auto-inject Authorization header
- Environment variable management

**Tests:**

- Validate response status
- Extract and save tokens/IDs
- Verify response schema
