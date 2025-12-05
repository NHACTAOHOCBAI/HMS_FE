/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useDebounce } from "./useDebounce";

export interface TableParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  filters?: Record<string, any>;
}

export const useTableParams = () => {
  const [params, setParams] = useState({
    page: 1,
    limit: 10,
    search: "",
    sortBy: "",
    sortOrder: "asc",
  });

  const debouncedSearch = useDebounce(params.search, 500);

  const updateSearch = (value: string) =>
    setParams((p) => ({ ...p, search: value, page: 1 }));

  const updateFilter = (key: string, value: string) =>
    setParams((p) => ({ ...p, [key]: value, page: 1 }));

  const updatePage = (page: number) => setParams((p) => ({ ...p, page }));

  const updateLimit = (limit: number) =>
    setParams((p) => ({ ...p, limit, page: 1 }));

  const updateSort = (key: string) =>
    setParams((p) => ({
      ...p,
      sortBy: key,
      sortOrder: p.sortOrder === "asc" ? "desc" : "asc",
    }));

  return {
    params,
    debouncedSearch,
    updateSearch,
    updateFilter,
    updatePage,
    updateLimit,
    updateSort,
  };
};
