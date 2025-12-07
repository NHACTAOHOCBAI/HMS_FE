export interface Employee {
  id: string;
  userId: string;
  fullName: string;
  employeeNumber: string;
  departmentId: string;
  departmentName: string;
  role: "DOCTOR" | "NURSE" | "RECEPTIONIST";
  specialization?: string;
  licenseNumber?: string;
  phone: string;
  email: string;
  address: string;
  hireDate: string;
  status: "ACTIVE" | "ON_LEAVE" | "TERMINATED";
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeItem {
  id: string;
  fullName: string;
  role: "DOCTOR" | "NURSE" | "RECEPTIONIST";
  departmentName: string;
  specialization?: string;
  licenseNumber?: string;
  email: string;
  phone: string;
  status: "ACTIVE" | "ON_LEAVE" | "TERMINATED";
}

export interface CreateEmployeeData {
  fullName: string;
  role: "DOCTOR" | "NURSE" | "RECEPTIONIST";
  departmentId: string;
  specialization?: string;
  licenseNumber?: string;
  email: string;
  phone: string;
  address: string;
  hireDate: string;
  status: "ACTIVE" | "ON_LEAVE" | "TERMINATED";
}
