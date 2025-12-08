import {
  Appointment,
  AppointmentItem,
  AppointmentType,
} from "@/interfaces/appointment";
import { TableParams } from "@/hooks/useTableParams";

const APPOINTMENT_TYPES: Appointment["type"][] = [
  "CONSULTATION",
  "FOLLOW_UP",
  "EMERGENCY",
];

const APPOINTMENT_STATUSES: Appointment["status"][] = [
  "SCHEDULED",
  "COMPLETED",
  "CANCELLED",
  "NO_SHOW",
];

// -------------------------------------------------------------
// Generate Mock Appointment Data
// -------------------------------------------------------------
const generateMockAppointments = (): Appointment[] => {
  const list: Appointment[] = [];

  for (let i = 1; i <= 50; i++) {
    list.push({
      id: `apt${String(i).padStart(3, "0")}`,
      patient: {
        id: `p${String(i).padStart(3, "0")}`,
        fullName: `Nguyen Van ${i}`,
        phoneNumber: `09012345${(i % 90).toString().padStart(2, "0")}`,
      },
      doctor: {
        id: `emp${String((i % 10) + 1).padStart(3, "0")}`,
        fullName: `Dr. Doctor ${(i % 10) + 1}`,
        department: i % 2 === 0 ? "Cardiology" : "Neurology",
        phoneNumber: "0909999999",
      },
      appointmentTime: `2025-12-${String((i % 28) + 1).padStart(2, "0")}T0${
        i % 9
      }:00:00`,
      status: APPOINTMENT_STATUSES[i % APPOINTMENT_STATUSES.length],
      type: APPOINTMENT_TYPES[i % APPOINTMENT_TYPES.length],
      reason: i % 3 === 0 ? "Chest pain" : "General check-up",
      notes: null,
      cancelledAt: null,
      cancelReason: null,
      createdAt: "2025-12-01T10:00:00Z",
      updatedAt: "2025-12-01T10:00:00Z",
      updatedBy: null,
    });
  }

  return list;
};
export const getAppointments = async (params: TableParams) => {
  const { page = 1, limit = 10 } = params;

  await new Promise((r) => setTimeout(r, 300));

  const start = (page - 1) * limit;
  const end = start + limit;
  const paginated = APPOINTMENTS.slice(start, end);
  console.log("Fetching appointments list with params:", params);
  return {
    status: "success",
    data: {
      content: paginated.map((p) => p as AppointmentItem),
      page,
      size: limit,
      totalElements: APPOINTMENTS.length,
      totalPages: Math.ceil(APPOINTMENTS.length / limit),
    },
  };
};
export const getAppointmentById = async (id: string) => {
  await new Promise((r) => setTimeout(r, 300));

  const apt = APPOINTMENTS.find((a) => a.id === id);

  if (!apt) throw new Error(`APPOINTMENT_NOT_FOUND`);
  const data = {
    status: "success",
    data: apt,
  };
  return data.data;
};
export const createAppointment = async (data: {
  patientId: string;
  doctorId: string;
  appointmentTime: string;
  type: AppointmentType;
  reason: string;
}) => {
  console.log("Creating appointment:", data);

  return true;
};
export const updateAppointment = async ({
  id,
  data,
}: {
  id: string;
  data: {
    appointmentTime: string;
    type: AppointmentType;
    reason: string;
    notes?: string;
  };
}) => {
  console.log("Creating appointment:", data, id);

  return true;
};
export const cancelAppointment = async ({
  id,
  data,
}: {
  data: { cancelReason: string };
  id: string;
}) => {
  console.log("Creating appointment:", data, id);

  return true;
};
export const completeAppointment = async (id: string) => {
  console.log("Complete appointment:", id);

  return true;
};
//checkIn
export const checkIn = async (id: string) => {
  console.log("checkIn appointment:", id);

  return true;
};
// getAppointmentsByPatient
export const getAppointmentsByPatient = async (patientId: string) => {
  await new Promise((r) => setTimeout(r, 300)); // simulate latency

  console.log("Fetching appointments for patient:", patientId);

  const data = APPOINTMENTS.filter((apt) => apt.patient.id === patientId);

  return data;
};

export const APPOINTMENTS: Appointment[] = generateMockAppointments();
