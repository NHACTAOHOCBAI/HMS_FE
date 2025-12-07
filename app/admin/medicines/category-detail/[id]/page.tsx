"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pencil } from "lucide-react";
import { format } from "date-fns";
import { useCategoryById } from "@/hooks/queries/useCategory";
import { useParams } from "next/navigation";



export default function CategoryDetail() {
    // Fetch category detail by ID
    const { id } = useParams();
    console.log("Category ID:", id);
    const categoryId = Array.isArray(id) ? id[0] : id || "";
    const { data: categoryData, isLoading } = useCategoryById({ id: categoryId });

    if (isLoading) return <p>Loading...</p>;
    if (!categoryData) return <p>Category not found.</p>;


    return (
        <div className="max-w-2xl mx-auto mt-10 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Button variant="ghost" size="sm" className="flex items-center gap-2"
                    onClick={() => window.history.back()}
                >
                    <ArrowLeft size={16} />
                    Back
                </Button>
            </div>

            {/* Main Card */}
            <Card className="shadow-md border rounded-2xl">
                <CardHeader>
                    <CardTitle className="text-2xl font-semibold flex items-center gap-2">
                        {categoryData.name}
                        <Badge variant="secondary">ID: {categoryData.id}</Badge>
                    </CardTitle>
                </CardHeader>

                <Separator />

                <CardContent className="mt-4 space-y-4">
                    {/* Description */}
                    <div>
                        <h3 className="font-medium text-sm text-muted-foreground">
                            Description
                        </h3>
                        <p className="text-[15px] mt-1">
                            {categoryData.description || "No description available."}
                        </p>
                    </div>

                    <Separator />

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Created At</p>
                            <p className="text-[15px] font-medium">
                                {format(new Date(categoryData.createdAt), "PPPp")}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Updated At</p>
                            <p className="text-[15px] font-medium">
                                {categoryData.updatedAt
                                    ? format(new Date(categoryData.updatedAt), "PPPp")
                                    : "N/A"}
                            </p>
                        </div>

                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
