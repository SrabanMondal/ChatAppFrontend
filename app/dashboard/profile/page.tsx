import { ProfileForm } from "@/components/profile/profile-form"
import { DashboardLayout } from "@/components/layouts/dashboard-layout"

export default function ProfilePage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-4">
        <h1 className="text-2xl font-bold">Your Profile</h1>
        <ProfileForm />
      </div>
    </DashboardLayout>
  )
}

