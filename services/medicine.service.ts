import type { Medicine, MedicineResponse } from "@/interfaces/medicine";


// Random helper
const random = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

const generateMockMedicines = (): MedicineResponse[] => {
    const list: MedicineResponse[] = [];

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
            category: {
                id: random(1, 6),
                name: `Category ${random(1, 6)}`,
                description: `Description for category ${random(1, 6)}`
            },
        } as MedicineResponse);
    }

    return list;
};

const MEDICINES = generateMockMedicines();

export const getMedicines = async ({
    page,
    limit,
    search = ""
}: {
    page: number;
    limit: number;
    search?: string;
}) => {
    await new Promise((r) => setTimeout(r, 300)); // simulate latency

    // 🔎 Normalize search text
    const keyword = search.trim().toLowerCase();

    // 🔍 Filter trước → paginate sau
    const filtered = keyword
        ? MEDICINES.filter((m) =>
            [m.name, m.activeIngredient, m.description]
                .filter(Boolean)
                .some((field) =>
                    field!.toLowerCase().includes(keyword)
                )
        )
        : MEDICINES;

    // ▶ Pagination
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginated = filtered.slice(start, end);

    return {
        items: paginated,
        totalItems: filtered.length,
        currentPage: page,
        totalPages: Math.ceil(filtered.length / limit),
    };
};

export const getMedicineById = async (id: number | string) => {
    await new Promise((r) => setTimeout(r, 500)); // simulate latency

    return MEDICINES.find((m) => m.id === Number(id));
};