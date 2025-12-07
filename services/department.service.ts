import { TableParams } from "@/hooks/useTableParams";
import { Department, DepartmentItem, CreateDepartmentData } from "@/interfaces/department";

// ----------------------------------------------------------------------
// Mock Data
// ----------------------------------------------------------------------
const generateMockDepartments = (): Department[] => {
  return [
    {
      id: "d1",
      name: "Cardiology",
      code: "CARD",
      description: "Heart and cardiovascular system care",
      location: "Building A, Floor 2",
      phoneExtension: "2001",
      active: true,
      employeeCount: 15,
      createdAt: "2025-01-01T00:00:00Z",
      updatedAt: "2025-01-01T00:00:00Z",
    },
    {
      id: "d2",
      name: "Pediatrics",
      code: "PEDI",
      description: "Medical care for infants, children, and adolescents",
      location: "Building B, Floor 1",
      phoneExtension: "2002",
      active: true,
      employeeCount: 12,
      createdAt: "2025-01-01T00:00:00Z",
      updatedAt: "2025-01-01T00:00:00Z",
    },
    {
      id: "d3",
      name: "Emergency",
      code: "EMER",
      description: "24/7 emergency medical services",
      location: "Building C, Ground Floor",
      phoneExtension: "2003",
      active: true,
      employeeCount: 20,
      createdAt: "2025-01-01T00:00:00Z",
      updatedAt: "2025-01-01T00:00:00Z",
    },
  ];
};

export const DEPARTMENTS: Department[] = generateMockDepartments();

// ----------------------------------------------------------------------
// GET LIST
// ----------------------------------------------------------------------
export const getDepartments = async (params: TableParams) => {
  const { page = 1, limit = 10, search } = params;

  await new Promise((r) => setTimeout(r, 300));

  let filtered = [...DEPARTMENTS];

  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(
      (d) =>
        d.name.toLowerCase().includes(searchLower) ||
        d.description.toLowerCase().includes(searchLower)
    );
  }

  const start = (page - 1) * limit;
  const end = start + limit;
  const paginated = filtered.slice(start, end);

  return {
    status: "success",
    data: {
      content: paginated.map((d): DepartmentItem => ({
        id: d.id,
        name: d.name,
        description: d.description,
        location: d.location,
        phoneExtension: d.phoneExtension,
        status: d.active ? "ACTIVE" : "INACTIVE",
      })),
      page,
      size: limit,
      totalElements: filtered.length,
      totalPages: Math.ceil(filtered.length / limit),
    },
  };
};

// ----------------------------------------------------------------------
// GET ALL (for dropdowns)
// ----------------------------------------------------------------------
export const getAllDepartments = async () => {
  await new Promise((r) => setTimeout(r, 200));
  return DEPARTMENTS.filter((d) => d.active).map((d) => ({
    id: d.id,
    name: d.name,
  }));
};

// ----------------------------------------------------------------------
// GET BY ID
// ----------------------------------------------------------------------
export const getDepartmentById = async (id: string) => {
  await new Promise((r) => setTimeout(r, 300));

  const department = DEPARTMENTS.find((d) => d.id === id);

  if (!department) {
    throw new Error(`Không tìm thấy khoa với ID: ${id}`);
  }

  return department;
};

// ----------------------------------------------------------------------
// CREATE
// ----------------------------------------------------------------------
export const createDepartment = async (data: CreateDepartmentData) => {
  console.log("Tạo khoa mới:", data);
  await new Promise((r) => setTimeout(r, 300));
  
  const newDepartment: Department = {
    id: `d${Date.now()}`,
    name: data.name,
    code: data.name.substring(0, 4).toUpperCase(),
    description: data.description,
    location: data.location,
    phoneExtension: data.phoneExtension,
    active: data.status === "ACTIVE",
    employeeCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  DEPARTMENTS.push(newDepartment);
  return true;
};

// ----------------------------------------------------------------------
// UPDATE
// ----------------------------------------------------------------------
export const updateDepartment = async ({
  id,
  data,
}: {
  id: string;
  data: CreateDepartmentData;
}) => {
  console.log("Cập nhật khoa:", id, data);
  await new Promise((r) => setTimeout(r, 300));
  
  const index = DEPARTMENTS.findIndex(d => d.id === id);
  if (index > -1) {
    DEPARTMENTS[index] = {
      ...DEPARTMENTS[index],
      name: data.name,
      description: data.description,
      location: data.location,
      phoneExtension: data.phoneExtension,
      active: data.status === "ACTIVE",
      updatedAt: new Date().toISOString(),
    };
  }
  return true;
};

// ----------------------------------------------------------------------
// DELETE (DEACTIVATE)
// ----------------------------------------------------------------------
export const deleteDepartment = async (id: string) => {
  console.log("Xóa khoa:", id);
  await new Promise((r) => setTimeout(r, 300));
  
  const index = DEPARTMENTS.findIndex(d => d.id === id);
  if (index > -1) {
    DEPARTMENTS.splice(index, 1);
  }
  return true;
};
