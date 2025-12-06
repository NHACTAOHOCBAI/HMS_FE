"use client";

import React from "react";
import { format } from "date-fns";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Prescription } from "@/interfaces/prescription";

interface Props {
    prescription?: Prescription;
}

export default function PrescriptionDetailCard({ prescription }: Props) {
    if (!prescription) return null;

    return (
        <div className="max-w-4xl mx-auto mt-8 space-y-6">
            <Card className="shadow-sm border rounded-2xl">
                <CardHeader>
                    <CardTitle className="flex items-center justify-between gap-4">
                        <div>
                            <div className="text-2xl font-semibold">Prescription</div>
                            <div className="text-sm text-muted-foreground">
                                Patient: {prescription.patient.fullName} • Doctor: {prescription.doctor.fullName}
                            </div>
                        </div>
                        <div className="text-right text-sm text-muted-foreground">
                            {format(new Date(prescription.prescribedAt), "PPPp")}
                        </div>
                    </CardTitle>
                </CardHeader>

                <Separator />

                <CardContent className="space-y-6">
                    {/* Notes */}
                    <div>
                        <p className="text-sm text-muted-foreground">Notes</p>
                        <p className="text-[15px]">{prescription.notes || "N/A"}</p>
                    </div>

                    <Separator />

                    {/* Items */}
                    <div>
                        <p className="text-sm text-muted-foreground mb-3">Prescription Items</p>
                        <div className="grid grid-cols-1 gap-4">
                            {prescription.items.map((item) => (
                                <Card key={item.id} className="border rounded-xl p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="text-lg font-medium">{item.medicine.name}</div>
                                        <Badge variant="outline">x{item.quantity}</Badge>
                                    </div>

                                    <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                                        <div>
                                            <p className="text-muted-foreground text-xs">Unit Price</p>
                                            <p className="font-medium">{item.unitPrice.toLocaleString()} VND</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground text-xs">Duration</p>
                                            <p className="font-medium">{item.durationDays} days</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground text-xs">Dosage</p>
                                            <p className="font-medium">{item.dosage}</p>
                                        </div>
                                    </div>

                                    <div className="mt-3">
                                        <p className="text-muted-foreground text-xs">Instructions</p>
                                        <p className="text-sm">{item.instructions}</p>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>

                    <Separator />

                    {/* Timestamps */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Created At</p>
                            <p className="text-[15px] font-medium">{format(new Date(prescription.createdAt), "PPPp")}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Updated At</p>
                            <p className="text-[15px] font-medium">{format(new Date(prescription.updatedAt), "PPPp")}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
