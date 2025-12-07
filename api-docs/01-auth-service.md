# 🔑 Auth Service API

**Base Path:** `/api/auth`  
**Service Port:** 8081  
**Purpose:** User authentication and token management

---

## 1.1 Register Account (Patient Self-Registration)

**Endpoint:** `POST /api/auth/register`  
**Access:** Public  
**Description:** Self-registration for patients only. Staff accounts (ADMIN, DOCTOR, NURSE, EMPLOYEE) must be created by administrators.

**Request Body:**

```json
{
  "email": "patient1@gmail.com",
  "password": "SecurePass123!"
}
```

**Validation:**

- `email`: Required, valid email format, unique
- `password`: Required, min 8 chars, must include uppercase, lowercase, number, special char

**Response:** `201 Created`

```json
{
  "status": "success",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440002",
    "email": "patient1@gmail.com",
    "role": "PATIENT",
    "emailVerified": false,
    "createdAt": "2025-12-02T10:30:00Z"
  }
}
```

**Error Codes:**

- `400 VALIDATION_ERROR`: Input validation failed
  • email is required
  • email must be valid format (user@domain.com)
  • password is required
  • password must be at least 8 characters
  • password must contain uppercase letter
  • password must contain lowercase letter
  • password must contain number
  • password must contain special character
- `409 EMAIL_ALREADY_EXISTS`: Email already registered

---

## 1.2 Create Account (Admin)

**Endpoint:** `POST /api/auth/accounts`  
**Access:** ADMIN only  
**Description:** Create new account for any role. Used by administrators to create staff accounts (DOCTOR, NURSE, EMPLOYEE, ADMIN) or patient accounts on behalf of patients.

**Request Body:**

```json
{
  "email": "doctor1@hms.com",
  "password": "SecurePass123!",
  "role": "DOCTOR"
}
```

**Validation:**

- `email`: Required, valid email format, unique
- `password`: Required, min 8 chars, must include uppercase, lowercase, number, special char
- `role`: Required, one of [ADMIN, PATIENT, EMPLOYEE, DOCTOR, NURSE]

**Response:** `201 Created`

```json
{
  "status": "success",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440003",
    "email": "doctor1@hms.com",
    "role": "DOCTOR",
    "emailVerified": false,
    "createdAt": "2025-12-02T10:30:00Z",
    "createdBy": "550e8400-e29b-41d4-a716-446655440001"
  }
}
```

**Error Codes:**

- `401 UNAUTHORIZED`: Missing or invalid access token
- `400 VALIDATION_ERROR`: Input validation failed
  • email is required
  • email must be valid format (user@domain.com)
  • password is required
  • password must be at least 8 characters
  • password must contain uppercase letter
  • password must contain lowercase letter
  • password must contain number
  • password must contain special character
  • role is required
  • role must be one of [ADMIN, PATIENT, EMPLOYEE, DOCTOR, NURSE]
- `403 FORBIDDEN`: User role not authorized (requires ADMIN)
- `409 EMAIL_ALREADY_EXISTS`: Email already registered

---

## 1.3 Login

**Endpoint:** `POST /api/auth/login`  
**Access:** Public  
**Description:** Authenticate user and get JWT tokens

**Request Body:**

```json
{
  "email": "patient1@gmail.com",
  "password": "SecurePass123!"
}
```

**Response:** `200 OK`

```json
{
  "status": "success",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "tokenType": "Bearer",
    "expiresIn": 3600,
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "email": "patient1@gmail.com",
      "role": "PATIENT"
    }
  }
}
```

**Error Codes:**

- `401 INVALID_CREDENTIALS`: Wrong email/password

---

## 1.4 Refresh Token

**Endpoint:** `POST /api/auth/refresh`  
**Access:** Requires valid refresh token (no Authorization header needed)  
**Description:** Get new access token using refresh token

**Request Body:**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response:** `200 OK`

```json
{
  "status": "success",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 3600
  }
}
```

**Error Codes:**

- `400 VALIDATION_ERROR`: refreshToken is required
- `401 INVALID_TOKEN`: Refresh token expired/invalid/revoked

---

## 1.5 Logout

**Endpoint:** `POST /api/auth/logout`  
**Access:** Authenticated  
**Description:** Revoke refresh token

**Response:** `200 OK`

```json
{
  "status": "success",
  "data": {
    "message": "Logged out successfully"
  }
}
```

**Error Codes:**

- `401 UNAUTHORIZED`: Missing or invalid access token

---

## 1.6 Get Current User

**Endpoint:** `GET /api/auth/me`  
**Access:** Authenticated  
**Description:** Get current authenticated user info

**Response:** `200 OK`

```json
{
  "status": "success",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440002",
    "email": "patient1@gmail.com",
    "role": "PATIENT",
    "emailVerified": true
  }
}
```

**Error Codes:**

- `401 UNAUTHORIZED`: Missing or invalid access token
