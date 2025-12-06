import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Role-based route access mapping
const ROUTE_ACCESS = {
  "/admin": ["ADMIN", "DOCTOR", "NURSE"],
  "/admin/appointments": ["ADMIN", "DOCTOR", "NURSE"],
  "/admin/billing": ["ADMIN"],
  "/admin/exams": ["ADMIN", "DOCTOR", "NURSE"],
  "/admin/hr": ["ADMIN"],
  "/admin/medicines": ["ADMIN"],
  "/admin/patients": ["ADMIN", "DOCTOR", "NURSE", "RECEPTIONIST"],
  "/admin/reports": ["ADMIN", "DOCTOR"],
  "/doctor": ["DOCTOR"],
  "/patient": ["PATIENT"],
  "/profile": ["PATIENT"],
};

export function middleware(request: NextRequest) {
  // Middleware disabled - using client-side RoleGuard instead
  // This prevents redirect loops and simplifies the architecture
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
