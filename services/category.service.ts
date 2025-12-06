import { TableParams } from "@/hooks/useTableParams";
import { Category } from "@/interfaces/category";


export const mockCategories: Category[] = [
    {
        id: "cat001",
        name: "Antibiotics",
        description: "Medications that fight bacterial infections",
        createdAt: "2025-12-02T10:30:00Z",
    },
    {
        id: "cat002",
        name: "Painkillers",
        description: "Pain relief medications",
        createdAt: "2025-12-02T10:30:00Z",
    },
    {
        id: "cat003",
        name: "Vitamins",
        description: "Supplemental vitamins for health",
        createdAt: "2025-12-02T10:30:00Z",
    },
    {
        id: "cat004",
        name: "Antihistamines",
        description: "Medications for allergy relief",
        createdAt: "2025-12-02T10:30:00Z",
    },
    {
        id: "cat005",
        name: "Antidepressants",
        description: "Medications to treat depression",
        createdAt: "2025-12-02T10:30:00Z",
    },
    {
        id: "cat006",
        name: "Antifungals",
        description: "Medications that fight fungal infections",
        createdAt: "2025-12-02T10:30:00Z",
    },
    {
        id: "cat007",
        name: "Antivirals",
        description: "Medications to treat viral infections",
        createdAt: "2025-12-02T10:30:00Z",
    },
    {
        id: "cat008",
        name: "Cough Suppressants",
        description: "Medications to reduce coughing",
        createdAt: "2025-12-02T10:30:00Z",
    },
    {
        id: "cat009",
        name: "Diuretics",
        description: "Medications to reduce fluid retention",
        createdAt: "2025-12-02T10:30:00Z",
    },
    {
        id: "cat010",
        name: "Antacids",
        description: "Medications to relieve heartburn",
        createdAt: "2025-12-02T10:30:00Z",
    },
];


export const getCategories = async (params: TableParams) => {
    const { page, limit } = params;
    await new Promise((r) => setTimeout(r, 500)); // simulate latency

    const start = (page - 1) * limit;
    const end = start + limit;

    const paginated = mockCategories.slice(start, end);
    console.log("Fetching categories with params:", params);
    return {
        status: "success",
        data: {
            content: paginated,
            page: page,
            size: limit,
            totalElements: mockCategories.length,
            totalPages: Math.ceil(mockCategories.length / limit),
        },
    };
};
//updateCategory
export const updateCategory = async (id: string, data: any) => {
    await new Promise((r) => setTimeout(r, 500)); // simulate latency
    console.log("Updating category with ID:", id, "and data:", data);
    return data;
};
//createCategory
export const createCategory = async (data: any) => {
    await new Promise((r) => setTimeout(r, 500)); // simulate latency
    console.log("Creating category with data:", data);
    return data;
};