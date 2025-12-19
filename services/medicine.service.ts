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
