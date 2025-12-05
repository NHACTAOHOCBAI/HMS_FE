export interface Category {
    id: number;
    name: string;
    description?: string | null;
}
const CATEGORIES: Category[] = [
    { id: 1, name: "Thuốc Giảm Đau", description: "Các loại thuốc dùng để giảm đau và hạ sốt." },
    { id: 2, name: "Kháng Sinh", description: "Các thuốc dùng để điều trị nhiễm trùng do vi khuẩn." },
    { id: 3, name: "Vitamin và Khoáng Chất", description: "Thực phẩm chức năng, bổ sung vi chất dinh dưỡng." },
    { id: 4, name: "Chăm Sóc Da Liễu", description: "Các sản phẩm bôi ngoài da, trị mụn, nấm." },
    { id: 5, name: "Thuốc Tim Mạch", description: null },
    { id: 6, name: "Hô Hấp", description: "Thuốc ho, hen suyễn, viêm họng." },
];

// Xuất ra để dùng trong các hàm API khác (ví dụ: Medicine)
export const CATEGORY_MOCK_DATA = CATEGORIES;