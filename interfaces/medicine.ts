
export interface Category {
    id: string;
    name: string;
    description?: string;
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
export type MedicineDetail = {
    id: string;
    name: string;
    activeIngredient: string;
    unit: string;
    description: string;
    concentration: string;
    packaging: string;
    quantity: number;
    purchasePrice: number;
    sellingPrice: number;
    expiresAt: string; // ISO date string
    manufacturer: string;
    sideEffects: string;
    storageConditions: string;
    category: Category;
    createdAt: string;
    updatedAt: string;
};


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