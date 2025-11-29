"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex ">
        {/* sidebar */}
        <div className="w-[255px] bg-blue-50 h-lvh">Sidebar</div>
        <div className="flex-1">
          <div className="w-full h-14 bg-blue-100 ">Header</div>
          <div className="p-[50px]">{children}</div>
        </div>
      </div>
    </QueryClientProvider>
  );
}
