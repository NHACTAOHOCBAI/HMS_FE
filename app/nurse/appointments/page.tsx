"use client";

import { Suspense } from "react";
import { AppointmentListShared } from "@/components/appointment/AppointmentListShared";

export default function NurseAppointmentsPage() {
  return (
    <Suspense fallback={<div className="p-6" />}>
      <AppointmentListShared role="NURSE" />
    </Suspense>
  );
}
