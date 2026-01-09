# Test Accounts - Mock Mode

Danh sách tài khoản test cho việc phát triển và kiểm thử các role trong hệ thống HMS.

## 📋 Danh Sách Test Accounts

### 1. 👔 ADMIN

- **Email:** `admin@hms.com`
- **Password:** `admin123`
- **Full Name:** Admin User
- **Employee ID:** emp-admin-001
- **Quyền truy cập:**
  - ✅ Toàn bộ hệ thống
  - ✅ Quản lý appointments, patients, doctors
  - ✅ Quản lý HR, billing, medicines
  - ✅ Xem reports và analytics
  - ✅ Quản lý users

---

### 2. 👨‍⚕️ DOCTOR

- **Email:** `doctor@hms.com`
- **Password:** `doctor123`
- **Full Name:** Dr. John Smith
- **Employee ID:** emp-101
- **Department:** Cardiology
- **Quyền truy cập:**
  - ✅ Xem và quản lý appointments của mình
  - ✅ Tạo và cập nhật medical exams
  - ✅ Kê đơn thuốc (prescriptions)
  - ✅ Xem thông tin patients
  - ✅ Xem reports về appointments của mình
  - ❌ Không truy cập HR, Billing, Admin functions

---

### 3. 👩‍⚕️ NURSE

- **Email:** `nurse@hms.com`
- **Password:** `nurse123`
- **Full Name:** Nurse Mary Johnson
- **Employee ID:** emp-nurse-001
- **Department:** General Ward
- **Quyền truy cập:**
  - ✅ Xem appointments
  - ✅ Xem medical exams (read-only)
  - ✅ Xem patient information
  - ❌ Không tạo/sửa appointments
  - ❌ Không kê đơn thuốc
  - ❌ Không truy cập Billing, HR

---

### 4. 🗂️ RECEPTIONIST

- **Email:** `receptionist@hms.com`
- **Password:** `receptionist123`
- **Full Name:** Sarah Williams
- **Employee ID:** emp-receptionist-001
- **Quyền truy cập:**
  - ✅ Tạo và quản lý appointments
  - ✅ Xem và tạo patient records
  - ✅ Check-in patients
  - ❌ Không xem medical exams
  - ❌ Không truy cập HR, Billing (admin)

---

### 5. 🧑‍🤝‍🧑 PATIENT

- **Email:** `patient@hms.com`
- **Password:** `patient123`
- **Full Name:** Patient Nguyen Van An
- **Patient ID:** p001
- **Quyền truy cập:**
  - ✅ Xem appointments của mình
  - ✅ Book appointments
  - ✅ Xem medical records của mình
  - ✅ Xem prescriptions của mình
  - ✅ Xem billing/invoices của mình
  - ❌ Không truy cập admin portal
  - ❌ Không xem thông tin patients khác

---

## 🚀 Cách Sử Dụng

### 1. Bật Mock Mode

Đảm bảo trong file `lib/mocks/toggle.ts`:

```typescript
export const USE_MOCK = true;
```

### 2. Login với Test Account

1. Truy cập: http://localhost:3000/login
2. Nhấn vào dropdown "🧪 Test Accounts (Mock Mode)"
3. Copy email & password của role muốn test
4. Login

### 3. Test Các Tính Năng

Sau khi login, bạn sẽ thấy UI khác nhau tùy role:

- **ADMIN**: Sidebar đầy đủ tất cả menu
- **DOCTOR**: Menu giới hạn (Appointments, Exams, Patients)
- **NURSE**: Menu read-only
- **RECEPTIONIST**: Menu Appointments + Patients
- **PATIENT**: Patient portal với My Appointments, My Records

---

## 🔧 Mở Rộng

Để thêm test account mới, edit file `services/auth.mock.service.ts`:

```typescript
const MOCK_USERS = [
  // ... existing users
  {
    username: "new_doctor",
    email: "doctor2@hms.com",
    password: "doctor123",
    role: "DOCTOR",
    fullName: "Dr. Sarah Johnson",
    employeeId: "emp-102",
    department: "Pediatrics",
    accessToken: "mock-access-token-doctor2",
    refreshToken: "mock-refresh-token-doctor2",
  },
];
```

---

## 📝 Ghi Chú

- Test accounts chỉ hoạt động khi `USE_MOCK = true`
- Mọi thay đổi trên mock data sẽ **mất khi reload page**
- Để test production API, set `USE_MOCK = false` và sử dụng real accounts

---

## ✅ Checklist Testing

- [ ] Test ADMIN: Truy cập toàn bộ chức năng
- [ ] Test DOCTOR: Chỉ xem/edit appointments của mình
- [ ] Test NURSE: Read-only medical records
- [ ] Test RECEPTIONIST: Book appointments cho patients
- [ ] Test PATIENT: Self-service portal
- [ ] Test role-based navigation (sidebar items)
- [ ] Test role-based permissions (API calls)
