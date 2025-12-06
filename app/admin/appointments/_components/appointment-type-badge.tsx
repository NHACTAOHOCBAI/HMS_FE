"use client";

import { Badge } from "@/components/ui/badge";
import { AppointmentType } from "@/interfaces/appointment";
import { Stethoscope, RefreshCcw, Siren } from "lucide-react";

const typeConfig: Record<
  AppointmentType,
  { label: string; className: string; icon: React.ReactNode }
> = {
  CONSULTATION: {
    label: "Consultation",
    className: "bg-purple-100 text-purple-800",
    icon: <Stethoscope className="h-3 w-3" />,
  },
  FOLLOW_UP: {
    label: "Follow-up",
    className: "bg-cyan-100 text-cyan-800",
    icon: <RefreshCcw className="h-3 w-3" />,
  },
  EMERGENCY: {
    label: "Emergency",
    className: "bg-orange-100 text-orange-800",
    icon: <Siren className="h-3 w-3" />,
  },
};

interface AppointmentTypeBadgeProps {
  type: AppointmentType;
}

export function AppointmentTypeBadge({ type }: AppointmentTypeBadgeProps) {
  const config = typeConfig[type];

  return (
    <Badge variant="outline" className={`gap-1 ${config.className}`}>
      {config.icon}
      {config.label}
    </Badge>
  );
}
