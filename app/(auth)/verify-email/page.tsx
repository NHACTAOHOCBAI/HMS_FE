"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Hospital, 
  CheckCircle2, 
  XCircle,
  Loader2,
  ArrowRight,
  ShieldCheck,
  Heart,
  Stethoscope,
  Mail
} from "lucide-react";
import { cn } from "@/lib/utils";
import { authService } from "@/services/auth.service";

type VerificationStatus = "loading" | "success" | "error";

const VerifyEmailPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  
  const [status, setStatus] = useState<VerificationStatus>("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus("error");
        setErrorMessage("Token không hợp lệ hoặc đã hết hạn.");
        return;
      }

      try {
        await authService.verifyEmail(token);
        setStatus("success");
      } catch (error) {
        setStatus("error");
        if (error instanceof Error) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage("Không thể xác thực email. Vui lòng thử lại.");
        }
        console.error("Email verification error:", error);
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-white to-teal-50" />
      
      <div 
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage: `
            radial-gradient(circle at 0% 0%, rgba(56, 189, 248, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 100% 100%, rgba(20, 184, 166, 0.15) 0%, transparent 50%)
          `,
        }}
      />
      
      {/* Floating shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-r from-sky-200/30 to-teal-200/30 blur-3xl" style={{ top: "-10%", left: "-10%" }} />
        <div className="absolute w-[400px] h-[400px] rounded-full bg-gradient-to-r from-teal-200/30 to-emerald-200/30 blur-3xl" style={{ bottom: "-10%", right: "-10%" }} />
        <Heart className="absolute w-6 h-6 text-rose-300/40 animate-pulse" style={{ top: "20%", right: "25%", animationDuration: "2s" }} />
        <Stethoscope className="absolute w-6 h-6 text-sky-300/40 animate-pulse" style={{ bottom: "30%", left: "10%", animationDuration: "2.5s" }} />
      </div>

      <div className="relative z-10 w-full max-w-md flex flex-col items-center gap-8">
        {/* Header */}
        <div className="flex flex-col items-center gap-5">
          <div className="relative group">
            <div className="absolute -inset-2 bg-gradient-to-r from-sky-400/20 via-teal-400/20 to-sky-400/20 rounded-3xl blur-xl opacity-70" />
            <div className={cn(
              "relative rounded-2xl shadow-xl w-16 h-16 flex items-center justify-center",
              status === "success" ? "bg-gradient-to-br from-emerald-500 to-teal-500" :
              status === "error" ? "bg-gradient-to-br from-red-500 to-rose-500" :
              "bg-gradient-to-br from-sky-500 to-teal-500"
            )}>
              <Hospital className="w-9 h-9 text-white drop-shadow" />
            </div>
          </div>
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-teal-600 bg-clip-text text-transparent">
              Hệ thống Quản lý Bệnh viện
            </h1>
            <p className="text-sm text-slate-500">HMS Healthcare Solution</p>
          </div>
        </div>

        {/* Card */}
        <div className="w-full max-w-[420px]">
          <div className="relative">
            <div className={cn(
              "absolute -inset-1 rounded-3xl blur-lg",
              status === "success" ? "bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/10" :
              status === "error" ? "bg-gradient-to-r from-red-500/10 via-rose-500/10 to-red-500/10" :
              "bg-gradient-to-r from-sky-500/10 via-teal-500/10 to-sky-500/10"
            )} />
            
            <div className="relative bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-2xl shadow-xl shadow-slate-200/50 overflow-hidden">
              <div className={cn(
                "h-1",
                status === "success" ? "bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500" :
                status === "error" ? "bg-gradient-to-r from-red-500 via-rose-500 to-red-500" :
                "bg-gradient-to-r from-sky-500 via-teal-500 to-sky-500"
              )} />
              
              <div className="px-8 py-10">
                {status === "loading" && (
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                      <div className="absolute -inset-3 bg-sky-200/50 rounded-full blur-lg animate-pulse" />
                      <div className="relative bg-sky-100 rounded-full p-4">
                        <Loader2 className="w-10 h-10 text-sky-600 animate-spin" />
                      </div>
                    </div>
                    <h2 className="text-lg font-semibold text-slate-800">Đang xác thực email...</h2>
                    <p className="text-sm text-slate-500 text-center">Vui lòng đợi trong giây lát</p>
                  </div>
                )}

                {status === "success" && (
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                      <div className="absolute -inset-3 bg-emerald-200/50 rounded-full blur-lg animate-pulse" />
                      <div className="relative bg-emerald-100 rounded-full p-4 ring-4 ring-emerald-200">
                        <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                      </div>
                    </div>
                    <h2 className="text-lg font-semibold text-slate-800">Xác thực thành công! 🎉</h2>
                    <p className="text-sm text-slate-500 text-center">Email của bạn đã được xác thực. Bạn có thể đăng nhập ngay.</p>
                    
                    <button
                      onClick={() => router.push("/login")}
                      className={cn(
                        "mt-4 w-full h-11 rounded-xl text-sm font-semibold transition-all duration-300 overflow-hidden group/btn",
                        "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600",
                        "text-white shadow-lg shadow-emerald-500/30"
                      )}
                    >
                      <span className="flex items-center justify-center gap-2">
                        Đăng nhập ngay
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </span>
                    </button>
                  </div>
                )}

                {status === "error" && (
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                      <div className="absolute -inset-3 bg-red-200/50 rounded-full blur-lg" />
                      <div className="relative bg-red-100 rounded-full p-4 ring-4 ring-red-200">
                        <XCircle className="w-10 h-10 text-red-600" />
                      </div>
                    </div>
                    <h2 className="text-lg font-semibold text-slate-800">Xác thực thất bại</h2>
                    <p className="text-sm text-red-600 text-center">{errorMessage}</p>
                    
                    <div className="mt-4 w-full space-y-3">
                      <button
                        onClick={() => router.push("/login")}
                        className="w-full h-11 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-sm font-medium rounded-xl transition-all"
                      >
                        Quay lại Đăng nhập
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Security badge */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Bảo mật SSL 256-bit</span>
        </div>
      </div>
    </div>
  );
};

export default function VerifyEmailPageWrapper() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-teal-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
      </div>
    }>
      <VerifyEmailPage />
    </Suspense>
  );
}
