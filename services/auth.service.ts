<<<<<<< HEAD
import axios, { AxiosError } from "axios";
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  CurrentUserResponse,
  LogoutResponse,
  ApiSuccessResponse,
  ApiErrorResponse,
  AuthErrorCode,
} from "@/interfaces/auth";

//Error handling
export class AuthError extends Error {
  code: AuthErrorCode;
  details?: { field: string; message: string }[];

  constructor(
    code: AuthErrorCode,
    message: string,
    details?: { field: string; message: string }[]
  ) {
    super(message);
    this.name = "AuthError";
    this.code = code;
    this.details = details;
  }
}

function handleAuthError(error: unknown): never {
  if (error instanceof AxiosError && error.response?.data) {
    const errorResponse = error.response.data as ApiErrorResponse;
    if (errorResponse.status === "error" && errorResponse.error) {
      throw new AuthError(
        errorResponse.error.code as AuthErrorCode,
        errorResponse.error.message,
        errorResponse.error.details
      );
    }
  }
  throw new AuthError("UNAUTHORIZED", "An unexpected error occurred");
}

// Auth Service
export const authService = {
  /**
   * Login with email and password
   * POST /api/auth/login
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await axios.post<ApiSuccessResponse<LoginResponse>>(
        "/api/auth/login",
        credentials
      );
      return response.data.data;
    } catch (error) {
      handleAuthError(error);
    }
  },

  /**
   * Register a new patient account (self-registration)
   * POST /api/auth/register
   */
  async register(credentials: RegisterRequest): Promise<RegisterResponse> {
    try {
      const response = await axios.post<ApiSuccessResponse<RegisterResponse>>(
        "/api/auth/register",
        credentials
      );
      return response.data.data;
    } catch (error) {
      handleAuthError(error);
    }
  },

  /**
   * Refresh access token using refresh token
   * POST /api/auth/refresh
   */
  async refreshToken(
    request: RefreshTokenRequest
  ): Promise<RefreshTokenResponse> {
    try {
      const response = await axios.post<
        ApiSuccessResponse<RefreshTokenResponse>
      >("/api/auth/refresh", request);
      return response.data.data;
    } catch (error) {
      handleAuthError(error);
    }
  },

  /**
   * Logout - revoke refresh token
   * POST /api/auth/logout
   */
  async logout(): Promise<LogoutResponse> {
    try {
      const response = await axios.post<ApiSuccessResponse<LogoutResponse>>(
        "/api/auth/logout"
      );
      return response.data.data;
    } catch (error) {
      handleAuthError(error);
    }
  },

  /**
   * Get current authenticated user info
   * GET /api/auth/me
   */
  async getCurrentUser(): Promise<CurrentUserResponse> {
    try {
      const response = await axios.get<ApiSuccessResponse<CurrentUserResponse>>(
        "/api/auth/me"
      );
      return response.data.data;
    } catch (error) {
      handleAuthError(error);
    }
  },

  /**
   * Signup - register then auto-login
   * Convenience method combining register + login
   */
  async signup(credentials: RegisterRequest): Promise<LoginResponse> {
    // First register the user
    await this.register(credentials);
    // Then log them in
    return this.login(credentials);
  },
};

export default authService;
=======
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
  accountId: string;
  email: string;
  role: string;
  employeeId?: string;
  patientId?: string;
};

export interface Account {
  id: string;
  email: string;
  role: string;
  emailVerified?: boolean;
}

export interface AccountCreateRequest {
  email: string;
  password: string;
  role: "ADMIN" | "PATIENT" | "DOCTOR" | "NURSE" | "RECEPTIONIST";
}

export interface AccountUpdateRequest {
  email?: string;
  password?: string;
  role?: "ADMIN" | "PATIENT" | "DOCTOR" | "NURSE" | "RECEPTIONIST";
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
      accountId: account?.id || "",
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
      accountId: account?.id || "",
      email: account?.email || credentials.email,
      role: account?.role || "PATIENT",
    };
  },

  // Account management (Admin only)
  getAccounts: async (
    search?: string, 
    roleFilter?: string | string[],
    excludeRoles?: string[]
  ): Promise<PaginatedResponse<Account>> => {
    // Build RSQL filter
    const filters: string[] = [];
    if (search) {
      filters.push(`email=like='${search}'`);
    }
    // Single role filter
    if (roleFilter && typeof roleFilter === 'string') {
      filters.push(`role==${roleFilter}`);
    }
    // Multiple roles filter (include any of these roles)
    if (roleFilter && Array.isArray(roleFilter) && roleFilter.length > 0) {
      filters.push(`role=in=(${roleFilter.join(',')})`);
    }
    // Exclude certain roles
    if (excludeRoles && excludeRoles.length > 0) {
      filters.push(`role=out=(${excludeRoles.join(',')})`);
    }
    const filter = filters.length > 0 ? filters.join(";") : undefined;

    const response = await axiosInstance.get<{ data: PaginatedResponse<Account> }>(
      "/auth/accounts/all",  // Fixed: GenericController exposes list at /all
      {
        params: { filter },
      },
    );
    return response.data.data;
  },

  getAccount: async (id: string): Promise<Account> => {
    const response = await axiosInstance.get<{ data: Account }>(
      `/auth/accounts/${id}`,
    );
    return response.data.data;
  },

  createAccount: async (data: AccountCreateRequest): Promise<Account> => {
    const response = await axiosInstance.post<{ data: Account }>(
      "/auth/accounts",
      data,
    );
    return response.data.data;
  },

  updateAccount: async (id: string, data: AccountUpdateRequest): Promise<Account> => {
    const response = await axiosInstance.put<{ data: Account }>(
      `/auth/accounts/${id}`,
      data,
    );
    return response.data.data;
  },

  deleteAccount: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/auth/accounts/${id}`);
  },

  // Password Reset APIs
  sendPasswordResetToken: async (email: string): Promise<void> => {
    await axiosInstance.post("/auth/send-password-reset-token", null, {
      params: { email },
    });
  },

  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    await axiosInstance.post("/auth/reset-password", {
      token,
      newPassword,
    });
  },

  // Email Verification APIs
  sendVerificationEmail: async (email: string): Promise<void> => {
    await axiosInstance.post("/auth/send-verification-email", null, {
      params: { email },
    });
  },

  verifyEmail: async (token: string): Promise<void> => {
    await axiosInstance.post("/auth/verify-email", null, {
      params: { token },
    });
  },
};

>>>>>>> repoB/master
