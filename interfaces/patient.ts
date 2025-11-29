export type Patient = {
  id: number;
  avatar: string | null; // Đường dẫn/URL avatar, null nếu không có
  fullName: string;
  dateOfBirth: string; // Có thể dùng Date object hoặc string
  gender: "Male" | "Female";
  status: PatientStatus;
};
export type PatientStatus =
  | "New"
  | "Waiting"
  | "In Visit"
  | "Completed"
  | "Active"
  | "Inactive";
