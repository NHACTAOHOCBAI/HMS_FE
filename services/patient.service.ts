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
const getPatients = async ({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) => {
  await new Promise((r) => setTimeout(r, 500)); // simulate latency

  const start = (page - 1) * limit;
  const end = start + limit;

  const paginated = PATIENTS.slice(start, end);

  return {
    items: paginated,
    totalItems: PATIENTS.length,
    currentPage: page,
    totalPages: Math.ceil(PATIENTS.length / limit),
  };
};
const createPatient = async (data: {
  fullName: string;
  dob: string;
  gender: string;
  phoneNumber: string;
  email: string;
  homeAddress: string;
  cardId: string;
  contactName: string;
  relationshipToPatient: string;
  contactPhone: string;
}) => {
  console.log(data);
};
export { createPatient, getPatients };
