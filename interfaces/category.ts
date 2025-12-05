export interface Category {
    id: string;
    name: string;
    description: string;
    createdAt: string;
}

export interface CategoryResponse {
    status: string;
    data: {
        content: Category[];
        page: number;
        size: number;
        totalElements: number;
        totalPages: number;
    };
}