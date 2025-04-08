"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { MessageSquare, Search, User, Menu } from "lucide-react"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const routes = [
    {
      href: "/dashboard",
      label: "Friends",
      icon: MessageSquare,
      active: pathname === "/dashboard",
    },
    {
      href: "/dashboard/search",
      label: "Search",
      icon: Search,
      active: pathname === "/dashboard/search",
    },
    {
      href: "/dashboard/profile",
      label: "Profile",
      icon: User,
      active: pathname === "/dashboard/profile",
    },
  ]

  return (
    <div className="flex min-h-screen bg-zinc-900 text-zinc-100">
      {/* Mobile Navigation */}
      <div className="fixed top-0 z-40 w-full border-b border-zinc-800 bg-zinc-950 px-4 py-2 md:hidden flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg
            className="h-6 w-6 text-cyan-400"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span className="font-semibold text-lg tracking-wide">Chat App</span>
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-zinc-300 hover:text-cyan-400">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[240px] sm:w-[300px] bg-zinc-900 text-zinc-100 border-zinc-800">
            <div className="flex flex-col space-y-4 py-4">
              <div className="px-3 py-2">
                <SheetTitle className="mb-2 px-4 text-lg font-semibold tracking-tight text-cyan-400">Menu</SheetTitle>
                <SheetDescription />
                <div className="space-y-1">
                  {routes.map((route) => (
                    <Button
                      key={route.href}
                      variant={route.active ? "secondary" : "ghost"}
                      className={`w-full justify-start ${
                        route.active ? "bg-cyan-700 text-white hover:bg-cyan-600" : "text-zinc-200"
                      }`}
                      onClick={() => setOpen(false)}
                      asChild
                    >
                      <Link href={route.href}>
                        <route.icon className="mr-2 h-5 w-5" />
                        {route.label}
                      </Link>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex flex-col w-[260px] bg-zinc-950 border-r border-zinc-800 min-h-screen pt-4">
        <div className="flex items-center gap-2 px-4 pb-4 border-b border-zinc-800">
          <svg
            className="h-6 w-6 text-cyan-400"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span className="font-semibold text-lg tracking-wide">Chat App</span>
        </div>
        <nav className="flex flex-col gap-2 px-3 py-4">
          {routes.map((route) => (
            <Button
              key={route.href}
              variant={route.active ? "secondary" : "ghost"}
              className={`justify-start ${
                route.active ? "bg-cyan-700 text-white hover:bg-cyan-600" : "text-zinc-300"
              }`}
              asChild
            >
              <Link href={route.href}>
                <route.icon className="mr-2 h-5 w-5" />
                {route.label}
              </Link>
            </Button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <main className="flex-1 pt-16 md:pt-0 p-4 md:p-6 overflow-y-auto  sm:mt-4">{children}</main>
    </div>
  )
}
