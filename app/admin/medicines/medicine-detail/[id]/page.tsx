"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pencil } from "lucide-react";
import { format } from "date-fns";
import { useMedicineById } from "@/hooks/queries/useMedicine";
import { useParams } from "next/navigation";

export default function MedicineDetail() {
    const { id } = useParams();
    const medicineId = Array.isArray(id) ? id[0] : id || "";

    const { data: medicineData, isLoading } = useMedicineById(medicineId);

    if (isLoading) return <p>Loading...</p>;
    if (!medicineData) return <p>Medicine not found.</p>;

    const data = medicineData;

    return (
        <div className="max-w-3xl mx-auto mt-10 space-y-6">
            {/* Back Button */}
            <div className="flex items-center justify-between">
                <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() => window.history.back()}
                >
                    <ArrowLeft size={16} />
                    Back
                </Button>
            </div>

            {/* Main Card */}
            <Card className="shadow-md border rounded-2xl">
                <CardHeader>
                    <CardTitle className="text-2xl font-semibold flex items-center gap-3">
                        {data.name}
                        <Badge variant="secondary">ID: {data.id}</Badge>
                    </CardTitle>
                </CardHeader>

                <Separator />

                <CardContent className="mt-4 space-y-6">

                    {/* INFO GRID */}
                    <div className="grid grid-cols-2 gap-6">

                        <div>
                            <p className="text-sm text-muted-foreground">Active Ingredient</p>
                            <p className="text-[15px] font-medium">{data.activeIngredient}</p>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">Unit</p>
                            <p className="text-[15px] font-medium">{data.unit}</p>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">Concentration</p>
                            <p className="text-[15px] font-medium">{data.concentration}</p>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">Packaging</p>
                            <p className="text-[15px] font-medium">{data.packaging}</p>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">Quantity</p>
                            <p className="text-[15px] font-medium">{data.quantity}</p>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">Purchase Price</p>
                            <p className="text-[15px] font-medium">{data.purchasePrice}₫</p>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">Selling Price</p>
                            <p className="text-[15px] font-medium">{data.sellingPrice}₫</p>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">Expires At</p>
                            <p className="text-[15px] font-medium">
                                {data.expiresAt
                                    ? format(new Date(data.expiresAt), "PPP")
                                    : "N/A"}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">Manufacturer</p>
                            <p className="text-[15px] font-medium">{data.manufacturer}</p>
                        </div>
                    </div>

                    <Separator />

                    {/* OPTIONAL FIELDS */}
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Description</p>
                            <p className="text-[15px]">
                                {data.description || "No description."}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">Side Effects</p>
                            <p className="text-[15px]">
                                {data.sideEffects || "No data."}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">Storage Conditions</p>
                            <p className="text-[15px]">
                                {data.storageConditions || "No data."}
                            </p>
                        </div>
                    </div>

                    <Separator />

                    {/* CATEGORY INFO */}
                    <div>
                        <p className="text-sm text-muted-foreground">Category</p>
                        <p className="text-[15px] font-medium">
                            {data.category?.name || "No category"}
                        </p>
                        {data.category?.description && (
                            <p className="text-sm text-muted-foreground mt-1">
                                {data.category.description}
                            </p>
                        )}
                    </div>

                    <Separator />

                    {/* DATES */}
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <p className="text-sm text-muted-foreground">Created At</p>
                            <p className="text-[15px] font-medium">
                                {format(new Date(data.createdAt), "PPPp")}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">Updated At</p>
                            <p className="text-[15px] font-medium">
                                {data.updatedAt
                                    ? format(new Date(data.updatedAt), "PPPp")
                                    : "N/A"}
                            </p>
                        </div>
                    </div>

                </CardContent>
            </Card>
        </div>
    );
}
