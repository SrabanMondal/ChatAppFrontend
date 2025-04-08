import { LoginForm } from "@/components/auth/login-form"
import { AuthLayout } from "@/components/layouts/auth-layout"

export default function LoginPage() {
  return (
    <AuthLayout>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">Enter your credentials to sign in to your account</p>
      </div>
      <LoginForm />
    </AuthLayout>
  )
}

