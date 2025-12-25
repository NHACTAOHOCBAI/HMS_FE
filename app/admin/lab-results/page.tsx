"use client";

import { FileText } from "lucide-react";
import { LabResultsList } from "@/components/lab/LabResultsList";

export default function AdminLabResultsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header">
        <h1>
          <FileText className="h-6 w-6 text-teal-500" />
          Quản lý Kết quả Xét nghiệm
        </h1>
        <p>Xem và quản lý tất cả kết quả xét nghiệm trong hệ thống</p>
      </div>

      <LabResultsList
        basePath="/admin/lab-results"
        showPatientColumn={true}
      />
    </div>
  );
}
