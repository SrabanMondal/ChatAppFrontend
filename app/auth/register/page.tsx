import { RegisterForm } from "@/components/auth/register-form"
import { AuthLayout } from "@/components/layouts/auth-layout"

export default function RegisterPage() {
  return (
    <AuthLayout>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
        <p className="text-sm text-muted-foreground">Enter your details to create your account</p>
      </div>
      <RegisterForm />
    </AuthLayout>
  )
}

