<<<<<<< HEAD
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
=======
import { LoginRequest, LoginResponse } from "./auth.service";

export type SignUpRequest = {
  username: string;
  email: string;
  password: string;
};

// Mock user database - Test accounts for each role
export const MOCK_USERS = [
  {
    accountId: "acc-admin-001",
    username: "admin",
    email: "admin@hms.com",
    password: "Admin123!@",
    role: "ADMIN",
    fullName: "Admin User",
    employeeId: "emp-admin-001",
    accessToken: "mock-access-token-admin",
    refreshToken: "mock-refresh-token-admin",
  },
  {
    accountId: "acc-doctor-001",
    username: "doctor",
    email: "doctor@hms.com",
    password: "doctor123",
    role: "DOCTOR",
    fullName: "Dr. John Smith",
    employeeId: "emp-101",
    department: "Cardiology",
    accessToken: "mock-access-token-doctor",
    refreshToken: "mock-refresh-token-doctor",
  },
  {
    accountId: "acc-nurse-001",
    username: "nurse",
    email: "nurse@hms.com",
    password: "nurse123",
    role: "NURSE",
    fullName: "Nurse Mary Johnson",
    employeeId: "emp-nurse-001",
    department: "General Ward",
    accessToken: "mock-access-token-nurse",
    refreshToken: "mock-refresh-token-nurse",
  },
  {
    accountId: "acc-receptionist-001",
    username: "receptionist",
    email: "receptionist@hms.com",
    password: "receptionist123",
    role: "RECEPTIONIST",
    fullName: "Sarah Williams",
    employeeId: "emp-receptionist-001",
    accessToken: "mock-access-token-receptionist",
    refreshToken: "mock-refresh-token-receptionist",
  },
  {
    accountId: "acc-patient-001",
    username: "patient",
    email: "patient@hms.com",
    password: "patient123",
    role: "PATIENT",
    fullName: "Patient Nguyen Van An",
    patientId: "p001",
    accessToken: "mock-access-token-patient",
    refreshToken: "mock-refresh-token-patient",
  },
  {
    accountId: "acc-newdoctor-001",
    username: "newdoctor",
    email: "newdoctor@hms.com",
    password: "password123",
    role: "DOCTOR",
    fullName: "Dr. New Test",
    employeeId: "emp-new-doctor-001",
    department: "General",
    accessToken: "mock-access-token-newdoctor",
    refreshToken: "mock-refresh-token-newdoctor",
  },
];

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockAuthService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    // Simulate network delay
    await delay(800);

    // Find user by email
    const user = MOCK_USERS.find((u) => u.email === credentials.email);

    // Check if user exists and password matches
    if (!user || user.password !== credentials.password) {
      throw new Error("Invalid email or password");
    }

    // Return successful login response
    return {
      accessToken: user.accessToken,
      refreshToken: user.refreshToken,
      accountId: user.accountId,
      email: user.email,
      role: user.role,
      employeeId: user.employeeId,
      patientId: user.patientId,
    };
  },

  logout: async (refreshToken: string): Promise<void> => {
    // Simulate network delay
    await delay(500);

    // In a real implementation, you would invalidate the token on the server
    console.log("Logged out with refresh token:", refreshToken);
  },

  register: async (credentials: LoginRequest): Promise<LoginResponse> => {
    // Simulate network delay
    await delay(1000);

    // Check if user already exists
    const existingUser = MOCK_USERS.find((u) => u.email === credentials.email);
    if (existingUser) {
      throw new Error("User already exists");
    }

    // Return successful registration response
    return {
      accessToken: "mock-access-token-new-user",
      refreshToken: "mock-refresh-token-new-user",
      accountId: `acc-new-${Date.now()}`,
      email: credentials.email,
      role: "PATIENT", // Default role for new users
    };
  },

  signup: async (credentials: SignUpRequest): Promise<LoginResponse> => {
    // Simulate network delay
    await delay(1000);

    // Check if user already exists by email
    const existingUserByEmail = MOCK_USERS.find(
      (u) => u.email === credentials.email,
    );
    if (existingUserByEmail) {
      throw new Error("Email already exists");
    }

    // Check if username already exists
    const existingUserByUsername = MOCK_USERS.find(
      (u) => u.username === credentials.username,
    );
    if (existingUserByUsername) {
      throw new Error("Username already exists");
    }

    // Create new user object
    const newUser = {
      username: credentials.username,
      email: credentials.email,
      password: credentials.password,
      role: "PATIENT", // Default role for new users
      fullName: credentials.username,
      patientId: `p-${Date.now()}`,
      accessToken: `mock-access-token-${credentials.username}`,
      refreshToken: `mock-refresh-token-${credentials.username}`,
    };

    // Add to mock database
    MOCK_USERS.push(newUser as any);

    // Return successful signup response
    return {
      accessToken: newUser.accessToken,
      refreshToken: newUser.refreshToken,
      accountId: `acc-${credentials.username}`,
      email: newUser.email,
      role: newUser.role,
    };
  },
};
>>>>>>> repoB/master
