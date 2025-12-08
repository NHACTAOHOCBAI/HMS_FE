"use client";

import { useMedicalExamByPatient } from "@/hooks/queries/useMedicalExam";

/* ================= Reusable ================= */

const Item = ({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) => (
  <div>
    <p className="text-xs text-gray-400">{label}</p>
    <p className="text-sm font-medium">{value ?? "---"}</p>
  </div>
);

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div>
    <h4 className="font-semibold mb-2">{title}</h4>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
  </div>
);

/* ================= Main ================= */

const MedicalRecordTab = ({ id }: { id: string }) => {
  const { data: exams, isLoading } = useMedicalExamByPatient({ id });

  if (isLoading) return <p>Loading medical records...</p>;

  if (!exams || exams.length === 0) {
    return <p className="text-gray-500">No medical records available.</p>;
  }

  // ✅ Sort newest first (VERY important)
  const sortedExams = [...exams].sort(
    (a, b) => new Date(b.examDate).getTime() - new Date(a.examDate).getTime()
  );

  return (
    <div className="space-y-6">
      {sortedExams.map((exam, index) => (
        <div
          key={exam.id}
          className="border border-gray-200 rounded-xl p-5 bg-white space-y-5"
        >
          {/* ===== Header ===== */}
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-base">
                Medical Exam #{sortedExams.length - index}
              </h3>
              <p className="text-xs text-gray-400">
                Exam date: {exam.examDate}
              </p>
            </div>

            {/* Optional status badge later */}
          </div>

          {/* ===== Doctor & Appointment ===== */}
          <Section title="Appointment">
            <Item
              label="Appointment time"
              value={exam.appointment.appointmentTime}
            />
            <Item label="Doctor" value={exam.doctor.fullName} />
          </Section>

          {/* ===== Diagnosis ===== */}
          <Section title="Diagnosis">
            <Item label="Diagnosis" value={exam.diagnosis} />
            <Item label="Symptoms" value={exam.symptoms} />
            <Item label="Treatment" value={exam.treatment} />
            <Item label="Notes" value={exam.notes} />
          </Section>

          {/* ===== Vitals ===== */}
          <Section title="Vital Signs">
            <Item label="Temperature (°C)" value={exam.vitals.temperature} />
            <Item
              label="Blood Pressure"
              value={`${exam.vitals.bloodPressureSystolic}/${exam.vitals.bloodPressureDiastolic}`}
            />
            <Item label="Heart Rate (bpm)" value={exam.vitals.heartRate} />
            <Item label="Weight (kg)" value={exam.vitals.weight} />
            <Item label="Height (cm)" value={exam.vitals.height} />
          </Section>
        </div>
      ))}
    </div>
  );
};

export default MedicalRecordTab;
