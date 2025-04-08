import type React from "react";
import Link from "next/link";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-zinc-950 text-white">
      
      {/* Left side - Branding */}
      <div className="hidden lg:flex flex-col justify-center items-center p-10 bg-gradient-to-br from-zinc-800 via-zinc-900 to-black text-zinc-100 shadow-xl">
        <div className="flex items-center space-x-3 text-2xl font-semibold">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-8 w-8 text-emerald-400"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span>Chat App</span>
        </div>
      </div>

      {/* Right side - Auth Form */}
      <div className="flex flex-col justify-center items-center px-6 py-12 lg:p-16 bg-zinc-950">
        <div className="w-full max-w-md space-y-6">
          {children}
          <p className="text-sm text-zinc-500 text-center px-6">
            By continuing, you agree to our{" "}
            <Link
              href="/terms"
              className="text-emerald-400 hover:underline underline-offset-4 transition-colors"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="text-emerald-400 hover:underline underline-offset-4 transition-colors"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
