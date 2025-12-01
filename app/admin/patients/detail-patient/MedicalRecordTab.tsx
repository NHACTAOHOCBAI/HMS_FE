import { MySimpleTable } from "@/app/admin/_components/MySimpleTable";
import OutpatientTimeline from "@/app/admin/_components/MyTimeLine";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ColumnDef } from "@tanstack/react-table";
interface MyDisplayItemProps {
  label: string;
  value: string;
}
const MyDisplayItem = ({ label, value }: MyDisplayItemProps) => {
  return (
    <div>
      <p className="text-[14px]">{label}</p>
      <div className="bg-[#F8FAFC] mt-2 border-[#E2E8F0] border rounded-xl p-4 text-[14px]">
        {value}
      </div>
    </div>
  );
};
const MyDisplayItem2 = ({ label, value }: MyDisplayItemProps) => {
  return (
    <div className="bg-[#F8FAFC] border-[#E2E8F0] border rounded-xl p-4 min-w-[120px] ">
      <p className="text-[12px] text-[#64748B] uppercase">{label}</p>
      <p className="text-[18px] font-medium"> {value}</p>
    </div>
  );
};
const MyDisplayItem3 = ({ label, value }: MyDisplayItemProps) => {
  return (
    <div className="bg-[#F8FAFC] border-[#E2E8F0] border rounded-xl p-4 min-w-[120px] ">
      <p className="text-[14px]  font-medium">{label}</p>
      <p className="text-[14px] text-[#64748B]"> {value}</p>
    </div>
  );
};
const MedicalRecordTab = () => {
  return (
    <div className="mx-auto">
      <div className=" bg-white rounded-[12px] border border-[#E2E8F0] flex items-center justify-between p-6">
        <div>
          <p className="font-medium">Patient record</p>
          <p>Visit ID: VIS-2025-00123</p>
        </div>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a fruit" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Fruits</SelectLabel>
              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="banana">Banana</SelectItem>
              <SelectItem value="blueberry">Blueberry</SelectItem>
              <SelectItem value="grapes">Grapes</SelectItem>
              <SelectItem value="pineapple">Pineapple</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button
          variant={"outline"}
          className="text-app-primary-blue-700 hover:text-app-primary-blue-700/80 "
        >
          Export PDF
        </Button>
      </div>

      <div className="flex gap-6 mt-6">
        <div className="flex-1 ">
          {/* Visit information */}
          <div className=" bg-white rounded-[12px] border border-[#E2E8F0] p-6">
            <p className="font-medium">Visit Information</p>
            <div className="flex mt-4">
              <div className="flex-1">
                <p className="text-[12px] font-light text-[#64748B]">
                  VISIT ID
                </p>
                <p className="mb-2 text-[14px]">VIS-2025-00123</p>
                <p className="text-[12px] font-light text-[#64748B]">
                  VISIT TIME
                </p>
                <p className="text-[14px]">12/11/2025 - 09:30</p>
              </div>
              <div className="flex-1">
                <p className="text-[12px] font-light text-[#64748B]">
                  VISIT ID
                </p>
                <p className="mb-2 text-[14px]">VIS-2025-00123</p>
                <p className="text-[12px] font-light text-[#64748B]">
                  VISIT TIME
                </p>
                <p className="text-[14px]">12/11/2025 - 09:30</p>
              </div>
            </div>
          </div>
          {/* Reason */}
          <div className=" mt-6 bg-white rounded-[12px] border border-[#E2E8F0] p-6">
            <p className="font-medium">Reason </p>
            <div className="flex mt-4 flex-col gap-3">
              <MyDisplayItem
                label="Chief complaint"
                value="Left chest discomfort for 2 days, worse on exertion, mild shortness of breath."
              />
              <MyDisplayItem
                label="History of present illness"
                value="Gradual onset chest tightness, occasional palpitations, no syncope. Symptoms relieved partly by rest;
no fever; appetite unchanged."
              />
            </div>
          </div>
          {/* Past history & Allergies */}
          <div className=" mt-6 bg-white rounded-[12px] border border-[#E2E8F0] p-6">
            <p className="font-medium">Past history & Allergies </p>
            <div className="flex mt-4 gap-3">
              <MyDisplayItem
                label="Past medical history"
                value="Hypertension for 5 years, type 2 diabetes for 2
years; no prior surgeries."
              />
              <MyDisplayItem label="Allergies" value="Penicilin" />
            </div>
          </div>
          {/* Vitals & Physical exam */}
          <div className=" mt-6 bg-white rounded-[12px] border border-[#E2E8F0] p-6">
            <p className="font-medium">Vitals & Physical exam </p>
            <div className="mt-4">
              <div className="flex gap-3 mb-4">
                <MyDisplayItem2 label="Blood pressure" value="120/78" />
                <MyDisplayItem2 label="Pulse" value="78 bpm" />
                <MyDisplayItem2 label="Temperature" value="37.2 oC" />
                <MyDisplayItem2 label="Respiratory rate" value="18 /min" />
                <MyDisplayItem2 label="SpO?" value="98%" />
              </div>
              <MyDisplayItem
                label="Physical examination"
                value="Clear breath sounds, no wheeze; heart sounds regular, no murmur; abdomen soft, non-tender; neuro
exam grossly intact."
              />
            </div>
          </div>
          {/* Labs & Imaging */}
          <div className=" mt-6 bg-white rounded-[12px] border border-[#E2E8F0] p-6">
            <p className="font-medium">Labs & Imaging </p>
            <div className="mt-4 gap-3">
              <LabAndImagingTable />
            </div>
          </div>
          {/* Diagnosis & Treatment plan */}
          <div className=" mt-6 bg-white rounded-[12px] border border-[#E2E8F0] p-6">
            <p className="font-medium">Diagnosis & Treatment plan </p>
            <div className="flex mt-4 gap-3">
              <MyDisplayItem3
                label="Diagnosis"
                value="Hypertension for 5 years, type 2 diabetes for 2
years; no prior surgeries."
              />
              <MyDisplayItem3
                label="Treatment plan"
                value="Medical management for bronchitis; continue
antihypertensives; home rest, hydration;
follow-up labs if fever persists; consider
imaging review once available."
              />
            </div>
          </div>
          {/* Labs & Imaging */}
          <div className=" mt-6 bg-white rounded-[12px] border border-[#E2E8F0] p-6">
            <p className="font-medium">Patient prescription </p>
            <div className="mt-4 gap-3">
              <PatientPrescriptionTable />
            </div>
          </div>
        </div>
        <div className="w-[360px]">
          {/* Patient summary */}
          <div className="  bg-white rounded-[12px] border border-[#E2E8F0] p-6">
            <p className="font-medium">Patient summary </p>
            <div className="flex justify-between items-start gap-4 mt-4">
              <p className="text-[12px] font-light text-[#64748B]">
                Patient ID
              </p>
              <p className="text-[14px]">2</p>
            </div>
            <div className="flex justify-between items-start gap-4">
              <p className="text-[12px] font-light text-[#64748B]">
                Date of birth
              </p>
              <p className="text-[14px]">20/11/2005</p>
            </div>
            <div className="flex justify-between items-start gap-4">
              <p className="text-[12px] font-light text-[#64748B]">Gender</p>
              <p className="text-[14px]">Male</p>
            </div>
            <div className="flex justify-between items-start gap-4">
              <p className="text-[12px] font-light text-[#64748B]">Address</p>
              <p className="text-[14px]">
                KTX khu B - Dong Hoa - Di An - Binh Duong
              </p>
            </div>
          </div>
          {/* Timeline */}
          <div className=" mt-6 bg-white rounded-[12px] border border-[#E2E8F0] p-6">
            <p className="font-medium">Patient outline </p>
            <OutpatientTimeline />
          </div>
        </div>
      </div>
    </div>
  );
};
const LabAndImagingTable = () => {
  type LabsAndImaging = {
    id: string;
    serviceType: string;
    order: string;
    date: string;
  };

  const columns: ColumnDef<LabsAndImaging>[] = [
    {
      accessorKey: "serviceType",
      header: "Service type",
    },
    {
      accessorKey: "order",
      header: "Order",
    },
    {
      accessorKey: "date",
      header: "Date",
    },
  ];
  const data: LabsAndImaging[] = [
    {
      id: "1",
      serviceType: "Blood test",
      order: "Complete blood count",
      date: "12/11/2025",
    },
    {
      id: "2",
      serviceType: "Imaging",
      order: "Chest X-ray",
      date: "12/11/2025",
    },
    {
      id: "3",
      serviceType: "ECG",
      order: "12-lead ECG",
      date: "12/11/2025",
    },
  ];
  return <MySimpleTable columns={columns} data={data} />;
};
const PatientPrescriptionTable = () => {
  type PatientPrescription = {
    id: string;
    medication: string;
    strength: string;
    dosage: string;
    days: number;
    notes: string;
  };

  const columns: ColumnDef<PatientPrescription>[] = [
    {
      accessorKey: "medication",
      header: "Medication",
    },
    {
      accessorKey: "strength",
      header: "Strength",
    },
    {
      accessorKey: "dosage",
      header: "Dosage",
    },
    {
      accessorKey: "days",
      header: "Days",
    },
    {
      accessorKey: "notes",
      header: "Notes",
    },
  ];
  const data: PatientPrescription[] = [
    {
      id: "1",
      medication: "Amoxicillin",
      strength: "500 mg",
      dosage: "1 tab x 3/day",
      days: 5,
      notes: "After meals",
    },
    {
      id: "2",
      medication: "Amoxicillin",
      strength: "500 mg",
      dosage: "1 tab x 3/day",
      days: 5,
      notes: "After meals",
    },
    {
      id: "3",
      medication: "Amoxicillin",
      strength: "500 mg",
      dosage: "1 tab x 3/day",
      days: 5,
      notes: "After meals",
    },
  ];
  return <MySimpleTable columns={columns} data={data} />;
};
export default MedicalRecordTab;
