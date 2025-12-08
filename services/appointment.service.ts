import axiosInstance from "@/config/axios";
import {
  Appointment,
  AppointmentCreateRequest,
  AppointmentUpdateRequest,
  AppointmentCancelRequest,
  AppointmentListParams,
  PaginatedResponse,
  TimeSlot,
} from "@/interfaces/appointment";

// Export for mock usage
export type AppointmentResponse = Appointment;
import { USE_MOCK } from "@/lib/mocks/toggle";
import { mockSchedules } from "@/lib/mocks";

const BASE_URL = "/api/appointments";
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const initialMockAppointments: Appointment[] = [
  {
    id: "apt-001",
    patient: { id: "p001", fullName: "Nguyen Van An", phoneNumber: "0901234567" },
    doctor: { id: "emp-101", fullName: "Dr. John Smith", department: "Cardiology", specialization: "Cardiology" },
    appointmentTime: "2025-12-08T09:00:00",
    status: "SCHEDULED",
    type: "CONSULTATION",
    reason: "Chest pain and shortness of breath",
    notes: "",
    createdAt: "2025-12-02T10:30:00Z",
    updatedAt: "2025-12-02T10:30:00Z",
  },
  {
    id: "apt-002",
    patient: { id: "p002", fullName: "Tran Thi Mai", phoneNumber: "0912345678" },
    doctor: { id: "emp-102", fullName: "Dr. Sarah Johnson", department: "Pediatrics", specialization: "Pediatrics" },
    appointmentTime: "2025-12-08T10:30:00",
    status: "SCHEDULED",
    type: "FOLLOW_UP",
    reason: "Follow-up after flu treatment",
    createdAt: "2025-12-01T14:00:00Z",
    updatedAt: "2025-12-01T14:00:00Z",
  },
];

// --- localStorage persistence for mock data ---
const getMockAppointments = (): Appointment[] => {
  if (typeof window === "undefined") return initialMockAppointments;
  const stored = localStorage.getItem("mock_appointments");
  console.log("DEBUG: Reading from localStorage. Found data:", !!stored);
  if (stored) {
    const data = JSON.parse(stored);
    console.log(`DEBUG: Parsed ${data.length} appointments from localStorage.`);
    return data;
  } else {
    console.log("DEBUG: No data in localStorage, initializing with default mock data.");
    localStorage.setItem("mock_appointments", JSON.stringify(initialMockAppointments));
    return initialMockAppointments;
  }
};

const saveMockAppointments = (appointments: Appointment[]) => {
  if (typeof window !== "undefined") {
    console.log(`DEBUG: Saving ${appointments.length} appointments to localStorage.`);
    localStorage.setItem("mock_appointments", JSON.stringify(appointments));
  }
};
// ---------------------------------------------


// Generate time slots based on doctor's schedule (30-min intervals)
const generateTimeSlotsWithSchedule = (
  startTime: string, // "07:00"
  endTime: string, // "12:00"
  bookedTimes: string[],
  currentTime?: string
): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const [startHour, startMin] = startTime.split(":").map(Number);
  const [endHour, endMin] = endTime.split(":").map(Number);

  let currentHour = startHour;
  let currentMin = startMin;

  while (
    currentHour < endHour ||
    (currentHour === endHour && currentMin < endMin)
  ) {
    const time = `${currentHour.toString().padStart(2, "0")}:${currentMin
      .toString()
      .padStart(2, "0")}`;
    slots.push({
      time,
      datetime: `${date}T${time}:00`, // Added datetime
      available: !bookedTimes.includes(time),
      current: time === currentTime,
    });

    // Increment by 30 minutes
    currentMin += 30;
    if (currentMin >= 60) {
      currentMin = 0;
      currentHour += 1;
    }
  }

  return slots;
};

