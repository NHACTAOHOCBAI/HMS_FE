"use client";

import { useAppointmentByPatient } from "@/hooks/queries/useAppointment";
import { Appointment } from "@/interfaces/appointment";
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
  <div className="border border-gray-200 rounded-xl p-4 bg-white shadow-xs">
    <h3 className="font-semibold mb-4">{title}</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
  </div>
);

const AppointmentCard = ({ appointment }: { appointment: Appointment }) => (
  <Section
    title={`Appointment • ${formatDateTimeVi(appointment.appointmentTime)}`}
  >
    <Item label="Doctor" value={appointment.doctor.fullName} />
    <Item label="Department" value={appointment.doctor.department} />
    <Item label="Doctor phone" value={appointment.doctor.phoneNumber} />

    <Item label="Type" value={appointment.type} />
    <Item label="Status" value={appointment.status} />

    <Item label="Reason" value={appointment.reason} />
    <Item label="Notes" value={appointment.notes} />

    {appointment.cancelReason && (
      <Item label="Cancel reason" value={appointment.cancelReason} />
    )}

    <Item label="Created at" value={formatDateTimeVi(appointment.createdAt)} />
    <Item label="Updated at" value={formatDateTimeVi(appointment.updatedAt)} />
  </Section>
);

const AppointmentTab = ({ id }: { id: string }) => {
  const { data: appointments, isLoading } = useAppointmentByPatient(id);

  if (isLoading) return <p>Loading appointments...</p>;
  if (!appointments || appointments.length === 0)
    return <p className="text-sm text-gray-500">No appointment history.</p>;

  return (
    <div className="space-y-6">
      {appointments.map((apt: Appointment) => (
        <AppointmentCard key={apt.id} appointment={apt} />
      ))}
    </div>
  );
};

export default AppointmentTab;
