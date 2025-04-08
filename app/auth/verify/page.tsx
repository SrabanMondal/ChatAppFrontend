"use client"
import { useSearchParams } from "next/navigation";
import {VerifyOtpForm } from "@/components/auth/verify-otp-form";
import { AuthLayout } from "@/components/layouts/auth-layout";

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const flow = searchParams.get("flow") || "register" // fallback to register

  return (
    <AuthLayout>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Verify your account</h1>
        <p className="text-sm text-muted-foreground">
          {flow === "forgot" ? "Enter the OTP and reset your password" : "Enter the OTP sent to your email"}
        </p>
      </div>
      <VerifyOtpForm flow={flow} />
    </AuthLayout>
  );
}
