"use client"
import { useState } from "react";
import { UserCheck, Calendar, Clock, AlertCircle, Search, User, Phone } from "lucide-react";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

import { Appointment, Patient, Employee } from "../lib/types";

const page = () => {
    const
    const { data: appointments } = useAppointments();

    return (
        <>
            {/* LABEL */}
            <div>
                <h1 className="text-gray-900 mb-2 text-2xl font-bold tracking-tight sm:text-3xl">Quầy Tiếp Nhận</h1>
                <p className="text-gray-600">Tiếp nhận và check-in bệnh nhân</p>
            </div>
            {/* TAB */}

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                <Card>
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-gray-600">Lịch hẹn hôm nay</p>
                            {/* <p className="text-lg font-semibold">{todayAppointments.length}</p> */}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <UserCheck className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-gray-600">Đã tiếp nhận</p>
                            {/* <p className="text-lg font-semibold">{checkedInAppointments.length}</p> */}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                            <Clock className="w-6 h-6 text-orange-600" />
                        </div>
                        <div>
                            <p className="text-gray-600">Chờ tiếp nhận</p>
                            {/* <p className="text-lg font-semibold">
                                {todayAppointments.length - checkedInAppointments.length}
                            </p> */}
                        </div>
                    </CardContent>
                </Card>

            </div>
            {/* Appointment list */}
            <Card>
                <CardHeader>
                    <h2 className="font-semibold text-gray-900">Danh sách chờ tiếp nhận hôm nay</h2>
                </CardHeader>

                <CardContent className="divide-y">
                    {filteredAppointments.length ? (
                        filteredAppointments.map((appointment) => {
                            const patient = getPatient(appointment.patientId);
                            const doctor = getDoctor(appointment.doctorId);
                            if (!patient) return null;

                            return (
                                <div key={appointment.id} className="p-6">
                                    <div className="flex flex-col md:flex-row gap-4 justify-between">
                                        {/* Left section */}
                                        <div className="flex gap-4 flex-1">
                                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                                <User className="w-6 h-6 text-blue-600" />
                                            </div>

                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-gray-900 font-medium">{patient.fullName}</h3>

                                                    {appointment.type === "EMERGENCY" && (
                                                        <Badge variant="destructive">Khẩn cấp</Badge>
                                                    )}
                                                </div>

                                                {/* Grid info */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                                                    <div>
                                                        <p className="text-gray-600">Mã lịch hẹn</p>
                                                        <p className="text-gray-900 font-medium">{appointment.id}</p>
                                                    </div>

                                                    <div>
                                                        <p className="text-gray-600">Số điện thoại</p>
                                                        <div className="flex items-center gap-2">
                                                            <Phone className="w-4 h-4 text-gray-400" />
                                                            <p>{patient.phoneNumber}</p>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <p className="text-gray-600">Bác sĩ</p>
                                                        <p className="text-gray-900 font-medium">BS. {doctor?.fullName}</p>
                                                    </div>

                                                    <div>
                                                        <p className="text-gray-600">Thời gian</p>
                                                        <div className="flex items-center gap-2">
                                                            <Clock className="w-4 h-4 text-gray-400" />
                                                            <p>{formatTime(appointment.appointmentTime)}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Reason */}
                                                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                                                    <p className="text-sm text-gray-600">Lý do khám:</p>
                                                    <p className="text-gray-900">{appointment.reason}</p>
                                                </div>

                                                {/* Allergies */}
                                                {patient.allergies && patient.allergies !== "None" && (
                                                    <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded flex gap-2">
                                                        <AlertCircle className="w-5 h-5 text-red-600" />
                                                        <p className="text-red-700 text-sm">
                                                            <b>Cảnh báo dị ứng:</b> {patient.allergies}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <Button
                                            onClick={() => handleCheckInClick(appointment)}
                                            className="bg-green-600 hover:bg-green-700"
                                        >
                                            <UserCheck className="w-5 h-5 mr-2" />
                                            Check-in
                                        </Button>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="p-12 text-center">
                            <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                            <h3 className="text-gray-900 text-xl font-medium">Không có bệnh nhân chờ tiếp nhận</h3>
                            <p className="text-gray-600">Tất cả bệnh nhân hôm nay đã được tiếp nhận</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </>
    )
}

export default page