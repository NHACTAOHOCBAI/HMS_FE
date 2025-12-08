"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useAppointmentById } from "@/hooks/queries/useAppointment";
import {
  statusColor,
  typeColor,
} from "@/app/admin/appointments/appointment-list/columns";
import { formatDateTimeVi } from "@/lib/utils";

/* ================= Reusable UI ================= */

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
  <div className="border border-gray-200 rounded-xl p-4 bg-white shadow-xs">
    <h3 className="font-semibold mb-4">{title}</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
  </div>
);

/* ================= Appointment Detail ================= */

interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  appointmentId: string | null;
}

export default function AppointmentDetailDialog({
  open,
  setOpen,
  appointmentId,
}: Props) {
  const { data: appointment, isLoading } = useAppointmentById(
    appointmentId || ""
  );

  if (isLoading) return null;
  if (!appointment) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto ">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            Appointment Detail
            <Badge
              className={`text-white ${
                statusColor[appointment.status] || "bg-gray-500"
              }`}
            >
              {appointment.status}
            </Badge>
            <Badge
              className={`text-white ${
                typeColor[appointment.type] || "bg-gray-500"
              }`}
            >
              {appointment.type}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* ================= Patient ================= */}
          <Section title="Patient Information">
            <Item label="Full name" value={appointment.patient.fullName} />
            <Item
              label="Phone number"
              value={appointment.patient.phoneNumber}
            />
          </Section>

          {/* ================= Doctor ================= */}
          <Section title="Doctor Information">
            <Item label="Doctor name" value={appointment.doctor.fullName} />
            <Item label="Department" value={appointment.doctor.department} />
            <Item label="Phone number" value={appointment.doctor.phoneNumber} />
          </Section>

          {/* ================= Appointment ================= */}
          <Section title="Appointment Information">
            <Item
              label="Appointment time"
              value={formatDateTimeVi(appointment.appointmentTime)}
            />
            <Item label="Reason" value={appointment.reason} />
            <Item label="Notes" value={appointment.notes} />

            {appointment.status === "CANCELLED" && (
              <>
                <Item label="Cancelled at" value={appointment.cancelledAt} />
                <Item label="Cancel reason" value={appointment.cancelReason} />
              </>
            )}
          </Section>

          {/* ================= System ================= */}
          <Section title="System Information">
            <Item
              label="Created at"
              value={formatDateTimeVi(appointment.createdAt)}
            />
            <Item
              label="Updated at"
              value={formatDateTimeVi(appointment.updatedAt)}
            />
            <Item label="Updated by" value={appointment.updatedBy} />
          </Section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
