import { TableParams } from "@/hooks/useTableParams";
import { Patient, PatientStatus } from "@/interfaces/patient";
const mockStatus: PatientStatus[] = [
  "New",
  "Waiting",
  "In Visit",
  "Completed",
  "Active",
  "Inactive",
];
const generateMockUsers = (): Patient[] => {
  const list: Patient[] = [];

  for (let i = 1; i <= 50; i++) {
    list.push({
      id: i,
      avatar: null,
      fullName: `User ${i}`,
      dateOfBirth: "20/11/2005",
      gender: i % 2 === 0 ? "Male" : "Female",
      status: mockStatus[i % mockStatus.length],
    });
  }

  return list;
};

const PATIENTS = generateMockUsers();
export const getPatients = async (params: TableParams) => {
  const { page, limit } = params;
  await new Promise((r) => setTimeout(r, 500)); // simulate latency

  const start = (page - 1) * limit;
  const end = start + limit;

  const paginated = PATIENTS.slice(start, end);
  console.log("Fetching patients with params:", params);
  return {
    status: "success",
    data: {
      content: paginated,
      page: page,
      size: limit,
      totalElements: PATIENTS.length,
      totalPages: Math.ceil(PATIENTS.length / limit),
    },
  };
};
export const createPatient = async (data: { fullName: string }) => {
  console.log("Creating patient with data:", data);
  return true;
};
