import { TableParams } from "@/hooks/useTableParams";
import { Patient } from "@/interfaces/patient";

const bloodTypes = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
const genders: Patient["gender"][] = ["MALE", "FEMALE", "OTHER"];

// ----------------------------------------------------------------------
// Generate Mock Data
// ----------------------------------------------------------------------
const generateMockPatients = (): Patient[] => {
  const list: Patient[] = [];

  for (let i = 1; i <= 50; i++) {
    list.push({
      id: `p${String(i).padStart(3, "0")}`,
      fullName: `Nguyen Van ${i}`,
      email: `patient${i}@gmail.com`,
      dateOfBirth: `199${i % 10}-0${(i % 9) + 1}-15`,
      gender: genders[i % genders.length],
      phoneNumber: `090${String(1000000 + i).slice(0, 7)}`,
      address: `${i} Main St, Ho Chi Minh City`,
      identificationNumber: `07909${String(i).padStart(6, "0")}`,
      bloodType: bloodTypes[i % bloodTypes.length],
      allergies: i % 3 === 0 ? "Penicillin, Peanuts" : "None",
      relativeFullName: `Relative ${i}`,
      relativePhoneNumber: `091${String(2000000 + i).slice(0, 7)}`,
      relativeRelationship: i % 2 === 0 ? "Spouse" : "Parent",
      createdAt: `2025-01-${String((i % 28) + 1).padStart(2, "0")}T09:00:00Z`,
      updatedAt: `2025-01-${String((i % 28) + 1).padStart(2, "0")}T10:00:00Z`,
      deletedAt: null,
      deletedBy: null,
    });
  }

  return list;
};

export const PATIENTS: Patient[] = generateMockPatients();

// ----------------------------------------------------------------------
// GET LIST
// ----------------------------------------------------------------------
export const getPatients = async (params: TableParams) => {
  const { page = 1, limit = 10 } = params;

  await new Promise((r) => setTimeout(r, 300));

  const start = (page - 1) * limit;
  const end = start + limit;

  const paginated = PATIENTS.slice(start, end);

  console.log("Fetching patients list with params:", params);

  return {
    status: "success",
    data: {
      // API spec: chỉ trả 5 trường
      content: paginated.map((p) => ({
        id: p.id,
        fullName: p.fullName,
        gender: p.gender,
        bloodType: p.bloodType,
        phoneNumber: p.phoneNumber,
      })),
      page,
      size: limit,
      totalElements: PATIENTS.length,
      totalPages: Math.ceil(PATIENTS.length / limit),
    },
  };
};

export const getPatientById = async (id: string) => {
  await new Promise((r) => setTimeout(r, 300));

  console.log("Fetching patient by ID:", id);

  const patient = PATIENTS.find((p) => p.id === id);

  if (!patient) {
    throw new Error(`Patient ${id} not found`);
  }
  const data = {
    status: "success",
    data: patient,
  };
  return data.data;
};

export const createPatient = async (data: {
  fullName: string;
  dateOfBirth: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  phoneNumber: string;
  email: string;
  address: string;
  identificationNumber: string;
  relativeFullName: string;
  relativePhoneNumber: string;
  relativeRelationship: string;
  bloodType?:
    | "A+"
    | "A-"
    | "B+"
    | "B-"
    | "AB+"
    | "AB-"
    | "O+"
    | "O-"
    | null
    | undefined;
  allergies?: string | undefined;
}) => {
  console.log("Creating patient with data:", data);
  return true;
};

// ----------------------------------------------------------------------
// UPDATE
// ----------------------------------------------------------------------
export const updatePatient = async ({
  data,
  id,
}: {
  id: string;
  data: {
    fullName: string;
    dateOfBirth: string;
    gender: "MALE" | "FEMALE" | "OTHER";
    phoneNumber: string;
    email: string;
    address: string;
    identificationNumber: string;
    relativeFullName: string;
    relativePhoneNumber: string;
    relativeRelationship: string;
    bloodType?:
      | "A+"
      | "A-"
      | "B+"
      | "B-"
      | "AB+"
      | "AB-"
      | "O+"
      | "O-"
      | null
      | undefined;
    allergies?: string | undefined;
  };
}) => {
  console.log("Updating patient:", id, data);
  return true;
};

// ----------------------------------------------------------------------
// DELETE (SOFT DELETE)
// ----------------------------------------------------------------------
export const deletePatient = async (id: string) => {
  console.log("Soft deleting patient:", id);
  return true;
};
