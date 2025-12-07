import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  RefreshTokenResponse,
  CurrentUserResponse,
  LogoutResponse,
  AuthUser,
} from "@/interfaces/auth";
import { AuthError } from "./auth.service";

// Simulated delay to mimic network latency
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock user database (in-memory)
const mockUsers: Map<
  string,
  { email: string; password: string; id: string; role: AuthUser["role"] }
> = new Map([
  [
    "admin@hms.com",
    {
      email: "admin@hms.com",
      password: "Admin123!",
      id: "550e8400-e29b-41d4-a716-446655440001",
      role: "ADMIN",
    },
  ],
  [
    "doctor@hms.com",
    {
      email: "doctor@hms.com",
      password: "Doctor123!",
      id: "550e8400-e29b-41d4-a716-446655440002",
      role: "DOCTOR",
    },
  ],
  [
    "patient@gmail.com",
    {
      email: "patient@gmail.com",
      password: "Patient123!",
      id: "550e8400-e29b-41d4-a716-446655440003",
      role: "PATIENT",
    },
  ],
]);

// Generate mock JWT tokens
function generateMockToken(): string {
  return `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(
    JSON.stringify({
      exp: Date.now() + 3600000,
      iat: Date.now(),
    })
  )}.mock_signature_${Math.random().toString(36).substring(7)}`;
}

export const mockAuthService = {
  /**
   * Mock login - validates against mock user database
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    await delay(500); // Simulate network delay

    const user = mockUsers.get(credentials.email);

    if (!user || user.password !== credentials.password) {
      throw new AuthError("INVALID_CREDENTIALS", "Wrong email or password");
    }

    return {
      accessToken: generateMockToken(),
      refreshToken: generateMockToken(),
      tokenType: "Bearer",
      expiresIn: 3600,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  },

  /**
   * Mock register - adds user to mock database
   */
  async register(credentials: RegisterRequest): Promise<RegisterResponse> {
    await delay(500);

    // Check if email already exists
    if (mockUsers.has(credentials.email)) {
      throw new AuthError(
        "EMAIL_ALREADY_EXISTS",
        "Email is already registered"
      );
    }

    // Validate password (must be 8+ chars with uppercase, lowercase, number, special char)
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(credentials.password)) {
      throw new AuthError(
        "VALIDATION_ERROR",
        "Password does not meet requirements",
        [
          {
            field: "password",
            message:
              "Password must be at least 8 characters with uppercase, lowercase, number, and special character",
          },
        ]
      );
    }

    // Create new user
    const newUser = {
      email: credentials.email,
      password: credentials.password,
      id: `550e8400-e29b-41d4-a716-${Date.now().toString().slice(-12)}`,
      role: "PATIENT" as const,
    };
    mockUsers.set(credentials.email, newUser);

    return {
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
      emailVerified: false,
      createdAt: new Date().toISOString(),
    };
  },

  /**
   * Mock signup - alias for register with auto-login
   * This is a convenience method that registers and then logs in
   */
  async signup(credentials: RegisterRequest): Promise<LoginResponse> {
    // First register the user
    await this.register(credentials);

    // Then log them in
    return this.login({
      email: credentials.email,
      password: credentials.password,
    });
  },

  /**
   * Mock refresh token
   */
  async refreshToken(): Promise<RefreshTokenResponse> {
    await delay(200);

    return {
      accessToken: generateMockToken(),
      expiresIn: 3600,
    };
  },

  /**
   * Mock logout
   */
  async logout(): Promise<LogoutResponse> {
    await delay(200);

    return {
      message: "Logged out successfully",
    };
  },

  /**
   * Mock get current user
   */
  async getCurrentUser(): Promise<CurrentUserResponse> {
    await delay(200);

    // For mock purposes, return a default user
    return {
      id: "550e8400-e29b-41d4-a716-446655440001",
      email: "admin@hms.com",
      role: "ADMIN",
      emailVerified: true,
    };
  },
};

export default mockAuthService;
