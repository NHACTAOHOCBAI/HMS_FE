<<<<<<< HEAD
import { Button } from "@/components/ui/button"
import {
    Card,

} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import MedicineCard from "./medicine-list/MedicineCard"
import CategoryCard from "./category-list/CategoryCard"


const MedicinePage = () => {
    return (
        <>
            {/* LABEL */}
            <div>
                <h1 className="text-gray-900 mb-2 text-2xl font-bold tracking-tight sm:text-3xl">Quản lý Thuốc</h1>
                <p className="text-gray-600">Quản lý kho thuốc và danh mục phân loại</p>
            </div>
            {/* TAB */}
            <div className="mt-4 flex w-full flex-col gap-6">
                <Tabs defaultValue="medicine">
                    <TabsList>
                        <TabsTrigger value="medicine">Thuốc</TabsTrigger>
                        <TabsTrigger value="category">Loại Thuốc</TabsTrigger>
                    </TabsList>
                    <TabsContent value="medicine">
                        <MedicineCard />
                    </TabsContent>
                    <TabsContent value="category">
                        <CategoryCard />
                    </TabsContent>
                </Tabs>
            </div>
        </>
    )
}

export default MedicinePage
=======
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Pill, Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MedicineListPage } from "./_components/MedicineListPage";
import { CategoryListPage } from "./_components/CategoryListPage";

export default function MedicinesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="page-header">
          <h1>
            <Pill className="h-6 w-6 text-teal-500" />
            Medicines Management
          </h1>
          <p>
            Manage medicine inventory, pricing, and categories.
          </p>
        </div>
      </div>

      <Tabs defaultValue="medicines" className="w-full">
        <TabsList className="bg-slate-100 p-1 rounded-lg">
          <TabsTrigger value="medicines">Medicines</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>
        <TabsContent value="medicines" className="mt-4">
          <MedicineListPage />
        </TabsContent>
        <TabsContent value="categories" className="mt-4">
          <CategoryListPage />
        </TabsContent>
      </Tabs>
    </div>
  );
}
>>>>>>> repoB/master
