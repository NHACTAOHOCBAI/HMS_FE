import axiosInstance from "@/config/axios";
import { toQueryString } from "./query-string";

export const fetcher = {
    get: async (url: string, params?: any) => {
        const qs = params ? "?" + toQueryString(params) : "";
        const response = await axiosInstance.get(url + qs);
        return response.data;
    },
};
