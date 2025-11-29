import type { Category } from "@/interfaces/category";

// Danh sách tên danh mục
const mockCategoryNames = [
    "Antibiotic",
    "Painkiller",
    "Vitamin",
    "Supplement",
    "Fever Relief",
    "Digestive",
    "Cough & Cold",
    "Allergy",
    "Heart Health",
    "Diabetes Care",
];

// Tạo danh mục mock
const generateMockCategories = (): Category[] => {
    const list: Category[] = [];

    for (let i = 1; i <= 20; i++) {
        list.push({
            id: i,
            name: mockCategoryNames[i % mockCategoryNames.length],
            description:
                i % 2 === 0
                    ? `Description for category ${mockCategoryNames[i % mockCategoryNames.length]}`
                    : null,
        } as Category);
    }

    return list;
};

const CATEGORIES = generateMockCategories();

export const getCategories = async () => {
    await new Promise((r) => setTimeout(r, 500)); // simulate latency

    return CATEGORIES;
};
