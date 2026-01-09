"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DepartmentsPage from "@/app/admin/hr/departments/page";
import EmployeesPage from "@/app/admin/hr/employees/page";
import SchedulesPage from "@/app/admin/hr/schedules/page";
import { Users, Building2, CalendarDays, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function HrHubPage() {
  return (
    <div className="w-full space-y-6">
      {/* Enhanced Gradient Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 via-purple-500 to-fuchsia-500 p-6 text-white shadow-xl">
        {/* Background decorations */}
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
        <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/5" />
        <div className="absolute top-1/2 right-1/4 h-20 w-20 rounded-full bg-white/5" />

        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-white/20 p-3 backdrop-blur-sm">
              <Users className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                Quản lý nhân sự
                <Badge className="bg-white/20 text-white border-0">
                  <Sparkles className="h-3 w-3 mr-1" />
                  HR
                </Badge>
              </h1>
              <p className="mt-1 text-purple-200">
                Quản lý khoa phòng, nhân viên và lịch làm việc
              </p>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="departments" className="w-full space-y-6">
        <TabsList className="h-auto flex-wrap gap-2 bg-slate-100/80 p-1.5 rounded-xl border border-slate-200">
          <TabsTrigger 
            value="departments"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-violet-700 rounded-lg px-4 py-2.5 font-medium"
          >
            <Building2 className="h-4 w-4 mr-2" />
            Khoa phòng
          </TabsTrigger>
          <TabsTrigger 
            value="employees"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-violet-700 rounded-lg px-4 py-2.5 font-medium"
          >
            <Users className="h-4 w-4 mr-2" />
            Nhân viên
          </TabsTrigger>
          <TabsTrigger 
            value="schedules"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-violet-700 rounded-lg px-4 py-2.5 font-medium"
          >
            <CalendarDays className="h-4 w-4 mr-2" />
            Lịch làm việc
          </TabsTrigger>
        </TabsList>

        <TabsContent value="departments" className="space-y-6 mt-0">
          <DepartmentsPage />
        </TabsContent>

        <TabsContent value="employees" className="space-y-6 mt-0">
          <EmployeesPage />
        </TabsContent>

        <TabsContent value="schedules" className="space-y-6 mt-0">
          <SchedulesPage />
        </TabsContent>
      </Tabs>
    </div>
  );
}
