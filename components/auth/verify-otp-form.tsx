"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { verifyOtp, forgotPassword, resetPassword } from "@/lib/apis/user";

interface Props {
  flow: string
}

export function VerifyOtpForm({ flow }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(flow === "register" ? 2 : 1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (flow === "register") {
        if (otp.length < 6) {
          setError("OTP must be at least 6 characters.");
          return;
        }

        const response = await verifyOtp(otp);
        if (response) {
          router.push("/auth/login");
        } else {
          setError("Invalid OTP");
        }
      } else {
        if (step === 1) {
          if (!email.includes("@")) {
            setError("Enter a valid email.");
            return;
          }

          const res = await forgotPassword(email);
          if (res) {
            setStep(2); // Go to step 2
          } else {
            setError(res.message || "Failed to send OTP.");
          }
        } else {
          if (otp.length < 6) {
            setError("OTP must be at least 6 characters.");
            return;
          }
          if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
          }
          if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
          }

          const res = await resetPassword(otp, password);
          if (res) {
            router.push("/auth/login?reset=success");
          } else {
            setError(res.message || "Invalid OTP or failed to reset password");
          }
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-6">
      {error && <div className="text-red-500">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Step 1: Email input (only for forgot flow) */}
        {flow === "forgot" && step === 1 && (
          <div>
            <label>Email</label>
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        )}

        {/* Step 2: OTP and password inputs */}
        {((flow === "register") || (flow === "forgot" && step === 2)) && (
          <>
            <div>
              <label>OTP</label>
              <Input
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
            {flow === "forgot" && (
              <>
                <div>
                  <label>New Password</label>
                  <Input
                    type="password"
                    placeholder="********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div>
                  <label>Confirm Password</label>
                  <Input
                    type="password"
                    placeholder="********"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </>
            )}
          </>
        )}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading
            ? "Processing..."
            : flow === "register"
            ? "Verify OTP"
            : step === 1
            ? "Send OTP"
            : "Reset Password"}
        </Button>
      </form>
    </div>
  );
}
