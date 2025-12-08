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
} from "@/components/ui/sidebar";

import {
  CalendarDays,
  FileText,
  Pill,
  Users,
  Calendar,
  UserCheck
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const items = [
  {
    title: "Bệnh nhân",
    url: "admin/patients/patient-list",
    icon: <FileText />,
  }, {
    title: "Lễ tân",
    url: "admin/reception-desk",
    icon: <UserCheck />,
  },
  {
    title: "Thuốc",
    url: "admin/medicines",
    icon: <Pill />,
  },
  {
    title: "Nhân sự",
    url: "admin/employees",
    icon: <Users />,
  },
  {
    title: "Lịch làm việc",
    url: "admin/work-schedules",
    icon: <Calendar />,
  },
  {
    title: "Khám bệnh",
    url: "admin/medical-exams/medical-exam-list",
    icon: <FileText />,
  },
  {
    title: "Appointments",
    url: "admin/appointments/appointment-list",
    icon: <CalendarDays />,
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

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <div className="h-[114px]">Logo here</div>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => {
                  const isActive =
                    names[2]?.toUpperCase() === item.title.toUpperCase();
                  return (
                    <Link
                      key={item.title}
                      href={`/${item.url}`}
                      className={`h-[50px] flex gap-[13px] items-center rounded-xl hover:bg-[#F0F4F9] px-[7px] ${isActive
                        ? "bg-app-primary-blue-100 text-app-primary-blue-700 font-semibold"
                        : "bg-white"
                        }`}
                    >
                      {item.icon}
                      {item.title}
                    </Link>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <main className="flex-1">
        <div className="w-full h-14 border-b-app-azure-100 border flex items-center gap-5">
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
    </SidebarProvider>
  );
}
