"use client";

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Users, Building2 } from "lucide-react";
import { useState } from "react";
import EmployeeCard from "./employee-list/EmployeeCard";
import DepartmentCard from "./department-list/DepartmentCard";

const EmployeesPage = () => {
    const [activeTab, setActiveTab] = useState("employees");

    return (
        <>
            {/* HEADER */}
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h1 className="text-gray-900 mb-2 text-2xl font-bold tracking-tight sm:text-3xl">
                        Quản lý Nhân sự
                    </h1>
                    <p className="text-gray-600">Quản lý nhân viên và khoa phòng</p>
                </div>
            </div>

            {/* TABS */}
            <div className="mt-4 flex w-full flex-col gap-6">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList>
                        <TabsTrigger value="employees" className="gap-2">
                            <Users className="h-4 w-4" />
                            Nhân viên
                        </TabsTrigger>
                        <TabsTrigger value="departments" className="gap-2">
                            <Building2 className="h-4 w-4" />
                            Khoa phòng
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="employees">
                        <EmployeeCard />
                    </TabsContent>
                    <TabsContent value="departments">
                        <DepartmentCard />
                    </TabsContent>
                </Tabs>
            </div>
        </>
    );
};

export default EmployeesPage;
