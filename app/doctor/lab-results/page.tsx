"use client";

import { FileText } from "lucide-react";
import { LabResultsList } from "@/components/lab/LabResultsList";

export default function DoctorLabResultsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header">
        <h1>
          <FileText className="h-6 w-6 text-teal-500" />
          Kết quả Xét nghiệm
        </h1>
        <p>Xem kết quả xét nghiệm của bệnh nhân</p>
      </div>

      <LabResultsList
        basePath="/doctor/lab-results"
        showPatientColumn={true}
      />
    </div>
  );
}
