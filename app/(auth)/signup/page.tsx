"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Hospital } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AuthError } from "@/services/auth.service";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import z from "zod";
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
import { useSignup } from "@/hooks/queries/useAuth";

// Password regex: 8+ chars, uppercase, lowercase, number, special char
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const signupSchema = z
  .object({
    // Username field commented out - API only requires email and password
    // username: z.string().min(1, "Username is required"),
    email: z
      .string()
      .min(1, "Email is required")
      .email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(
        passwordRegex,
        "Password must contain uppercase, lowercase, number, and special character"
      ),
    confirmPassword: z.string().min(1, "Confirm Password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignUpCredentials = z.infer<typeof signupSchema>;

const SignUpPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { mutate: signup, isPending } = useSignup();

  const form = useForm<SignUpCredentials>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: SignUpCredentials) => {
    signup(
      { email: data.email, password: data.password },
      {
        onSuccess: (response) => {
          // Store tokens in localStorage (returned from auto-login)
          localStorage.setItem("accessToken", response.accessToken);
          localStorage.setItem("refreshToken", response.refreshToken);
          localStorage.setItem("userEmail", response.user.email);
          localStorage.setItem("userRole", response.user.role);
          localStorage.setItem("userId", response.user.id);

          toast.success("Account created successfully! Redirecting...");

          // Redirect to admin dashboard after successful signup
          router.push("/admin");
        },
        onError: (error) => {
          if (error instanceof AuthError) {
            switch (error.code) {
              case "EMAIL_ALREADY_EXISTS":
                toast.error(
                  "This email is already registered. Please login instead."
                );
                break;
              case "VALIDATION_ERROR":
                toast.error(
                  error.details?.[0]?.message ||
                    "Invalid input. Please check your credentials."
                );
                break;
              default:
                toast.error("Failed to create account. Please try again.");
            }
          } else {
            toast.error("An unexpected error occurred. Please try again.");
          }
          console.error("Signup error:", error);
        },
      }
    );
  };

  const handleGoogleSignup = () => {
    // TODO: Implement Google OAuth signup
    console.log("Google signup clicked");
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
            <Hospital className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-base font-normal text-neutral-950 tracking-[-0.3125px] text-center">
            Hospital Management System
          </h1>
        </div>

        {/* Signup Card */}
        <Card className="w-full max-w-[416px] bg-[rgba(255,255,255,0.95)] border border-[rgba(0,0,0,0.1)] rounded-[14px] shadow-sm gap-0 py-0">
          {/* Card Header */}
          <CardHeader className="px-6 pt-6 pb-0">
            <CardTitle className="text-base font-medium text-neutral-950 tracking-[-0.3125px] text-center">
              Welcome
            </CardTitle>
            <CardDescription className="text-base font-normal text-[#717182] tracking-[-0.3125px] text-center">
              Enter your credentials to register
            </CardDescription>
          </CardHeader>

          {/* Card Content - Form */}
          <CardContent className="px-6 py-6">
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
                            autoComplete="new-password"
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

                {/* Confirm Password Field */}
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-neutral-950 tracking-[-0.1504px]">
                        Confirm password
                      </FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            {...field}
                            type={showConfirmPassword ? "text" : "password"}
                            autoComplete="new-password"
                            className="h-9 bg-[#f3f3f5] border-transparent rounded-lg px-3 py-1 pr-10 text-sm tracking-[-0.1504px] placeholder:text-[#717182]"
                            placeholder="Confirm your password"
                            disabled={isPending}
                          />
                        </FormControl>
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          disabled={isPending}
                        >
                          {showConfirmPassword ? (
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
                <Button
                  type="submit"
                  className="w-full h-9 bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium tracking-[-0.1504px] rounded-lg transition-colors duration-200"
                  disabled={isPending}
                >
                  {isPending ? "Creating account..." : "Sign up"}
                </Button>

                {/* Separator with OR */}
                <div className="relative flex items-center justify-center">
                  <Separator className="absolute bg-[rgba(0,0,0,0.1)]" />
                  <div className="relative bg-white px-2">
                    <span className="text-xs text-[#717182] uppercase">or</span>
                  </div>
                </div>

                {/* Google Sign Up Button */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGoogleSignup}
                  className="w-full h-9 bg-white border border-[rgba(0,0,0,0.1)] hover:bg-gray-50 text-neutral-950 text-sm font-medium tracking-[-0.1504px] rounded-lg transition-colors duration-200"
                  disabled={isPending}
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M19.576 10.229c0-.709-.064-1.39-.182-2.045H10v3.868h5.382a4.6 4.6 0 01-1.996 3.018v2.51h3.232c1.891-1.742 2.982-4.305 2.982-7.351z"
                      fill="#4285F4"
                    />
                    <path
                      d="M10 20c2.7 0 4.964-.895 6.618-2.423l-3.232-2.509c-.895.6-2.04.955-3.386.955-2.605 0-4.81-1.76-5.595-4.123H1.064v2.591A9.996 9.996 0 0010 20z"
                      fill="#34A853"
                    />
                    <path
                      d="M4.405 11.9c-.2-.6-.314-1.241-.314-1.9 0-.659.114-1.3.314-1.9V5.509H1.064A9.996 9.996 0 000 10c0 1.614.386 3.14 1.064 4.491L4.405 11.9z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M10 3.977c1.468 0 2.786.505 3.823 1.496l2.868-2.868C14.959.99 12.695 0 10 0 6.09 0 2.71 2.24 1.064 5.509L4.405 8.1C5.19 5.737 7.395 3.977 10 3.977z"
                      fill="#EA4335"
                    />
                  </svg>
                  Sign up with Google
                </Button>
              </form>
            </Form>
          </CardContent>

          {/* Card Footer */}
          <CardFooter className="border-t border-[rgba(0,0,0,0.1)] px-6 py-6 flex items-center justify-center">
            <p className="text-sm text-[#717182] tracking-[-0.1504px] text-center">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-sky-600 hover:text-sky-700"
              >
                Log in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SignUpPage;
