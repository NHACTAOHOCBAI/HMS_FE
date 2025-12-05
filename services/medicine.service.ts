export interface Category {
  id: string;
  name: string;
}

export interface Medicine {
  id: string;
  name: string;
  activeIngredient: string;
  unit: string;
  concentration: string;
  packaging: string;
  quantity: number;
  purchasePrice: number;
  sellingPrice: number;
  expiresAt: string;
  manufacturer: string;
  category: Category;
  createdAt: string;
}

export interface MedicineResponse {
  status: string;
  data: {
    content: Medicine[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
}

export const mockMedicines: Medicine[] = [
  {
    id: "med001",
    name: "Amoxicillin 500mg",
    activeIngredient: "Amoxicillin",
    unit: "capsule",
    concentration: "500mg",
    packaging: "Box of 20 capsules",
    quantity: 1000,
    purchasePrice: 5000,
    sellingPrice: 8000,
    expiresAt: "2026-12-31",
    manufacturer: "GSK",
    category: { id: "cat001", name: "Antibiotics" },
    createdAt: "2025-12-02T10:30:00Z",
  },
  {
    id: "med002",
    name: "Paracetamol 500mg",
    activeIngredient: "Paracetamol",
    unit: "tablet",
    concentration: "500mg",
    packaging: "Box of 50 tablets",
    quantity: 2000,
    purchasePrice: 2000,
    sellingPrice: 4000,
    expiresAt: "2026-06-30",
    manufacturer: "Tylenol",
    category: { id: "cat002", name: "Painkillers" },
    createdAt: "2025-12-02T10:30:00Z",
  },
  {
    id: "med003",
    name: "Cefixime 200mg",
    activeIngredient: "Cefixime",
    unit: "capsule",
    concentration: "200mg",
    packaging: "Box of 10 capsules",
    quantity: 500,
    purchasePrice: 6000,
    sellingPrice: 9000,
    expiresAt: "2026-03-31",
    manufacturer: "Pfizer",
    category: { id: "cat001", name: "Antibiotics" },
    createdAt: "2025-12-02T10:30:00Z",
  },
  // bạn có thể thêm nhiều medicine mock khác để đủ totalElements
];

// Giả lập response mặc định
export const mockMedicineResponse: MedicineResponse = {
  status: "success",
  data: {
    content: mockMedicines,
    page: 0,
    size: 20,
    totalElements: 150,
    totalPages: 8,
  },
};
