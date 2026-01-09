export interface Category {
<<<<<<< HEAD
    id: string;
    name: string;
    description?: string;
    createdAt: string;
    updatedAt?: string;
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
=======
  id: string;
  name: string; // Changed from categoryName to name for consistency
  description?: string | null;
  createdAt?: string; // Add these for consistency with mock service
  updatedAt?: string; // Add these for consistency with mock service
}

export interface CategoryRequest {
  name: string;
  description?: string | null;
}
>>>>>>> repoB/master
