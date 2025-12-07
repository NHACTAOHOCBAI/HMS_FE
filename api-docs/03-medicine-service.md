# 💊 Medicine Service API

**Base Path:** `/api/medicines`  
**Service Port:** 8083  
**Purpose:** Medicine catalog and inventory management

---

## 3.1 Create Medicine

**Endpoint:** `POST /api/medicines`  
**Access:** ADMIN  
**Description:** Add new medicine to catalog

**Request Body:**

```json
{
  "name": "Amoxicillin 500mg",
  "activeIngredient": "Amoxicillin",
  "unit": "capsule",
  "description": "Antibiotic for bacterial infections",
  "quantity": 1000,
  "concentration": "500mg",
  "packaging": "Box of 20 capsules",
  "purchasePrice": 5000,
  "sellingPrice": 8000,
  "expiresAt": "2026-12-31",
  "categoryId": "cat001",
  "manufacturer": "GSK",
  "sideEffects": "Nausea, diarrhea, allergic reactions",
  "storageConditions": "Store below 25°C, keep dry"
}
```

**Validation:**

- `name`: Required, max 255 chars
- `sellingPrice`: Must be >= purchasePrice
- `quantity`: Non-negative integer
- `expiresAt`: Must be future date

**Response:** `201 Created`

```json
{
  "status": "success",
  "data": {
    "id": "med001",
    "name": "Amoxicillin 500mg",
    "activeIngredient": "Amoxicillin",
    "unit": "capsule",
    "quantity": 1000,
    "sellingPrice": 8000,
    "expiresAt": "2026-12-31",
    "manufacturer": "GSK",
    "category": {
      "id": "cat001",
      "name": "Antibiotics"
    },
    "createdAt": "2025-12-02T10:30:00Z"
  }
}
```

**Error Codes:**

- `400 VALIDATION_ERROR`: Input validation failed
  • name is required
  • name exceeds maximum length (255 characters)
  • purchasePrice must be positive (> 0)
  • sellingPrice must be positive (> 0)
  • sellingPrice must be >= purchasePrice
  • quantity cannot be negative
  • expiresAt must be valid ISO 8601 date
  • expiresAt must be future date
  • unit is required
- `403 FORBIDDEN`: User role not authorized (requires ADMIN)
- `404 CATEGORY_NOT_FOUND`: Category ID doesn't exist

---

## 3.2 Get Medicine by ID

**Endpoint:** `GET /api/medicines/{id}`  
**Access:** Authenticated  
**Description:** Retrieve medicine details

**Response:** `200 OK`

```json
{
  "status": "success",
  "data": {
    "id": "med001",
    "name": "Amoxicillin 500mg",
    "activeIngredient": "Amoxicillin",
    "unit": "capsule",
    "description": "Antibiotic for bacterial infections",
    "concentration": "500mg",
    "packaging": "Box of 20 capsules",
    "quantity": 1000,
    "purchasePrice": 5000,
    "sellingPrice": 8000,
    "expiresAt": "2026-12-31",
    "manufacturer": "GSK",
    "sideEffects": "Nausea, diarrhea, allergic reactions",
    "storageConditions": "Store below 25°C, keep dry",
    "category": {
      "id": "cat001",
      "name": "Antibiotics",
      "description": "Medications that fight bacterial infections"
    },
    "createdAt": "2025-12-02T10:30:00Z",
    "updatedAt": "2025-12-02T10:30:00Z"
  }
}
```

**Field Visibility by Role:**

- **All roles**: name, activeIngredient, unit, concentration, sellingPrice, sideEffects, storageConditions, category, manufacturer
- **ADMIN, DOCTOR, NURSE**: All fields above + purchasePrice, quantity, expiresAt, packaging, description
- **ADMIN**: All fields (full inventory details)
- **DOCTOR, NURSE**: All fields except purchasePrice (clinical + stock info)

**Error Codes:**

- `401 UNAUTHORIZED`: Missing or invalid access token
- `404 MEDICINE_NOT_FOUND`: Medicine doesn't exist

---

## 3.3 List Medicines

**Endpoint:** `GET /api/medicines`  
**Access:** Authenticated  
**Description:** List medicines with filters

**Query Parameters:**

- `page` (int, default=0): Page number
- `size` (int, default=20, max=100): Page size
- `sort` (string, default=createdAt,desc): Sort field and direction
- `search` (string): RSQL search query
- `categoryId` (string): Filter by category ID

**RSQL Search Examples:**

- `name=like='*cillin*'` (search by name)
- `quantity<100` (low stock - ADMIN only)
- `expiresAt<'2026-01-01'` (expiring soon - ADMIN only)
- `category.name=='Antibiotics'` (filter by category name)
- `sellingPrice>5000;sellingPrice<10000` (price range)

**Response:** `200 OK`

