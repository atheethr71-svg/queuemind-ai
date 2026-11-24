"use client"

import React, { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import Link from "next/link"
import {
  Sun,
  Moon,
  Bell,
  Sparkles,
  Radio,
  MapPin,
  CheckCircle2,
  ChevronDown
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/useAuth"
import { apiClient } from "@/lib/api"

export function TopNav() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const { user } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [alertCount, setAlertCount] = useState(2)
  const [locations, setLocations] = useState<any[]>([])
  const [selectedLoc, setSelectedLoc] = useState<string>("All Locations")

  useEffect(() => {
    setMounted(true)
    apiClient.get("/locations").then((res) => {
      if (res.data) setLocations(res.data)
    }).catch(() => {
      setLocations([
        { id: 1, name: "OPD Registration Desk" },
        { id: 2, name: "Central Pharmacy" },
        { id: 3, name: "Main Meal Counter" },
      ])
    })
  }, [])

  const getPageTitle = () => {
    if (pathname.includes("/overview")) return "Executive Overview"
    if (pathname.includes("/monitor")) return "Live Queue Monitor"
    if (pathname.includes("/detection")) return "Computer Vision Detection"
    if (pathname.includes("/predictions")) return "Waiting-Time Prediction Engine"
    if (pathname.includes("/counters")) return "Counter Allocation Management"
    if (pathname.includes("/simulator")) return "Smart Counter Allocation Simulator"
    if (pathname.includes("/agent")) return "AI Browser Operations Agent"
    if (pathname.includes("/alerts")) return "Congestion Alerts & Incidents"
    if (pathname.includes("/analytics")) return "Performance & Historical Analytics"
    if (pathname.includes("/locations")) return "Facility & Location Hierarchy"
    if (pathname.includes("/settings")) return "System Settings & Thresholds"
    return "Operations Dashboard"
  }

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/95 px-6 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
      {/* Page Title & Breadcrumb */}
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-bold text-slate-900 dark:text-white">
          {getPageTitle()}
        </h1>
      </div>

      {/* Center/Right Actions */}
      <div className="flex items-center gap-3">
        {/* Demo Mode Badge */}
        <div className="flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
          </span>
          <span className="font-medium">Active Simulation Mode</span>
        </div>

        {/* Location Filter Dropdown */}
        <div className="hidden md:flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-1.5 text-xs text-slate-700 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-300">
          <MapPin className="h-3.5 w-3.5 text-indigo-500" />
          <select
            className="bg-transparent font-medium focus:outline-none cursor-pointer"
            value={selectedLoc}
            onChange={(e) => setSelectedLoc(e.target.value)}
          >
            <option value="All Locations">All Facilities (Consolidated)</option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.name}>
                {loc.name}
              </option>
            ))}
          </select>
        </div>

        {/* Theme Toggle */}
        {mounted && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-xl text-slate-600 dark:text-slate-300"
            title="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        )}

        {/* Notification Bell */}
        <Link href="/dashboard/alerts">
          <Button
            variant="ghost"
            size="icon"
            className="relative rounded-xl text-slate-600 dark:text-slate-300"
            title="Alerts"
          >
            <Bell className="h-4 w-4" />
            {alertCount > 0 && (
              <span className="absolute right-2 top-2 flex h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900" />
            )}
          </Button>
        </Link>

        {/* User initials pill */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-xs font-bold text-white shadow-sm shadow-indigo-500/20">
            {user?.full_name ? user.full_name[0].toUpperCase() : "A"}
          </div>
          <div className="hidden lg:flex flex-col">
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              {user?.full_name || "Admin"}
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
