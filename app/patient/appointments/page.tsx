"use client";

import { Suspense } from "react";
import { AppointmentListShared } from "@/components/appointment/AppointmentListShared";

export default function PatientAppointmentsPage() {
  return (
    <Suspense fallback={<div className="p-6" />}>
      <AppointmentListShared role="PATIENT" />
    </Suspense>
  );
}
