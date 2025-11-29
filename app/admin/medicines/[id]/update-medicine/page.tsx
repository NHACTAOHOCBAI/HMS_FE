"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useCategory } from "@/hooks/queries/useCategory";
import Link from "next/link";
import { CategoryFilter } from "@/app/admin/_components/CategoryFilter";
import { useParams } from "next/navigation";
import { useMedicineById } from "@/hooks/queries/useMedicine";

export default function UpdateMedicineForm() {
    const params = useParams();
    const id = params.id as string;

    const { data: categories } = useCategory();
    const { data: medicine } = useMedicineById(id);
    console.log("medicine", medicine);//?? ko có description

    // Gán date từ API
    const [date, setDate] = useState<Date | undefined>(
        medicine ? parseISO(medicine.expiresAt) : undefined
    );

    if (!medicine) return <div>Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto p-6 border rounded-xl shadow-sm bg-white">
            <h2 className="text-xl font-semibold mb-6">Update medicine</h2>

            <div className="space-y-6">

                {/* Name */}
                <div className="space-y-2">
                    <Label>Name</Label>
                    <Input
                        placeholder="Enter medicine's name"
                        defaultValue={medicine.name}
                    />
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                        placeholder="Description..."
                        className="h-24"
                        defaultValue={medicine.description ?? ""}
                    />
                </div>

                {/* GRID 3 columns */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                    {/* Expiry date */}
                    <div className="space-y-2">
                        <Label>Expiry date</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !date && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {date ? format(date, "MM/dd/yyyy") : "MM/DD/YYYY"}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="p-0">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* Quantity */}
                    <div className="space-y-2">
                        <Label>Quantity</Label>
                        <Input
                            type="number"
                            defaultValue={medicine.quantity}
                        />
                    </div>

                    {/* Unit */}
                    <div className="space-y-2">
                        <Label>Unit</Label>
                        <Input
                            defaultValue={medicine.unit}
                            placeholder="Bottle, box, tablet..."
                        />
                    </div>

                </div>

                {/* Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Category</Label>
                        <CategoryFilter
                            categories={categories ?? []}
                        // defaultValue={medicine.categoryId}
                        />
                    </div>
                </div>

                {/* Prices */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div className="space-y-2">
                        <Label>Purchase Price</Label>
                        <Input
                            type="number"
                            defaultValue={medicine.purchasePrice}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Sale Price</Label>
                        <Input
                            type="number"
                            defaultValue={medicine.sellingPrice}
                        />
                    </div>
                </div>

                {/* Submit */}
                <div className="flex justify-end gap-4 pt-4">
                    <Link href="/admin/medicines/medicine-list">
                        <Button variant="outline">Cancel</Button>
                    </Link>
                    <Button>Submit</Button>
                </div>
            </div>
        </div>
    );
}
