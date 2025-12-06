"use client";

import { RoleGuard } from "@/components/auth/RoleGuard";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMemo } from "react";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = useMemo(() => new QueryClient(), []);

  return (
    <RoleGuard allowedRoles={["PATIENT"]}>
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-background">
          <div className="container mx-auto py-8">{children}</div>
        </div>
      </QueryClientProvider>
    </RoleGuard>
  );
}