```json
{
  "status": "success",
  "data": {
    "content": [
      {
        "id": "med001",
        "name": "Amoxicillin 500mg",
        "activeIngredient": "Amoxicillin",
        "unit": "capsule",
        "concentration": "500mg",
        "packaging": "Box of 20 capsules",
        "quantity": 1000,
        "purchasePrice": 5000,
        "sellingPrice": 8000,
        "expiresAt": "2026-12-31",
        "manufacturer": "GSK",
        "category": {
          "id": "cat001",
          "name": "Antibiotics"
        },
        "createdAt": "2025-12-02T10:30:00Z"
      }
    ],
    "page": 0,
    "size": 20,
    "totalElements": 150,
    "totalPages": 8
  }
}
```

**Field Visibility by Role:**

- **ADMIN**: All fields (full inventory details)
- **DOCTOR, NURSE**: All fields except purchasePrice (clinical + stock info)
- **EMPLOYEE**: name, activeIngredient, unit, concentration, sellingPrice, manufacturer, category only (basic info)

**Error Codes:**

- `401 UNAUTHORIZED`: Missing or invalid access token
- `403 FORBIDDEN`: User role not authorized (requires ADMIN, DOCTOR, NURSE, or EMPLOYEE)
- `404 CATEGORY_NOT_FOUND`: Category ID doesn't exist (if categoryId filter applied)

---

## 3.4 Update Medicine

**Endpoint:** `PATCH /api/medicines/{id}`  
**Access:** ADMIN  
**Description:** Partial update medicine information

**Request Body:** (All fields optional - only include fields to update)

```json
{
  "name": "Amoxicillin 500mg Updated",
  "activeIngredient": "Amoxicillin",
  "unit": "capsule",
  "description": "Antibiotic for bacterial infections - updated",
  "concentration": "500mg",
  "packaging": "Box of 30 capsules",
  "purchasePrice": 5500,
  "sellingPrice": 8500,
  "expiresAt": "2027-06-30",
  "categoryId": "cat001",
  "manufacturer": "GSK",
  "sideEffects": "Nausea, diarrhea, allergic reactions",
  "storageConditions": "Store below 25°C, keep dry"
}
```

**Validation:**

- `sellingPrice`: Must be >= purchasePrice (if both provided)
- `expiresAt`: Must be future date (if provided)
- `name`: Max 255 chars (if provided)

**Response:** `200 OK`

```json
{
  "status": "success",
  "data": {
    "id": "med001",
    "name": "Amoxicillin 500mg Updated",
    "activeIngredient": "Amoxicillin",
    "unit": "capsule",
    "description": "Antibiotic for bacterial infections - updated",
    "concentration": "500mg",
    "packaging": "Box of 30 capsules",
    "quantity": 1000,
    "purchasePrice": 5500,
    "sellingPrice": 8500,
    "expiresAt": "2027-06-30",
    "manufacturer": "GSK",
    "sideEffects": "Nausea, diarrhea, allergic reactions",
    "storageConditions": "Store below 25°C, keep dry",
    "category": {
      "id": "cat001",
      "name": "Antibiotics",
      "description": "Medications that fight bacterial infections"
    },
    "createdAt": "2025-12-02T10:30:00Z",
    "updatedAt": "2025-12-02T11:00:00Z"
  }
}
```

**Note:** This endpoint can update `quantity` directly. However, for stock adjustments with audit trail (prescription deductions, restocking), use the dedicated `PATCH /api/medicines/{id}/stock` endpoint which tracks reason and reference.

**Error Codes:**

- `400 VALIDATION_ERROR`: Input validation failed
  • name exceeds maximum length (255 characters)
  • purchasePrice must be positive (> 0)
  • sellingPrice must be positive (> 0)
  • sellingPrice must be >= purchasePrice
  • quantity cannot be negative ( >= 0)
  • expiresAt must be valid ISO 8601 date
  • expiresAt must be future date
- `403 FORBIDDEN`: User role not authorized (requires ADMIN)
- `404 MEDICINE_NOT_FOUND`: Medicine doesn't exist
- `404 CATEGORY_NOT_FOUND`: Category ID doesn't exist (if categoryId provided)

---

## 3.5 Delete Medicine

**Endpoint:** `DELETE /api/medicines/{id}`  
**Access:** ADMIN only  
**Description:** Permanently delete medicine from catalog

**Response:** `204 No Content`

**Business Rules:**

- Medicine is permanently deleted from database
- Cannot delete medicine if it has been used in any prescription (referential integrity)
- Consider using Update Medicine to set quantity=0 instead of deleting for audit purposes

**Error Codes:**

- `403 FORBIDDEN`: User role not authorized (requires ADMIN)
- `404 MEDICINE_NOT_FOUND`: Medicine doesn't exist
- `409 MEDICINE_IN_USE`: Cannot delete medicine referenced in prescriptions

---

## 3.6 Update Medicine Stock

**Endpoint:** `PATCH /api/medicines/{id}/stock`  
**Access:** ADMIN (manual adjustment), Internal (prescription deduction)  
**Description:** Increment or decrement medicine quantity

**Request Body:**

```json
{
  "quantity": -20
}
```

