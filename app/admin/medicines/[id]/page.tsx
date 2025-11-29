"use client";

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useMedicineById } from "@/hooks/queries/useMedicine";
import { useParams } from "next/navigation";


export default function MedicineDetail() {
    const params = useParams();
    const id = params.id as string;

    const { data: medicine } = useMedicineById(id);
    if (!medicine) {
        return <div>Loading...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto py-8">
            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">Medicine Information</CardTitle>
                </CardHeader>

                <CardContent className="space-y-6">

                    {/* ==== TOP BASIC INFO ==== */}
                    <div className="grid grid-cols-2 gap-y-4">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">ID</p>
                            <p className="text-base font-semibold">{medicine.id}</p>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Name</p>
                            <p className="text-base font-semibold">{medicine.name}</p>
                        </div>

                        <div className="col-span-2">
                            <p className="text-sm font-medium text-muted-foreground">Description</p>
                            <p>{medicine.description || "No description"}</p>
                        </div>
                    </div>

                    <Separator />

                    {/* ==== MID INFO ==== */}
                    <div className="grid grid-cols-3 gap-y-4">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Expiry Date</p>
                            <p>{medicine.expiresAt}</p>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Quantity</p>
                            <p>{medicine.quantity}</p>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Unit</p>
                            <p>{medicine.unit}</p>
                        </div>
                    </div>

                    <Separator />

                    {/* ==== CATEGORY ==== */}
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Category</p>
                        <p>{medicine.categoryId || "No category"}</p>
                    </div>

                    <Separator />

                    {/* ==== PRICES ==== */}
                    <div className="grid grid-cols-2 gap-y-4">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Purchase Price</p>
                            <p className="font-semibold">
                                {medicine.purchasePrice.toLocaleString()} VND
                            </p>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Sale Price</p>
                            <p className="font-semibold">
                                {medicine.sellingPrice.toLocaleString()} VND
                            </p>
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="flex justify-end">
                    <Button variant="outline">Back</Button>
                </CardFooter>
            </Card>
        </div>
    );
}
