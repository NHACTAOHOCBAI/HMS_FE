"use client";

<<<<<<< HEAD
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Hotel } from "lucide-react";
import { Input } from "@/components/ui/input";
import { AuthError } from "@/services/auth.service";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useLogin } from "@/hooks/queries/useAuth";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
=======
import { useState, FormEvent } from "react";
import { 
  Eye, 
  EyeOff, 
  Hospital, 
  Mail, 
  Lock, 
  Loader2, 
  ArrowRight,
  ShieldCheck,
  Heart,
  Stethoscope
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { TestAccounts } from "./_components/test-accounts";
import { USE_MOCK } from "@/lib/mocks/toggle";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

export const loginSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  password: z.string().min(6, "Password must be at least 6 characters"),
>>>>>>> repoB/master
});

export type LoginCredentials = z.infer<typeof loginSchema>;

const LoginPage = () => {
<<<<<<< HEAD
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const { mutate: login, isPending } = useLogin();

  const form = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginCredentials) => {
    login(data, {
      onSuccess: (response) => {
        // Store tokens in localStorage
        localStorage.setItem("accessToken", response.accessToken);
        localStorage.setItem("refreshToken", response.refreshToken);
        localStorage.setItem("userEmail", response.user.email);
        localStorage.setItem("userRole", response.user.role);
        localStorage.setItem("userId", response.user.id);

        toast.success("Login successful! Redirecting...");

        // Redirect to admin dashboard
        router.push("/admin");
      },
      onError: (error) => {
        if (error instanceof AuthError) {
          switch (error.code) {
            case "INVALID_CREDENTIALS":
              toast.error("Wrong email or password. Please try again.");
              break;
            case "VALIDATION_ERROR":
              toast.error(
                error.details?.[0]?.message ||
                  "Invalid input. Please check your credentials."
              );
              break;
            default:
              toast.error("Login failed. Please try again.");
          }
        } else {
          toast.error("An unexpected error occurred. Please try again.");
        }
        console.error("Login error:", error);
      },
    });
=======
  const { login } = useAuth();
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);
    try {
      await login(credentials.email, credentials.password);
    } catch (error) {
      setErrorMessage("Email hoặc mật khẩu không đúng. Vui lòng thử lại.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
>>>>>>> repoB/master
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
<<<<<<< HEAD
      {/* Background with gradients */}
      <div className="absolute inset-0 bg-white" />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 30%, rgba(125, 211, 252, 1) 0%, rgba(94, 158, 189, 0.75) 12.5%, rgba(63, 106, 126, 0.5) 25%, rgba(31, 53, 63, 0.25) 37.5%, rgba(0, 0, 0, 0) 50%), radial-gradient(circle at 80% 70%, rgba(20, 184, 166, 1) 0%, rgba(15, 138, 125, 0.75) 12.5%, rgba(10, 92, 83, 0.5) 25%, rgba(5, 46, 42, 0.25) 37.5%, rgba(0, 0, 0, 0) 50%)`,
        }}
      />

      {/* Main content container */}
      <div className="relative z-10 w-full max-w-md flex flex-col items-center gap-5">
        {/* Header with icon and title */}
        <div className="flex flex-col items-center gap-4">
          <div className="bg-sky-600 rounded-3xl shadow-[0px_1px_4px_0px_rgba(0,0,0,0.15)] w-14 h-14 flex items-center justify-center">
            <Hotel className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-base font-normal text-neutral-950 tracking-[-0.3125px] text-center">
            Hospital Management System
          </h1>
        </div>

        {/* Login Card */}
        <div className="w-full max-w-[416px] bg-[rgba(255,255,255,0.95)] border border-[rgba(0,0,0,0.1)] rounded-[14px] shadow-sm">
          {/* Card Header */}
          <div className="px-6 pt-6 pb-0">
            <h2 className="text-base font-medium text-neutral-950 tracking-[-0.3125px] text-center mb-1.5">
              Welcome Back
            </h2>
            <p className="text-base font-normal text-[#717182] tracking-[-0.3125px] text-center">
              Enter your credentials to access the system
            </p>
          </div>

          {/* Card Content - Form */}
          <div className="px-6 py-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {/* Email Field */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-neutral-950 tracking-[-0.1504px]">
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          autoComplete="email"
                          className="h-9 bg-[#f3f3f5] border-transparent rounded-lg px-3 py-1 text-sm tracking-[-0.1504px] placeholder:text-[#717182]"
                          placeholder="Enter your email"
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password Field */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-neutral-950 tracking-[-0.1504px]">
                        Password
                      </FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            autoComplete="current-password"
                            className="h-9 bg-[#f3f3f5] border-transparent rounded-lg px-3 py-1 pr-10 text-sm tracking-[-0.1504px] placeholder:text-[#717182]"
                            placeholder="Enter your password"
                            disabled={isPending}
                          />
                        </FormControl>
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          disabled={isPending}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-[#717182] hover:text-neutral-950" />
                          ) : (
                            <Eye className="h-4 w-4 text-[#717182] hover:text-neutral-950" />
                          )}
                        </button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full h-9 bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium tracking-[-0.1504px] rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isPending}
                >
                  {isPending ? "Logging in..." : "Login"}
                </button>
              </form>
            </Form>
          </div>

          {/* Card Footer */}
          <div className="border-t border-[rgba(0,0,0,0.1)] px-6 py-6 flex flex-col items-center gap-3">
            <a
              href="/password-reset/confirm-email"
              className="text-sm font-medium text-sky-600 hover:text-sky-700 tracking-[-0.1504px]"
            >
              Forgot password?
            </a>
            <p className="text-sm text-[#717182] tracking-[-0.1504px] text-center">
              Don&apos;t have an account?
              <a
                href="/signup"
                className="ml-1 font-medium text-sky-600 hover:text-sky-700"
              >
                Sign up
              </a>
            </p>
          </div>
=======
      {/* Bright gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-white to-teal-50" />
      
      {/* Soft colorful gradient overlay */}
      <div 
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage: `
            radial-gradient(circle at 0% 0%, rgba(56, 189, 248, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 100% 100%, rgba(20, 184, 166, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(125, 211, 252, 0.1) 0%, transparent 60%)
          `,
        }}
      />
      
      {/* Floating decorative shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large soft circles */}
        <div 
          className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-r from-sky-200/30 to-teal-200/30 blur-3xl"
          style={{ top: "-10%", left: "-10%" }}
        />
        <div 
          className="absolute w-[400px] h-[400px] rounded-full bg-gradient-to-r from-teal-200/30 to-emerald-200/30 blur-3xl"
          style={{ bottom: "-10%", right: "-10%" }}
        />
        {/* Small floating dots */}
        <div className="absolute w-3 h-3 rounded-full bg-sky-400/30 animate-bounce" style={{ top: "15%", left: "8%", animationDuration: "3s" }} />
        <div className="absolute w-2 h-2 rounded-full bg-teal-400/30 animate-bounce" style={{ top: "60%", left: "15%", animationDuration: "4s", animationDelay: "0.5s" }} />
        <div className="absolute w-4 h-4 rounded-full bg-emerald-400/20 animate-bounce" style={{ top: "25%", right: "12%", animationDuration: "3.5s", animationDelay: "1s" }} />
        <div className="absolute w-2 h-2 rounded-full bg-sky-400/30 animate-bounce" style={{ bottom: "25%", right: "20%", animationDuration: "4.5s", animationDelay: "0.7s" }} />
        {/* Medical icons floating */}
        <Heart className="absolute w-6 h-6 text-rose-300/40 animate-pulse" style={{ top: "20%", right: "25%", animationDuration: "2s" }} />
        <Stethoscope className="absolute w-6 h-6 text-sky-300/40 animate-pulse" style={{ bottom: "30%", left: "10%", animationDuration: "2.5s", animationDelay: "0.5s" }} />
      </div>

      {/* Main content container */}
      <div className="relative z-10 w-full max-w-md flex flex-col items-center gap-8">
        {/* Header with logo */}
        <div className="flex flex-col items-center gap-5">
          {/* Logo with soft shadow */}
          <div className="relative group">
            <div className="absolute -inset-2 bg-gradient-to-r from-sky-400/20 via-teal-400/20 to-sky-400/20 rounded-3xl blur-xl opacity-70 group-hover:opacity-100 transition duration-500" />
            <div className="relative bg-gradient-to-br from-sky-500 to-teal-500 rounded-2xl shadow-xl shadow-sky-500/20 w-16 h-16 flex items-center justify-center">
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

        {/* Clean modern Login Card */}
        <div className="w-full max-w-[420px]">
          <div className="relative">
            {/* Card shadow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-sky-500/10 via-teal-500/10 to-sky-500/10 rounded-3xl blur-lg" />
            
            <div className="relative bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-2xl shadow-xl shadow-slate-200/50 overflow-hidden">
              {/* Top accent line */}
              <div className="h-1 bg-gradient-to-r from-sky-500 via-teal-500 to-emerald-500" />
              
              {/* Card Header */}
              <div className="px-8 pt-8 pb-4 text-center">
                <h2 className="text-xl font-semibold text-slate-800 mb-2">
                  Chào mừng trở lại! 👋
                </h2>
                <p className="text-sm text-slate-500">
                  Nhập thông tin đăng nhập để truy cập hệ thống
                </p>
              </div>

              {/* Card Content - Form */}
              <div className="px-8 py-6">
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Error Message */}
                  {errorMessage && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm flex items-start gap-3 animate-in slide-in-from-top-2">
                      <span className="shrink-0 mt-0.5">⚠️</span>
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Email Field */}
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="flex items-center gap-2 text-sm font-medium text-slate-700"
                    >
                      <Mail className="w-4 h-4 text-sky-500" />
                      Email
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={credentials.email}
                      onChange={(e) =>
                        setCredentials({
                          ...credentials,
                          email: e.target.value,
                        })
                      }
                      className="h-12 bg-slate-50 border-slate-200 rounded-xl px-4 text-slate-800 placeholder:text-slate-400 focus:border-sky-500 focus:ring-sky-500/20 transition-all duration-300"
                      placeholder="Nhập địa chỉ email"
                      disabled={isLoading}
                    />
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <label
                      htmlFor="password"
                      className="flex items-center gap-2 text-sm font-medium text-slate-700"
                    >
                      <Lock className="w-4 h-4 text-teal-500" />
                      Mật khẩu
                    </label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        required
                        value={credentials.password}
                        onChange={(e) =>
                          setCredentials({
                            ...credentials,
                            password: e.target.value,
                          })
                        }
                        className="h-12 bg-slate-50 border-slate-200 rounded-xl px-4 pr-12 text-slate-800 placeholder:text-slate-400 focus:border-sky-500 focus:ring-sky-500/20 transition-all duration-300"
                        placeholder="Nhập mật khẩu"
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                        disabled={isLoading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={cn(
                      "relative w-full h-12 rounded-xl text-sm font-semibold transition-all duration-300 overflow-hidden group/btn",
                      "bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600",
                      "text-white shadow-lg shadow-sky-500/30 hover:shadow-sky-500/40",
                      "disabled:opacity-50 disabled:cursor-not-allowed"
                    )}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Đang đăng nhập...
                        </>
                      ) : (
                        <>
                          Đăng nhập
                          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                        </>
                      )}
                    </span>
                    {/* Button shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                  </button>
                </form>
              </div>

              {/* Card Footer */}
              <div className="border-t border-slate-100 px-8 py-5 bg-slate-50/50">
                <div className="flex flex-col items-center gap-3">
                  <a
                    href="/password-reset/confirm-email"
                    className="text-sm font-medium text-sky-600 hover:text-sky-700 transition-colors"
                  >
                    Quên mật khẩu?
                  </a>
                  <p className="text-sm text-slate-500 text-center">
                    Chưa có tài khoản?{" "}
                    <a
                      href="/signup"
                      className="font-medium text-sky-600 hover:text-sky-700 transition-colors"
                    >
                      Đăng ký ngay
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Test Accounts - Only in Mock Mode */}
        {USE_MOCK && (
          <div className="w-full max-w-[420px]">
            <TestAccounts />
          </div>
        )}

        {/* Security badge */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Bảo mật SSL 256-bit</span>
>>>>>>> repoB/master
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
