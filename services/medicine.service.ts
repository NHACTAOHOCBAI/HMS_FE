<<<<<<< HEAD
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
///createMedicine
export const createMedicine = async (data: any): Promise<MedicineDetail> => {
  await new Promise((r) => setTimeout(r, 500)); // simulate latency
  console.log("Creating medicine with data:", data);
  return { ...data, id: "newly-created-id" };
}
=======
import type {
  Medicine,
  MedicineListParams,
  MedicineListResponse,
  CreateMedicineRequest,
  UpdateMedicineRequest,
} from "@/interfaces/medicine";
import api from "@/config/axios";
import { USE_MOCK } from "@/lib/mocks/toggle";
import { categoriesDB } from "./category.service"; // Import the mutable categoriesDB

// ============ MOCK DATA ============
// Removed the static mockCategories here as it's now imported
// const mockCategories = [
//   { id: "cat-1", name: "Antibiotic" },
//   { id: "cat-2", name: "Painkiller" },
//   { id: "cat-3", name: "Vitamin" },
//   { id: "cat-4", name: "Supplement" },
//   { id: "cat-5", name: "Fever" },
// ];


const random = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const generateMockMedicines = (): Medicine[] => {
  const list: Medicine[] = [];
  const now = new Date().toISOString();

  // Use categoriesDB for generating mock medicines
  for (let i = 1; i <= 50; i++) {
    const cat = categoriesDB[i % categoriesDB.length]; // Use categoriesDB here
    list.push({
      id: `med-${i}`,
      name: `Medicine ${i}`,
      activeIngredient: `Ingredient ${i}`,
      unit: ["tablet", "capsule", "bottle", "tube"][i % 4],
      description: i % 2 === 0 ? `Description for medicine ${i}` : null,
      quantity: random(10, 200),
      packaging: i % 3 === 0 ? "Box of 10 strips" : null,
      purchasePrice: random(10000, 50000),
      sellingPrice: random(60000, 100000),
      expiresAt: `202${random(5, 7)}-0${random(1, 9)}-15`,
      categoryId: cat.id,
      categoryName: cat.name,
      createdAt: now,
      updatedAt: now,
    });
  }
  return list;
};

const MEDICINES = generateMockMedicines();

// ============ API FUNCTIONS ============
export const getMedicines = async (
  params: MedicineListParams = {},
): Promise<MedicineListResponse> => {
  if (USE_MOCK) {
    // ... mock logic ...
    await new Promise((r) => setTimeout(r, 300));
    const { page = 1, size = 10, search = "", categoryId } = params;
    const keyword = search.trim().toLowerCase();

    let filtered = MEDICINES.filter((m) => !m.deletedAt);

    if (keyword) {
      filtered = filtered.filter((m) =>
        [m.name, m.activeIngredient, m.description]
          .filter(Boolean)
          .some((field) => field!.toLowerCase().includes(keyword)),
      );
    }

    if (categoryId) {
      filtered = filtered.filter((m) => m.categoryId === categoryId);
    }

    const start = (page - 1) * size;
    const paginated = filtered.slice(start, start + size);

    return {
      content: paginated,
      page,
      size,
      totalElements: filtered.length,
      totalPages: Math.ceil(filtered.length / size),
    };
  }

  // Build RSQL filter string
  const filterParts: string[] = [];
  
  if (params.search) {
     const searchTerm = params.search.trim();
     if (searchTerm) {
        // Search by name or activeIngredient
        filterParts.push(`(name==*${searchTerm}*,activeIngredient==*${searchTerm}*)`);
     }
  }

  if (params.categoryId) {
      filterParts.push(`category.id==${params.categoryId}`);
  }

  const filterString = filterParts.join(';');

  const apiParams: Record<string, any> = {
      page: (params.page || 1) - 1,
      size: params.size || 10,
  };

  if (filterString) {
      // MedicineController expects 'search' param for RSQL, not 'filter'
      apiParams.search = filterString;
  }
  
  if (params.sort) {
      apiParams.sort = params.sort;
  }

  // Use /medicines endpoint (MedicineController root) instead of /medicines/all (GenericController)
  const res = await api.get("/medicines", { params: apiParams });
  console.log("[DEBUG] getMedicines response sample:", res.data.data?.content?.[0]);
  return res.data.data; 
};

export const getMedicine = async (id: string): Promise<Medicine> => {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 300));
    const medicine = MEDICINES.find((m) => m.id === id && !m.deletedAt);
    if (!medicine) throw new Error("Medicine not found");
    return medicine;
  }

  const res = await api.get(`/medicines/${id}`);
  console.log("[DEBUG] getMedicine response:", res.data.data);
  return res.data.data;
};

export const createMedicine = async (
  data: CreateMedicineRequest,
): Promise<Medicine> => {
  if (USE_MOCK) {
    // ... mock implementation ...
    await new Promise((r) => setTimeout(r, 500));
    const now = new Date().toISOString();
    const cat = categoriesDB.find((c) => c.id === data.categoryId); 
    const newMedicine: Medicine = {
      id: `med-${Date.now()}`,
      name: data.name,
      // ... fields ...
      activeIngredient: data.activeIngredient || null,
      unit: data.unit,
      description: data.description || null,
      quantity: data.quantity,
      packaging: data.packaging || null,
      purchasePrice: data.purchasePrice,
      sellingPrice: data.sellingPrice,
      expiresAt: data.expiresAt,
      categoryId: data.categoryId || null,
      categoryName: cat?.name || null,
      createdAt: now,
      updatedAt: now,
    };
    MEDICINES.unshift(newMedicine);
    return newMedicine;
  }

  const res = await api.post("/medicines", data);
  return res.data.data;
};

export const updateMedicine = async (
  id: string,
  data: UpdateMedicineRequest,
): Promise<Medicine> => {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 500));
    const index = MEDICINES.findIndex((m) => m.id === id);
    if (index === -1) throw new Error("Medicine not found");

    const cat = data.categoryId
      ? categoriesDB.find((c) => c.id === data.categoryId)
      : null;

    MEDICINES[index] = {
      ...MEDICINES[index],
      ...data,
      categoryName: cat?.name ?? MEDICINES[index].categoryName,
      updatedAt: new Date().toISOString(),
    };
    return MEDICINES[index];
  }

  // Use PUT instead of PATCH because GenericController does not verify PATCH, and MedicineController only supports PATCH /stock
  const res = await api.put(`/medicines/${id}`, data);
  return res.data.data;
};

export const deleteMedicine = async (id: string): Promise<void> => {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 300));
    const index = MEDICINES.findIndex((m) => m.id === id);
    if (index === -1) throw new Error("Medicine not found");
    MEDICINES[index].deletedAt = new Date().toISOString();
    return;
  }

  await api.delete(`/medicines/${id}`);
};

// Legacy support for old components
export const getMedicineById = getMedicine;
>>>>>>> repoB/master
