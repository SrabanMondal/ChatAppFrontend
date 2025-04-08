// components/auth/verify-page.tsx
"use client";

import { VerifyOtpForm } from "@/components/auth/verify-otp-form";
import { AuthLayout } from "@/components/layouts/auth-layout";

interface Props {
  flow: string;
}

export default function VerifyPage({ flow }: Props) {
  return (
    <AuthLayout>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Verify your account</h1>
        <p className="text-sm text-muted-foreground">
          {flow === "forgot"
            ? "Enter the OTP and reset your password"
            : "Enter the OTP sent to your email"}
        </p>
      </div>
      <VerifyOtpForm flow={flow} />
    </AuthLayout>
  );
}
