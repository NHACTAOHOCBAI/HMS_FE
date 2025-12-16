"use client";

import { Suspense } from "react";
import { AppointmentListShared } from "@/components/appointment/AppointmentListShared";

export default function DoctorAppointmentsPage() {
  return (
    <Suspense fallback={<div className="p-6" />}>
      <AppointmentListShared role="DOCTOR" />
    </Suspense>
  );
}
