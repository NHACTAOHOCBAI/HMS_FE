import axiosInstance from "@/config/axios";
import { PaginatedResponse } from "@/interfaces/pagination";

export type LoginRequest = {
  email: string;
  password: string;
};

// Backend response structure
type BackendLoginResponse = {
  accessToken: string;
  refreshToken: string;
  account: {
    id: string;
    email: string;
    role: string;
    emailVerified: boolean;
  };
};

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  email: string;
  role: string;
  employeeId?: string;
  patientId?: string;
};

export interface Account {
  id: string;
  email: string;
  role: string;
}

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    console.log("[authService] Attempting login with:", credentials.email);
    console.log("[authService] Password length:", credentials.password?.length);
    
    const response = await axiosInstance.post<{ data: BackendLoginResponse }>(
      "/auth/login",
      credentials,
    );
    const { accessToken, refreshToken, account } = response.data.data;
    
    console.log("[authService] Login response account:", account);
    
    return {
      accessToken,
      refreshToken,
      email: account?.email || credentials.email,
      role: account?.role || "UNKNOWN",
      // employeeId and patientId would need to be fetched from HR/Patient service
      // or added to AccountResponse in backend
    };
  },

  logout: async (refreshToken: string): Promise<void> => {
    await axiosInstance.post("/auth/logout", { refreshToken });
  },

  register: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await axiosInstance.post<{ data: BackendLoginResponse }>(
      "/auth/register",
      credentials,
    );
    const { accessToken, refreshToken, account } = response.data.data;
    return {
      accessToken,
      refreshToken,
      email: account?.email || credentials.email,
      role: account?.role || "PATIENT",
    };
  },

  getAccounts: async (search?: string): Promise<PaginatedResponse<Account>> => {
    const response = await axiosInstance.get<{ data: PaginatedResponse<Account> }>(
      "/auth/accounts",
      {
        params: { search },
      },
    );
    return response.data.data;
  },
};