**Note:** This endpoint uses delta values (positive to add, negative to deduct). For prescription deductions, this is called internally by the Medical Exam Service when creating prescriptions.

**Response:** `200 OK`

```json
{
  "status": "success",
  "data": {
    "id": "med001",
    "name": "Amoxicillin 500mg",
    "quantity": 980,
    "updatedAt": "2025-12-02T11:00:00Z"
  }
}
```

**Error Codes:**

- `400 VALIDATION_ERROR`: Input validation failed
  • quantity is required
  • quantity must be non-zero integer
- `400 INSUFFICIENT_STOCK`: Requested deduction exceeds available stock (resulting quantity would be negative)
- `403 FORBIDDEN`: User role not authorized (requires ADMIN)
- `404 MEDICINE_NOT_FOUND`: Medicine doesn't exist

---

## 3.7 Medicine Categories

### 3.7.1 Create Category

**Endpoint:** `POST /api/medicines/categories`  
**Access:** ADMIN  
**Description:** Create new medicine category

**Request Body:**

```json
{
  "name": "Antibiotics",
  "description": "Medications that fight bacterial infections"
}
```

**Validation:**

- `name`: Required, max 255 chars, unique

**Response:** `201 Created`

```json
{
  "status": "success",
  "data": {
    "id": "cat001",
    "name": "Antibiotics",
    "description": "Medications that fight bacterial infections",
    "createdAt": "2025-12-02T10:30:00Z"
  }
}
```

**Error Codes:**

- `400 VALIDATION_ERROR`: Input validation failed
  • name is required
  • name exceeds maximum length (255 characters)
- `403 FORBIDDEN`: User role not authorized (requires ADMIN)
- `409 CATEGORY_ALREADY_EXISTS`: Category name already exists

---

### 3.7.2 Get Category by ID

**Endpoint:** `GET /api/medicines/categories/{id}`  
**Access:** Authenticated  
**Description:** Retrieve category details

**Response:** `200 OK`

```json
{
  "status": "success",
  "data": {
    "id": "cat001",
    "name": "Antibiotics",
    "description": "Medications that fight bacterial infections",
    "createdAt": "2025-12-02T10:30:00Z",
    "updatedAt": "2025-12-02T10:30:00Z"
  }
}
```

**Error Codes:**

- `401 UNAUTHORIZED`: Missing or invalid access token
- `404 CATEGORY_NOT_FOUND`: Category doesn't exist

---

### 3.7.3 List Categories

**Endpoint:** `GET /api/medicines/categories`  
**Access:** Authenticated  
**Description:** List all medicine categories

**Query Parameters:**

- `page` (int, default=0): Page number
- `size` (int, default=20, max=100): Page size
- `sort` (string, default=name,asc): Sort field and direction
- `search` (string): RSQL search query

**RSQL Examples:**

- `name=like='*bio*'` (search by name)

**Response:** `200 OK`

```json
{
  "status": "success",
  "data": {
    "content": [
      {
        "id": "cat001",
        "name": "Antibiotics",
        "description": "Medications that fight bacterial infections",
        "createdAt": "2025-12-02T10:30:00Z"
      },
      {
        "id": "cat002",
        "name": "Painkillers",
        "description": "Pain relief medications",
        "createdAt": "2025-12-02T10:30:00Z"
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

### 3.7.4 Update Category

**Endpoint:** `PATCH /api/medicines/categories/{id}`  
**Access:** ADMIN  
**Description:** Partial update category information

**Request Body:** (All fields optional)

```json
{
  "name": "Antibiotics - Updated",
  "description": "Updated description for antibiotics category"
}
```

**Response:** `200 OK`

```json
{
  "status": "success",
  "data": {
    "id": "cat001",
    "name": "Antibiotics - Updated",
    "description": "Updated description for antibiotics category",
    "createdAt": "2025-12-02T10:30:00Z",
    "updatedAt": "2025-12-02T11:00:00Z"
  }
}
```

**Error Codes:**

- `400 VALIDATION_ERROR`: Input validation failed
  • name exceeds maximum length (255 characters)
- `403 FORBIDDEN`: User role not authorized (requires ADMIN)
- `404 CATEGORY_NOT_FOUND`: Category doesn't exist
- `409 CATEGORY_ALREADY_EXISTS`: Category name already exists (if name changed)

---

### 3.7.5 Delete Category

**Endpoint:** `DELETE /api/medicines/categories/{id}`  
**Access:** ADMIN only  
**Description:** Delete medicine category

**Response:** `204 No Content`

**Business Rules:**

- Cannot delete category if medicines are assigned to it
- Alternatively, medicines will have `categoryId` set to NULL (ON DELETE SET NULL behavior)

**Error Codes:**

- `403 FORBIDDEN`: User role not authorized (requires ADMIN)
- `404 CATEGORY_NOT_FOUND`: Category doesn't exist
- `409 CATEGORY_HAS_MEDICINES`: Cannot delete category with assigned medicines (if enforcing strict deletion)
