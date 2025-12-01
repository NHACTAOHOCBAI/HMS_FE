"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const tabs = [
    {
        title: "Employee lists",
        href: "/admin/employees",
    },
    {
        title: "Scheduling",
        href: "/admin/employees/scheduling",
    },
    {
        title: "Attendance",
        href: "/admin/employees/attendance",
    },
];

export function EmployeeTabs() {
    const pathname = usePathname();

    return (
        <div className="flex items-center gap-6 border-b mb-6">
            {tabs.map((tab) => {
                const isActive = pathname === tab.href;
                return (
                    <Link
                        key={tab.href}
                        href={tab.href}
                        className={cn(
                            "pb-3 text-sm font-medium transition-colors hover:text-primary relative",
                            isActive
                                ? "text-primary"
                                : "text-muted-foreground"
                        )}
                    >
                        {tab.title}
                        {isActive && (
                            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary" />
                        )}
                    </Link>
                );
            })}
        </div>
    );
}
