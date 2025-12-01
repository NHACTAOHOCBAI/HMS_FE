"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarProvider,
  SidebarTrigger,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FileText, Pill, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const items = [
  {
    title: "Patients",
    url: "admin/patients/patient-list",
    icon: <FileText />,
  },
  {
    title: "Medicines",
    url: "admin/medicines/medicine-list",
    icon: <Pill />,
  },
  {
    title: "Employees",
    url: "admin/employees",
    icon: <Users />,
    items: [
      {
        title: "Employee lists",
        url: "admin/employees",
      },
      {
        title: "Scheduling",
        url: "admin/employees/scheduling",
      },
      {
        title: "Attendance",
        url: "admin/employees/attendance",
      },
    ],
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const names = pathname.split("/");

  function generateBreadcrumbs(pathname: string) {
    const segments = pathname.split("/").filter(Boolean);

    let path = "";
    return segments.map((segment, index) => {
      path += "/" + segment;

      const name = segment
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());

      return {
        name,
        href: path,
        isLast: index === segments.length - 1,
      };
    });
  }

  const breadcrumbs = generateBreadcrumbs(pathname);
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <div className="h-[114px] flex items-center justify-center font-bold text-xl">HMS Admin</div>
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map((item) => {
                    const isActive =
                      names[2]?.toUpperCase() === item.title.toUpperCase();

                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive && !item.items}
                          className="h-[50px] rounded-xl px-[7px]"
                        >
                          <Link href={`/${item.url}`}>
                            {item.icon}
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                        {item.items && isActive && (
                          <SidebarMenuSub>
                            {item.items.map((subItem) => {
                              const isSubActive = pathname === `/${subItem.url}`;
                              return (
                                <SidebarMenuSubItem key={subItem.title}>
                                  <SidebarMenuSubButton
                                    asChild
                                    isActive={isSubActive}
                                  >
                                    <Link href={`/${subItem.url}`}>
                                      <span>{subItem.title}</span>
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              );
                            })}
                          </SidebarMenuSub>
                        )}
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <main className="flex-1">
          <div className="w-full h-14 border-b-app-azure-100 border flex items-center gap-5 px-4">
            <SidebarTrigger />
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.map((item) => (
                  <React.Fragment key={item.href}>
                    <BreadcrumbItem>
                      {item.isLast ? (
                        <p className="text-app-primary-blue-700">{item.name}</p>
                      ) : (
                        <p>{item.name}</p>
                      )}
                    </BreadcrumbItem>
                    {!item.isLast && <BreadcrumbSeparator />}
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="p-[50px]">{children}</div>
        </main>
        <Toaster />
      </SidebarProvider>
    </QueryClientProvider>
  );
}
