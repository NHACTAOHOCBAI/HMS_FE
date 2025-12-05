export const toQueryString = (params: any) => {
    return Object.entries(params)
        .filter(([_, v]) => v !== undefined && v !== null && v !== "" && v !== "all")
        .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
        .join("&");
};
