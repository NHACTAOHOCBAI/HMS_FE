export type AppointmentStatus =
  | "SCHEDULED"
  | "CHECKED_IN"
  | "COMPLETED"
  | "CANCELLED"
  | "NO_SHOW";

export type AppointmentType = "CONSULTATION" | "FOLLOW_UP" | "EMERGENCY";
export interface Appointment {
  id: string;

  patient: {
    id: string;
    fullName: string;
    phoneNumber?: string;
  };

  doctor: {
    id: string;
    fullName: string;
    department: string;
    phoneNumber?: string;
  };

  appointmentTime: string;
  status: AppointmentStatus;
  type: AppointmentType;
  reason: string;
  notes?: string | null;
  cancelledAt?: string | null;
  cancelReason?: string | null;
  createdAt: string;
  updatedAt: string;
  updatedBy?: string | null;
}
export interface AppointmentItem {
  id: string;
  patient: {
    id: string;
    fullName: string;
  };
  doctor: {
    id: string;
    fullName: string;
    department: string;
  };
  appointmentTime: string; // ISO datetime
  status: AppointmentStatus;
  type: AppointmentType;
  reason: string;
}
