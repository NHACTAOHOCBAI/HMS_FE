import { TableParams } from "@/hooks/useTableParams";
import { Employee, EmployeeItem, CreateEmployeeData } from "@/interfaces/employee";

// ----------------------------------------------------------------------
// Mock Data
// ----------------------------------------------------------------------
const roles: Employee["role"][] = ["DOCTOR", "NURSE", "RECEPTIONIST"];
const statuses: Employee["status"][] = ["ACTIVE", "ON_LEAVE", "TERMINATED"];

const generateMockEmployees = (): Employee[] => {
  const list: Employee[] = [];
  const names = [
    "Dr. Sarah Johnson",
    "Dr. Michael Chen", 
    "Lisa Martinez",
    "James Wilson",
    "Dr. Emily Brown",
    "Robert Taylor",
    "Dr. Jennifer Lee",
    "David Anderson",
    "Dr. Maria Garcia",
    "Thomas White"
  ];
  const departments = [
    { id: "d1", name: "Cardiology" },
    { id: "d2", name: "Pediatrics" },
    { id: "d3", name: "Emergency" },
  ];
  const specializations = ["Cardiologist", "Pediatrician", "N/A", "N/A"];

  for (let i = 0; i < names.length; i++) {
    const dept = departments[i % departments.length];
    const role = roles[i % 3];
    list.push({
      id: `emp-${String(i + 1).padStart(3, "0")}`,
      userId: `user-${String(i + 1).padStart(3, "0")}`,
      fullName: names[i],
      employeeNumber: `EMP-2025-${String(i + 1).padStart(3, "0")}`,
      departmentId: dept.id,
      departmentName: dept.name,
      role: role,
      specialization: role === "DOCTOR" ? specializations[i % 4] : undefined,
      licenseNumber: role === "DOCTOR" ? `MD-${String(10000 + i * 111)}` : undefined,
      phone: `+1-555-100${i}`,
      email: `${names[i].toLowerCase().replace(/[^a-z]/g, ".")}@hms.com`,
      address: `${100 + i} Medical Center Dr`,
      hireDate: `2020-0${(i % 9) + 1}-15`,
      status: statuses[0],
      createdAt: `2025-01-01T00:00:00Z`,
      updatedAt: `2025-01-01T00:00:00Z`,
    });
  }

  return list;
};

export const EMPLOYEES: Employee[] = generateMockEmployees();

// ----------------------------------------------------------------------
// GET LIST
// ----------------------------------------------------------------------
export const getEmployees = async (params: TableParams) => {
  const { page = 1, limit = 10, search } = params;

  await new Promise((r) => setTimeout(r, 300));

  let filtered = [...EMPLOYEES];
  
  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(
      (e) =>
        e.fullName.toLowerCase().includes(searchLower) ||
        e.email.toLowerCase().includes(searchLower)
    );
  }

  const start = (page - 1) * limit;
  const end = start + limit;
  const paginated = filtered.slice(start, end);

  return {
    status: "success",
    data: {
      content: paginated.map((e): EmployeeItem => ({
        id: e.id,
        fullName: e.fullName,
        role: e.role,
        departmentName: e.departmentName,
        specialization: e.specialization,
        licenseNumber: e.licenseNumber,
        email: e.email,
        phone: e.phone,
        status: e.status,
      })),
      page,
      size: limit,
      totalElements: filtered.length,
      totalPages: Math.ceil(filtered.length / limit),
    },
  };
};

// ----------------------------------------------------------------------
// GET BY ID
// ----------------------------------------------------------------------
export const getEmployeeById = async (id: string) => {
  await new Promise((r) => setTimeout(r, 300));

  const employee = EMPLOYEES.find((e) => e.id === id);

  if (!employee) {
    throw new Error(`Không tìm thấy nhân viên với ID: ${id}`);
  }

  return employee;
};

// ----------------------------------------------------------------------
// CREATE
// ----------------------------------------------------------------------
export const createEmployee = async (data: CreateEmployeeData) => {
  console.log("Tạo nhân viên mới:", data);
  await new Promise((r) => setTimeout(r, 300));
  
  // Find department name
  const departments = [
    { id: "d1", name: "Cardiology" },
    { id: "d2", name: "Pediatrics" },
    { id: "d3", name: "Emergency" },
  ];
  const dept = departments.find(d => d.id === data.departmentId);
  
  const newEmployee: Employee = {
    id: `emp-${Date.now()}`,
    userId: `user-${Date.now()}`,
    fullName: data.fullName,
    employeeNumber: `EMP-2025-${String(EMPLOYEES.length + 1).padStart(3, "0")}`,
    departmentId: data.departmentId,
    departmentName: dept?.name || "Unknown",
    role: data.role,
    specialization: data.specialization,
    licenseNumber: data.licenseNumber,
    phone: data.phone,
    email: data.email,
    address: data.address,
    hireDate: data.hireDate,
    status: data.status,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  EMPLOYEES.push(newEmployee);
  return true;
};

// ----------------------------------------------------------------------
// UPDATE
// ----------------------------------------------------------------------
export const updateEmployee = async ({
  id,
  data,
}: {
  id: string;
  data: CreateEmployeeData;
}) => {
  console.log("Cập nhật nhân viên:", id, data);
  await new Promise((r) => setTimeout(r, 300));
  
  // Find department name
  const departments = [
    { id: "d1", name: "Cardiology" },
    { id: "d2", name: "Pediatrics" },
    { id: "d3", name: "Emergency" },
  ];
  const dept = departments.find(d => d.id === data.departmentId);
  
  const index = EMPLOYEES.findIndex(e => e.id === id);
  if (index > -1) {
    EMPLOYEES[index] = {
      ...EMPLOYEES[index],
      fullName: data.fullName,
      role: data.role,
      departmentId: data.departmentId,
      departmentName: dept?.name || EMPLOYEES[index].departmentName,
      specialization: data.specialization,
      licenseNumber: data.licenseNumber,
      phone: data.phone,
      email: data.email,
      address: data.address,
      hireDate: data.hireDate,
      status: data.status,
      updatedAt: new Date().toISOString(),
    };
  }
  return true;
};

// ----------------------------------------------------------------------
// DELETE (SOFT DELETE)
// ----------------------------------------------------------------------
export const deleteEmployee = async (id: string) => {
  console.log("Xóa nhân viên:", id);
  await new Promise((r) => setTimeout(r, 300));
  
  const index = EMPLOYEES.findIndex(e => e.id === id);
  if (index > -1) {
    EMPLOYEES.splice(index, 1);
  }
  return true;
};

// ----------------------------------------------------------------------
// GET EMPLOYEES BY DEPARTMENT (for schedule assignment)
// ----------------------------------------------------------------------
export const getEmployeesByDepartment = async (departmentId: string) => {
  await new Promise((r) => setTimeout(r, 200));
  
  return EMPLOYEES.filter((e) => e.departmentId === departmentId && e.status === "ACTIVE")
    .map((e) => ({
      id: e.id,
      fullName: e.fullName,
      role: e.role,
    }));
};
