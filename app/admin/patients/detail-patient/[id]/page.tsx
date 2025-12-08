"use client";
import MyTab from "@/app/admin/_components/MyTabs";
import MedicalRecordTab from "@/app/admin/patients/detail-patient/MedicalRecordTab";
import ProfileTab from "@/app/admin/patients/detail-patient/ProfileTab";
import AppointmentTab from "@/app/admin/patients/detail-patient/ScheduleTab";
import { useParams } from "next/navigation";

const DetailPatient = () => {
  const { id } = useParams();
  const patientId = Array.isArray(id) ? id[0] : id || "";
  const tabs = [
    {
      title: "Profile",
      content: <ProfileTab id={patientId} />,
    },
    {
      title: "Medical record",
      content: <MedicalRecordTab id={patientId} />,
    },
    {
      title: "Appointment",
      content: <AppointmentTab id={patientId} />,
    },
  ];
  return (
    <div>
      <p>Detail Patient</p>
      <MyTab tabs={tabs} defaultTabTitle="Profile" />
    </div>
  );
};
export default DetailPatient;
