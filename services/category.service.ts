// src/api/categories.ts

import { Category, CATEGORY_MOCK_DATA } from "@/interfaces/category";

// Hàm lấy danh sách Category (có hỗ trợ tìm kiếm và phân trang giả lập)
export const getCategories = async ({
  page,
  limit,
  search = "",
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
    ? CATEGORY_MOCK_DATA.filter((c) =>
        [c.name, c.description]
          .filter(Boolean)
          .some((field) => field!.toLowerCase().includes(keyword))
      )
    : CATEGORY_MOCK_DATA;

  // ▶ Pagination
  const start = (page - 1) * limit;
  const end = start + limit;
  let paginated = filtered.slice(start, end);
  if (!page && !limit && !search) {
    paginated = CATEGORY_MOCK_DATA;
  }
  return {
    status: "success",
    data: {
      content: paginated,
      page: page,
      size: limit,
      totalElements: filtered.length,
      totalPages: Math.ceil(filtered.length / limit),
    },
  };
};

// Hàm lấy Category theo ID
export const getCategoryById = async (id: number | string) => {
  await new Promise((r) => setTimeout(r, 200)); // simulate shorter latency

  return CATEGORY_MOCK_DATA.find((c) => c.id === Number(id));
};

// Hàm lấy tất cả Categories (thường dùng cho Dropdown/Select)
export const getAllCategories = async (): Promise<Category[]> => {
  await new Promise((r) => setTimeout(r, 100));
  return CATEGORY_MOCK_DATA;
};