export const appointmentService = {
  // List appointments with filters and pagination
  list: async (
    params: AppointmentListParams
  ): Promise<PaginatedResponse<Appointment>> => {
    if (!USE_MOCK) {
      const response = await axiosInstance.get(BASE_URL, { params });
      return response.data;
    }

    await delay(300);
    const mockAppointments = getMockAppointments();
    let filtered = [...mockAppointments];

    // Filter by search (patient name)
    if (params.search) {
      const term = params.search.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.patient.fullName.toLowerCase().includes(term) ||
          a.doctor.fullName.toLowerCase().includes(term)
      );
    }

    // Filter by patientId
    if (params.patientId) {
      filtered = filtered.filter((a) => a.patient.id === params.patientId);
    }

    // Filter by doctorId
    if (params.doctorId) {
      filtered = filtered.filter((a) => a.doctor.id === params.doctorId);
    }

    // Filter by status
    if (params.status) {
      filtered = filtered.filter((a) => a.status === params.status);
    }

    // Filter by date range
    if (params.startDate) {
      filtered = filtered.filter((a) => a.appointmentTime >= params.startDate!);
    }
    if (params.endDate) {
      filtered = filtered.filter(
        (a) => a.appointmentTime <= params.endDate! + "T23:59:59"
      );
    }

    // Sort
    const sortField = params.sort?.split(",")[0] || "appointmentTime";
    const sortDir = params.sort?.split(",")[1] || "desc";
    
    filtered.sort((a, b) => {
      let aVal: any, bVal: any;

      if (sortField.includes('.')) {
        const [obj, prop] = sortField.split('.');
        aVal = (a as any)[obj][prop];
        bVal = (b as any)[obj][prop];
      } else {
        aVal = (a as any)[sortField];
        bVal = (b as any)[sortField];
      }
      
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    // Pagination
    const page = params.page || 0;
    const size = params.size || 10;
    const start = page * size;
    const end = start + size;
    const content = filtered.slice(start, end);

    return {
      content,
      page,
      size,
      totalElements: filtered.length,
      totalPages: Math.max(1, Math.ceil(filtered.length / size)),
      last: end >= filtered.length,
    };
  },

  // Get appointment by ID
  getById: async (id: string): Promise<Appointment | null> => {
    if (!USE_MOCK) {
      const response = await axiosInstance.get(`${BASE_URL}/${id}`);
      return response.data;
    }

    await delay(200);
    const mockAppointments = getMockAppointments();
    return mockAppointments.find((a) => a.id === id) || null;
  },

  // Create new appointment
  create: async (data: AppointmentCreateRequest): Promise<Appointment> => {
    if (!USE_MOCK) {
      const response = await axiosInstance.post(BASE_URL, data);
      return response.data;
    }

    await delay(300);
    const mockAppointments = getMockAppointments();

    // Validate appointment time is not in the past
    if (new Date(data.appointmentTime) < new Date()) {
      throw { response: { data: { error: { code: "PAST_APPOINTMENT" } } } };
    }

    // Extract date and time from appointmentTime
    const [appointmentDate, appointmentTime] = data.appointmentTime.split("T");
    const timeOnly = appointmentTime.substring(0, 5); // "HH:mm"

    // Check if doctor has schedule on this date
    const doctorSchedule = mockSchedules.find(
      (s: any) =>
        s.employeeId === data.doctorId && s.workDate === appointmentDate
    );

    if (!doctorSchedule) {
      throw {
        response: { data: { error: { code: "DOCTOR_NOT_AVAILABLE" } } },
      };
    }

    // Check if appointment time is within schedule hours
    if (
      timeOnly < doctorSchedule.startTime ||
      timeOnly >= doctorSchedule.endTime
    ) {
      throw {
        response: { data: { error: { code: "DOCTOR_NOT_AVAILABLE" } } },
      };
    }

    // Check if time slot is already taken
    const isSlotTaken = mockAppointments.some(
      (a) =>
        a.doctor.id === data.doctorId &&
        a.status !== "CANCELLED" &&
        a.appointmentTime === data.appointmentTime
    );

    if (isSlotTaken) {
      throw {
        response: { data: { error: { code: "TIME_SLOT_TAKEN" } } },
      };
    }

    // Fetch actual patient and doctor data
    const { getPatients } = await import("./patient.service");
    const { hrService } = await import("./hr.service");

    let patientName = `Patient ${data.patientId}`;
    let patientPhone = "";
    let doctorName = `Doctor ${data.doctorId}`;
    let doctorDept = "General";
    let doctorSpec = "General";

    try {
      const patientsResult = await getPatients({ page: 0, size: 100 });
      const patient = patientsResult.content.find(
        (p) => p.id === data.patientId
      );
      if (patient) {
        patientName = patient.fullName;
        patientPhone = patient.phoneNumber || "";
      } else {
        throw {
          response: { data: { error: { code: "PATIENT_NOT_FOUND" } } },
        };
      }
    } catch (e: any) {
      if (e?.response?.data?.error?.code === "PATIENT_NOT_FOUND") throw e;
      console.warn("Failed to fetch patient data for new appointment");
    }

    try {
      const doctorsResult = await hrService.getEmployees({
        page: 0,
        size: 100,
        role: "DOCTOR",
      });
      const doctor = doctorsResult.content.find(
        (d: any) => d.id === data.doctorId
      );
      if (doctor) {
        doctorName = doctor.fullName;
        doctorDept = doctor.departmentName;
        doctorSpec = doctor.specialization || "General";
      } else {
        throw {
          response: { data: { error: { code: "EMPLOYEE_NOT_FOUND" } } },
        };
      }
    } catch (e: any) {
      if (e?.response?.data?.error?.code === "EMPLOYEE_NOT_FOUND") throw e;
      console.warn("Failed to fetch doctor data for new appointment");
    }

    const newAppointment: Appointment = {
      id: `apt-${Date.now()}`,
      patient: {
        id: data.patientId,
        fullName: patientName,
        phoneNumber: patientPhone,
      },
      doctor: {
        id: data.doctorId,
        fullName: doctorName,
        department: doctorDept,
        specialization: doctorSpec,
      },
      appointmentTime: data.appointmentTime,
      status: "SCHEDULED",
      type: data.type,
      reason: data.reason,
      notes: data.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedAppointments = [newAppointment, ...mockAppointments];
    saveMockAppointments(updatedAppointments);
    return newAppointment;
  },

  // Update appointment (reschedule)
  update: async (
    id: string,
    data: AppointmentUpdateRequest
  ): Promise<Appointment> => {
    if (!USE_MOCK) {
      const response = await axiosInstance.patch(`${BASE_URL}/${id}`, data);
      return response.data;
    }

    await delay(300);
    const mockAppointments = getMockAppointments();
    const index = mockAppointments.findIndex((a) => a.id === id);
    if (index === -1) {
      throw {
        response: { data: { error: { code: "APPOINTMENT_NOT_FOUND" } } },
      };
    }

    const appointment = mockAppointments[index];
    if (appointment.status !== "SCHEDULED") {
      throw {
        response: { data: { error: { code: "APPOINTMENT_NOT_MODIFIABLE" } } },
      };
    }

    // If changing appointment time, validate doctor availability
    if (
      data.appointmentTime &&
      data.appointmentTime !== appointment.appointmentTime
    ) {
      const [appointmentDate, appointmentTime] =
        data.appointmentTime.split("T");
      const timeOnly = appointmentTime.substring(0, 5); // "HH:mm"

      // Check if doctor has schedule on new date
      const doctorSchedule = mockSchedules.find(
        (s: any) =>
          s.employeeId === appointment.doctor.id &&
          s.workDate === appointmentDate
      );

      if (!doctorSchedule) {
        throw {
          response: { data: { error: { code: "DOCTOR_NOT_AVAILABLE" } } },
        };
      }

      // Check if new time is within schedule hours
      if (
        timeOnly < doctorSchedule.startTime ||
        timeOnly >= doctorSchedule.endTime
      ) {
        throw {
          response: { data: { error: { code: "DOCTOR_NOT_AVAILABLE" } } },
        };
      }

      // Check if new time slot is already taken (excluding current appointment)
      const isSlotTaken = mockAppointments.some(
        (a) =>
          a.id !== id &&
          a.doctor.id === appointment.doctor.id &&
          a.status !== "CANCELLED" &&
          a.appointmentTime === data.appointmentTime
      );

      if (isSlotTaken) {
        throw {
          response: { data: { error: { code: "TIME_SLOT_TAKEN" } } },
        };
      }
    }

    mockAppointments[index] = {
      ...appointment,
      ...data,
      updatedAt: new Date().toISOString(),
    };

    saveMockAppointments(mockAppointments);
    return mockAppointments[index];
  },

  // Cancel appointment
  cancel: async (
    id: string,
    data: AppointmentCancelRequest,
    currentUserId?: string, // For permission check
    currentUserRole?: string
  ): Promise<Appointment> => {
    if (!USE_MOCK) {
      const response = await axiosInstance.patch(
        `${BASE_URL}/${id}/cancel`,
        data
      );
      return response.data;
    }

    await delay(300);
    const mockAppointments = getMockAppointments();
    const index = mockAppointments.findIndex((a) => a.id === id);
    if (index === -1) {
      throw {
        response: { data: { error: { code: "APPOINTMENT_NOT_FOUND" } } },
      };
    }

    const appointment = mockAppointments[index];

    // Permission check: PATIENT can only cancel own appointments
    if (
      currentUserRole === "PATIENT" &&
      appointment.patient.id !== currentUserId
    ) {
      throw {
        response: { data: { error: { code: "FORBIDDEN" } } },
      };
    }

    if (appointment.status === "CANCELLED") {
      throw { response: { data: { error: { code: "ALREADY_CANCELLED" } } } };
    }
    if (appointment.status !== "SCHEDULED") {
      throw {
        response: { data: { error: { code: "APPOINTMENT_NOT_CANCELLABLE" } } },
      };
    }

    mockAppointments[index] = {
      ...appointment,
      status: "CANCELLED",
      cancelledAt: new Date().toISOString(),
      cancelReason: data.cancelReason,
      updatedAt: new Date().toISOString(),
    };

    saveMockAppointments(mockAppointments);
    return mockAppointments[index];
  },

  // Complete appointment (doctor only)
  complete: async (
    id: string,
    currentUserId?: string, // For permission check - should be doctor's employee ID
    currentUserRole?: string
  ): Promise<Appointment> => {
    if (!USE_MOCK) {
      const response = await axiosInstance.patch(`${BASE_URL}/${id}/complete`);
      return response.data;
    }

    await delay(300);
    const mockAppointments = getMockAppointments();
    const index = mockAppointments.findIndex((a) => a.id === id);
    if (index === -1) {
      throw {
        response: { data: { error: { code: "APPOINTMENT_NOT_FOUND" } } },
      };
    }

    const appointment = mockAppointments[index];

    // Permission check: Only assigned doctor can complete
    if (
      currentUserRole === "DOCTOR" &&
      appointment.doctor.id !== currentUserId
    ) {
      throw {
        response: { data: { error: { code: "FORBIDDEN" } } },
      };
    }

    if (appointment.status === "COMPLETED") {
      throw { response: { data: { error: { code: "ALREADY_COMPLETED" } } } };
    }
    if (appointment.status === "CANCELLED") {
      throw {
        response: { data: { error: { code: "APPOINTMENT_CANCELLED" } } },
      };
    }
    if (appointment.status === "NO_SHOW") {
      throw {
        response: { data: { error: { code: "APPOINTMENT_NO_SHOW" } } },
      };
    }

    mockAppointments[index] = {
      ...appointment,
      status: "COMPLETED",
      updatedAt: new Date().toISOString(),
    };
    
    saveMockAppointments(mockAppointments);
    return mockAppointments[index];
  },

  // Get available time slots for a doctor on a specific date
  getTimeSlots: async (
    doctorId: string,
    date: string,
    excludeAppointmentId?: string
  ): Promise<TimeSlot[]> => {
    if (!USE_MOCK) {
      const response = await axiosInstance.get(`${BASE_URL}/slots`, {
        params: { doctorId, date },
      });
      return response.data;
    }

    await delay(200);
    const mockAppointments = getMockAppointments();

    // Check doctor's schedule for this date
    const doctorSchedule = mockSchedules.find(
      (s: any) => s.employeeId === doctorId && s.workDate === date
    );

    // If no schedule, return empty array
    if (!doctorSchedule) {
      return [];
    }

    // Get booked times for this doctor on this date
    const bookedTimes = mockAppointments
      .filter((a) => {
        if (a.doctor.id !== doctorId) return false;
        if (a.status === "CANCELLED") return false;
        if (excludeAppointmentId && a.id === excludeAppointmentId) return false;
        const aptDate = a.appointmentTime.split("T")[0];
        return aptDate === date;
      })
      .map((a) => {
        const time = a.appointmentTime.split("T")[1];
        return time.substring(0, 5); // "HH:mm"
      });

    // Current time if editing
    let currentTime: string | undefined;
    if (excludeAppointmentId) {
      const current = mockAppointments.find(
        (a) => a.id === excludeAppointmentId
      );
      if (current) {
        const aptDate = current.appointmentTime.split("T")[0];
        if (aptDate === date) {
          currentTime = current.appointmentTime.split("T")[1].substring(0, 5);
        }
      }
    }

    // Generate slots only within doctor's schedule hours
    return generateTimeSlotsWithSchedule(
      doctorSchedule.startTime,
      doctorSchedule.endTime,
      bookedTimes,
      currentTime
    );
  },
};

// Re-export types
export type { Appointment, AppointmentCreateRequest, AppointmentListParams };
export type AppointmentStatus =
  import("@/interfaces/appointment").AppointmentStatus;
export type AppointmentType =
  import("@/interfaces/appointment").AppointmentType;

// Legacy function exports for existing code compatibility
export const listAppointments = appointmentService.list;
export const createAppointment = (data: AppointmentCreateRequest) =>
  appointmentService.create(data);
export const updateAppointment = (id: string, data: AppointmentUpdateRequest) =>
  appointmentService.update(id, data);

export default appointmentService;
