import { SearchUsers } from "@/components/search/search-users"
import { DashboardLayout } from "@/components/layouts/dashboard-layout"

export default function SearchPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-4">
        <h1 className="text-2xl font-bold">Search Users</h1>
        <SearchUsers />
      </div>
    </DashboardLayout>
  )
}

