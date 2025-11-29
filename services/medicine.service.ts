import type { Medicine } from "@/interfaces/medicine";

const mockCategories = [
    "antibiotic",
    "painkiller",
    "vitamin",
    "supplement",
    "fever",
];

// Random helper
const random = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

const generateMockMedicines = (): Medicine[] => {
    const list: Medicine[] = [];

    for (let i = 1; i <= 50; i++) {
        list.push({
            id: i,
            name: `Medicine ${i}`,
            activeIngredient: `Ingredient ${i}`,
            unit: "tablet",
            description: i % 2 === 0 ? `Description for medicine ${i}` : null,
            quantity: random(10, 200),
            packaging: i % 3 === 0 ? "Box of 10 strips" : null,
            purchasePrice: random(10000, 50000),
            sellingPrice: random(60000, 100000),
            expiresAt: `202${random(4, 6)}-0${random(1, 9)}-15T00:00:00Z`,
            categoryId: mockCategories[i % mockCategories.length],
        } as Medicine);
    }

    return list;
};

const MEDICINES = generateMockMedicines();

export const getMedicines = async ({
    page,
    limit,
}: {
    page: number;
    limit: number;
}) => {
    await new Promise((r) => setTimeout(r, 500)); // simulate latency

    const start = (page - 1) * limit;
    const end = start + limit;

    const paginated = MEDICINES.slice(start, end);

    return {
        items: paginated,
        totalItems: MEDICINES.length,
        currentPage: page,
        totalPages: Math.ceil(MEDICINES.length / limit),
    };
};
