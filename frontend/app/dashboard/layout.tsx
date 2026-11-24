"use client"

import React, { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/layout/Sidebar"
import { TopNav } from "@/components/layout/TopNav"
import { AgentFloating } from "@/components/dashboard/AgentFloating"
import { useAuth } from "@/hooks/useAuth"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("queuemind_token")
      if (!token && !user) {
        // Initialize instant demo session so prototype is immediately usable
        localStorage.setItem("queuemind_token", "demo_jwt_token")
        localStorage.setItem("queuemind_user", JSON.stringify({
          id: 1,
          email: "admin@queuemind.ai",
          full_name: "Facility Administrator",
          role: "admin",
          is_active: true
        }))
      }
    }
  }, [user, loading])

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Pane */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopNav />
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="mx-auto max-w-7xl space-y-6">
            {children}
          </div>
        </main>
      </div>

      {/* Floating AI Assistant on all dashboard views */}
      <AgentFloating />
    </div>
  )
}
