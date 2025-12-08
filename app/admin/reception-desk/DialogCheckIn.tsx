import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertCircle, UserCheck } from "lucide-react";
import { Info } from "./InfoItem";
import { AppointmentItem } from "@/interfaces/appointment";

{/* Dialog Check-in */ }
export const CheckInDialog = ({ isDialogOpen, setIsDialogOpen, selectedAppointment, handleConfirmCheckIn }: { isDialogOpen: boolean, setIsDialogOpen: any, selectedAppointment: AppointmentItem | null, handleConfirmCheckIn: any }) => {
    if (!isDialogOpen) return null;
    if (!selectedAppointment) return null;

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} >
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Xác nhận tiếp nhận bệnh nhân</DialogTitle>
                </DialogHeader>

                {selectedAppointment && (() => {
                    const patient = selectedAppointment.patient;
                    const doctor = selectedAppointment.doctor;


                    return (
                        <div className="space-y-6">
                            {/* Patient Info */}
                            <div className="bg-blue-50 rounded-lg p-4">
                                <h3 className="text-gray-900 mb-3 text-sm font-semibold">
                                    Thông tin bệnh nhân
                                </h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <Info label="Họ và tên" value={patient?.fullName} />
                                    <Info label="Số điện thoại" value={patient?.phoneNumber} />
                                    <Info
                                        label="Ngày sinh"
                                        value={
                                            patient
                                                ? new Date(
                                                    patient.dateOfBirth ?? ""
                                                ).toLocaleDateString("vi-VN")
                                                : ""
                                        }
                                    />
                                    <Info
                                        label="Nhóm máu"
                                        value={patient?.bloodType || "Chưa xác định"}
                                    />
                                </div>
                            </div>

                            {/* Exam Info */}
                            <div className="bg-green-50 rounded-lg p-4">
                                <h3 className="text-gray-900 mb-3 text-sm font-semibold">
                                    Thông tin khám
                                </h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <Info label="Bác sĩ" value={`BS. ${doctor?.fullName}`} />
                                    <Info
                                        label="Loại khám"
                                        value={selectedAppointment.type}
                                    />
                                    <div className="col-span-2">
                                        <Info
                                            label="Lý do khám"
                                            value={selectedAppointment.reason}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Allergies */}
                            {patient?.allergies && patient.allergies !== "None" && (
                                <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                                    <div className="flex gap-3">
                                        <AlertCircle className="w-6 h-6 text-red-700" />
                                        <div>
                                            <h3 className="text-red-900 font-semibold">
                                                Cảnh báo dị ứng
                                            </h3>
                                            <p className="text-red-700">{patient.allergies}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Warning */}
                            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg text-sm text-yellow-800">
                                Sau khi check-in, bệnh nhân sẽ được thêm vào hàng đợi khám và
                                nhận số thứ tự.
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => setIsDialogOpen(false)}
                                >
                                    Hủy
                                </Button>
                                <Button onClick={handleConfirmCheckIn}>
                                    <UserCheck className="w-5 h-5 mr-1" /> Xác nhận
                                </Button>
                            </div>
                        </div>
                    );
                })()}
            </DialogContent>
        </Dialog>
    )
};