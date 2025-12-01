"use client";
import TabbedContent from "@/app/admin/_components/TabContent";
import PersonalInformationTab from "@/app/admin/patients/detail-patient/PersonalInformationTab";
import MedicalRecordTab from "@/app/admin/patients/detail-patient/MedicalRecordTab";
const productTabs = [
  {
    title: "Personal Information",
    content: <PersonalInformationTab />,
  },
  {
    title: "Medical Record",
    content: <MedicalRecordTab />,
  },
  {
    title: "Appointment",
    content: (
      <p className="text-[#9098B1]">
        air max are always very comfortable fit, clean and just perfect in every
        way. just the box was too small and scrunched the sneakers up a little
        bit, not sure if the box was always this small but the 90s are and will
        always be one of my favorites. air max are always very comfortable fit,
        clean and just perfect in every way. just the box was too small and
        scrunched the sneakers up a little bit, not sure if the box was always
        this small but the 90s are and will always be one of my favorites.
      </p>
    ),
  },
];
const DetailPatient = () => {
  return (
    <div className="w-full">
      <div className="h-[137px] rounded-[12px] border border-[#E2E8F0] p-6 flex gap-4 items-center">
        <div className="w-20 h-20 rounded-full bg-gray-400" />
        <div>
          <p className="tetx-[24px] font-medium">Nguyen Dang Phuc</p>
          <p className="text-[#6B7280] text-[14px]">Patient ID: 2</p>
        </div>
      </div>
      <TabbedContent
        tabs={productTabs}
        defaultTabTitle="Personal Information"
      />
    </div>
  );
};
export default DetailPatient;
