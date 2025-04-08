import { redirect } from "next/navigation"

export default function Home() {
  // In a real app, check if user is authenticated
  // If not, redirect to login page
  redirect("/auth/login")

  return null
}

