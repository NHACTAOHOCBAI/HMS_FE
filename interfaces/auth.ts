// User roles as defined in the API
export type UserRole = "ADMIN" | "PATIENT" | "EMPLOYEE" | "DOCTOR" | "NURSE";

// User
export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
}

// Login
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: AuthUser;
}

// Register (Patient Self-Registration)
export interface RegisterRequest {
  email: string;
  password: string;
}

export interface RegisterResponse {
  id: string;
  email: string;
  role: UserRole;
  emailVerified: boolean;
  createdAt: string;
}

// Admin Create Account
export interface CreateAccountRequest {
  email: string;
  password: string;
  role: UserRole;
}

export interface CreateAccountResponse {
  id: string;
  email: string;
  role: UserRole;
  emailVerified: boolean;
  createdAt: string;
  createdBy: string;
}

// Refresh Token
export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  expiresIn: number;
}

// Current User (Get Me)
export interface CurrentUserResponse {
  id: string;
  email: string;
  role: UserRole;
  emailVerified: boolean;
}

// Logout
export interface LogoutResponse {
  message: string;
}
// API Response Wrapper (Standard Response Schema)
export interface ApiSuccessResponse<T> {
  status: "success";
  data: T;
  timestamp?: string;
}

export interface ApiErrorDetail {
  field: string;
  message: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: ApiErrorDetail[];
}

export interface ApiErrorResponse {
  status: "error";
  error: ApiError;
  timestamp?: string;
}

// Auth-specific error codes
export type AuthErrorCode =
  | "VALIDATION_ERROR"
  | "INVALID_CREDENTIALS"
  | "INVALID_TOKEN"
  | "EMAIL_ALREADY_EXISTS"
  | "FORBIDDEN"
  | "UNAUTHORIZED";
