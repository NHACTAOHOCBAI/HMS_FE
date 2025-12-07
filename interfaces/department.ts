export interface Department {
  id: string;
  name: string;
  code: string;
  description: string;
  location: string;
  phoneExtension: string;
  active: boolean;
  employeeCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface DepartmentItem {
  id: string;
  name: string;
  description: string;
  location: string;
  phoneExtension: string;
  status: "ACTIVE" | "INACTIVE";
}

export interface CreateDepartmentData {
  name: string;
  description: string;
  location: string;
  phoneExtension: string;
  status: "ACTIVE" | "INACTIVE";
}
