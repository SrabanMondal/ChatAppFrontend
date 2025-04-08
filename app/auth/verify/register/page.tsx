// components/auth/verify-page.tsx
//"use client";

//import { PageProps } from "@/.next/types/app/layout";
import { VerifyOtpForm } from "@/components/auth/verify-otp-form";
import { AuthLayout } from "@/components/layouts/auth-layout";


export default function page() {
  return (
    <AuthLayout>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Verify your account</h1>
        <p className="text-sm text-muted-foreground">
            "Enter the OTP sent to your email"
        </p>
      </div>
      <VerifyOtpForm flow={"register"} />
    </AuthLayout>
  );
}
