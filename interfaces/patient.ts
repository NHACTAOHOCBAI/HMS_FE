export interface Patient {
  id: string;
  fullName: string;
  email: string;
  dateOfBirth: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  phoneNumber: string;
  address: string;
  identificationNumber: string;
  bloodType: string;
  allergies: string;
  relativeFullName: string;
  relativePhoneNumber: string;
  relativeRelationship: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  deletedBy: string | null;
}
export interface PatientItem {
  id: string;
  fullName: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  phoneNumber: string;
  bloodType: string;
}
