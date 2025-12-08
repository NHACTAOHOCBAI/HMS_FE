"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit3 } from "lucide-react";
import { MedicalExam } from "@/interfaces/medicalExam";
import { Prescription } from "@/interfaces/prescription";
import PrescriptionDetailCard from "./PrescriptionCard";
import { AddPrescriptionDialog } from "./AddPrescription";

interface Props {
    exam: MedicalExam;
    prescription?: Prescription
    onBack?: () => void;
}

export function ExamDetailCard({ exam, prescription, onBack }: Props) {

    const [open, setOpen] = useState(false);



    return (
        <div className="max-w-4xl mx-auto mt-8 space-y-6">
            <div className="flex items-center justify-between">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => (onBack ? onBack() : window.history.back())}
                    className="flex items-center gap-2"
                >
                    <ArrowLeft size={16} />
                    Back
                </Button>


            </div>

            <Card className="shadow-sm border rounded-2xl">
                <CardHeader>
                    <CardTitle className="flex items-center justify-between gap-4">
                        <div>
                            <div className="text-2xl font-semibold">{exam.diagnosis}</div>
                            <div className="text-sm text-muted-foreground">
                                Patient: {exam.patient.fullName} • Doctor: {exam.doctor.fullName}
                            </div>
                        </div>
                        <div className="text-right text-sm text-muted-foreground">
                            {exam.examDate ? format(new Date(exam.examDate), "PPPp") : "N/A"}
                        </div>
                    </CardTitle>
                </CardHeader>

                <Separator />

                <CardContent className="space-y-6">
                    {/* Basic appointment */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Appointment</p>
                            <p className="text-[15px] font-medium">
                                {exam.appointment?.id ?? "N/A"} •{" "}
                                {exam.appointment?.appointmentTime
                                    ? format(new Date(exam.appointment.appointmentTime), "PPPp")
                                    : "N/A"}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">Created At</p>
                            <p className="text-[15px] font-medium">
                                {exam.createdAt ? format(new Date(exam.createdAt), "PPPp") : "N/A"}
                            </p>
                        </div>
                    </div>

                    <Separator />

                    {/* Diagnosis / Symptoms / Treatment / Notes */}
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Diagnosis</p>
                            <p className="text-[15px]">{exam.diagnosis}</p>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">Symptoms</p>
                            <p className="text-[15px]">{exam.symptoms || "N/A"}</p>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">Treatment</p>
                            <p className="text-[15px]">{exam.treatment || "N/A"}</p>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">Notes</p>
                            <p className="text-[15px]">{exam.notes || "N/A"}</p>
                        </div>
                    </div>

                    <Separator />

                    {/* Vitals */}
                    <div>
                        <p className="text-sm text-muted-foreground mb-2">Vitals</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                            <div>
                                <p className="text-xs text-muted-foreground">Temp (°C)</p>
                                <p className="font-medium">{exam.vitals.temperature ?? "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">BP Sys (mmHg)</p>
                                <p className="font-medium">{exam.vitals.bloodPressureSystolic ?? "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">BP Dia (mmHg)</p>
                                <p className="font-medium">{exam.vitals.bloodPressureDiastolic ?? "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">HR (bpm)</p>
                                <p className="font-medium">{exam.vitals.heartRate ?? "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Weight (kg)</p>
                                <p className="font-medium">{exam.vitals.weight ?? "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Height (cm)</p>
                                <p className="font-medium">{exam.vitals.height ?? "N/A"}</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {prescription ? (
                <PrescriptionDetailCard prescription={prescription} />
            ) : (<>
                <Card className="shadow-sm border rounded-2xl">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold">Prescription</CardTitle>
                    </CardHeader>

                    <Separator />

                    <CardContent className="py-8">
                        <p className="text-center text-muted-foreground mb-4">
                            No prescription available for this exam.
                        </p>

                        <div className="flex justify-center">
                            <Button className="flex items-center gap-2" variant="default"
                                // mở modal thêm đơn thuốc
                                onClick={() => {
                                    setOpen(true);
                                }}
                            >
                                <Edit3 size={16} />
                                Add Prescription
                            </Button>
                        </div>
                    </CardContent>
                </Card>
                <AddPrescriptionDialog open={open} setOpen={setOpen} /></>
            )}


        </div>
    );
}
