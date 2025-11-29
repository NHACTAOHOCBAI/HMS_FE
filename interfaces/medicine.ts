export interface Medicine {
    name: string;
    activeIngredient: string;
    unit: string;
    description?: string | null;
    quantity: number;
    packaging?: string | null;
    purchasePrice: number;
    sellingPrice: number;
    expiresAt: string;      // ISO date string
    categoryId: string;
}
