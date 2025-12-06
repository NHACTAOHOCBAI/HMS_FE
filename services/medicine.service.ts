import { TableParams } from "@/hooks/useTableParams";
import { Medicine, MedicineDetail, MedicineResponse } from "@/interfaces/medicine";



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
export const getMedicines = async (params: TableParams): Promise<MedicineResponse> => {
  const { page, limit } = params;
  await new Promise((r) => setTimeout(r, 500)); // simulate latency

  const start = (page - 1) * limit;
  const end = start + limit;

  const paginated = mockMedicines.slice(start, end);
  console.log("Fetching medicines with params:", params);
  return {
    status: "success",
    data: {
      content: paginated,
      page: page,
      size: limit,
      totalElements: mockMedicines.length,
      totalPages: Math.ceil(mockMedicines.length / limit),
    },
  };
};

//getMedicineById
export const getMedicineById = async (id: string): Promise<MedicineDetail> => {
  await new Promise((r) => setTimeout(r, 300)); // simulate latency for 300ms

  console.log("Fetching medicine by ID:", id);

  return {
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
  };
};
//updateMedicine
export const updateMedicine = async (id: string, data: any): Promise<MedicineDetail> => {
  await new Promise((r) => setTimeout(r, 500)); // simulate latency
  console.log("Updating medicine with ID:", id, "and data:", data);
  return { ...data, id };
}