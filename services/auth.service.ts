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
