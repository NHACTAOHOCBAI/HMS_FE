"use client";

import { usePatientById } from "@/hooks/queries/usePatient";
import { formatDateTimeVi } from "@/lib/utils";

const Item = ({ label, value }: { label: string; value?: string | null }) => (
  <div className="flex flex-col gap-1">
    <p className="text-gray-400 text-xs">{label}</p>
    <p className="text-sm font-medium">{value || "---"}</p>
  </div>
);

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="border border-gray-200 rounded-xl p-4 bg-white shadow-xs ">
    <h3 className="font-semibold mb-4">{title}</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
  </div>
);

const ProfileTab = ({ id }: { id: string }) => {
  const { data: patient, isLoading } = usePatientById(id);

  if (isLoading) return <p>Loading...</p>;
  if (!patient) return <p>No patient found.</p>;

  return (
    <div className="space-y-6">
      {/* ================= Personal Information ================= */}
      <Section title="Personal Information">
        <Item label="Full name" value={patient.fullName} />
        <Item label="Gender" value={patient.gender} />
        <Item label="Date of birth" value={patient.dateOfBirth} />
        <Item label="Email" value={patient.email} />
        <Item label="Phone number" value={patient.phoneNumber} />
        <Item label="Address" value={patient.address} />
        <Item
          label="Identification Number"
          value={patient.identificationNumber}
        />
        <Item label="Blood type" value={patient.bloodType} />
        <Item label="Allergies" value={patient.allergies} />
      </Section>

      {/* ================= Relative Information ================= */}
      <Section title="Relative Information">
        <Item label="Relative full name" value={patient.relativeFullName} />
        <Item
          label="Relative phone number"
          value={patient.relativePhoneNumber}
        />
        <Item label="Relationship" value={patient.relativeRelationship} />
      </Section>

      {/* ================= System Information ================= */}
      <Section title="System Information">
        <Item label="Created at" value={formatDateTimeVi(patient.createdAt)} />
        <Item label="Updated at" value={formatDateTimeVi(patient.updatedAt)} />
        <Item label="Deleted at" value={formatDateTimeVi(patient.deletedAt)} />
        <Item label="Deleted by" value={patient.deletedBy} />
      </Section>
    </div>
  );
};

export default ProfileTab;
