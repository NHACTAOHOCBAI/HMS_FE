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
    limit: 6,
    search: "",
    sortBy: "",
    sortOrder: "asc" as "asc" | "desc",
    filters: {} as Record<string, any>,
  });

  const debouncedSearch = useDebounce(params.search, 400);

  const updateFilter = (key: string, value: any) => {
    setParams((prev) => ({
      ...prev,
      filters: { ...prev.filters, [key]: value },
      page: 1,
    }));
  };

  const updateSort = (field: string) => {
    setParams((prev) => ({
      ...prev,
      sortBy: field,
      sortOrder: prev.sortOrder === "asc" ? "desc" : "asc",
      page: 1,
    }));
  };

  const updateSearch = (text: string) => {
    setParams((prev) => ({
      ...prev,
      search: text,
      page: 1,
    }));
  };

  const updatePage = (page: number) => {
    setParams((prev) => ({ ...prev, page }));
  };

  const updateLimit = (limit: number) => {
    setParams((prev) => ({ ...prev, limit, page: 1 }));
  };

  return {
    params,
    debouncedSearch,
    updateFilter,
    updateSearch,
    updateSort,
    updatePage,
    updateLimit,
  };
};
