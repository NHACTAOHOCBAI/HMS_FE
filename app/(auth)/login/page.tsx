"use client";

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
});

export type LoginCredentials = z.infer<typeof loginSchema>;

const LoginPage = () => {
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
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
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
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
