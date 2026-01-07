"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlertCircle, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

/**
 * This page is disabled for doctors.
 * Doctors typically don't book appointments - this is done by receptionists/admin.
 * The page shows an access denied message and redirects after 3 seconds.
 */
export default function DoctorNewAppointmentPage() {
  const router = useRouter();

  // Auto-redirect after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/doctor/appointments");
    }, 3000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] py-12">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 p-8 text-white text-center max-w-md">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-white rounded-full" />
        </div>
        <div className="relative z-10">
          <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold mb-2">Không có quyền truy cập</h2>
          <p className="text-white/80 mb-6">
            Chức năng đặt lịch hẹn dành cho Lễ tân/Nhân viên quản lý.
            <br />
            Bạn sẽ được chuyển hướng trong vài giây...
          </p>
          <Button
            variant="outline"
            className="bg-white/10 border-white/30 text-white hover:bg-white/20"
            asChild
          >
            <Link href="/doctor/appointments">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại danh sách lịch hẹn
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
