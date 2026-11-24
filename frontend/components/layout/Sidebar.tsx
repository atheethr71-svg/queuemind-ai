"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Activity,
  Camera,
  Timer,
  Sliders,
  Cpu,
  Bot,
  Bell,
  BarChart3,
  MapPin,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sparkles,
  ShieldCheck
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/useAuth"

const NAV_ITEMS = [
  {
    category: "MAIN",
    items: [
      { name: "Overview", href: "/dashboard/overview", icon: LayoutDashboard },
      { name: "Live Monitor", href: "/dashboard/monitor", icon: Activity, badge: "Live" },
    ]
  },
  {
    category: "AI & VISION",
    items: [
      { name: "Crowd Detection", href: "/dashboard/detection", icon: Camera },
      { name: "Wait Time Predictor", href: "/dashboard/predictions", icon: Timer },
    ]
  },
  {
    category: "OPERATIONS",
    items: [
      { name: "Counter Management", href: "/dashboard/counters", icon: Sliders },
      { name: "Allocation Simulator", href: "/dashboard/simulator", icon: Cpu, badge: "Smart" },
      { name: "Locations", href: "/dashboard/locations", icon: MapPin },
    ]
  },
  {
    category: "INTELLIGENCE",
    items: [
      { name: "AI Operations Agent", href: "/dashboard/agent", icon: Bot, badge: "AI" },
      { name: "Congestion Alerts", href: "/dashboard/alerts", icon: Bell },
      { name: "Analytics & Reports", href: "/dashboard/analytics", icon: BarChart3 },
    ]
  },
  {
    category: "SYSTEM",
    items: [
      { name: "Settings & Config", href: "/dashboard/settings", icon: Settings },
    ]
  }
]

export function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        "relative flex flex-col border-r border-slate-200/80 bg-white transition-all duration-300 dark:border-slate-800 dark:bg-slate-900/95 z-30",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-slate-100 dark:border-slate-800">
        <Link href="/dashboard/overview" className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-violet-600 text-white shadow-md shadow-indigo-600/30">
            <Sparkles className="h-5 w-5" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-bold tracking-tight text-slate-900 dark:text-white text-base leading-tight">
                QueueMind <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">AI</span>
              </span>
              <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                Predictive System
              </span>
            </div>
          )}
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300 transition-colors"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {NAV_ITEMS.map((section) => (
          <div key={section.category} className="space-y-1">
            {!collapsed && (
              <h4 className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {section.category}
              </h4>
            )}
            {section.items.map((item) => {
              const active = pathname === item.href
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                    active
                      ? "bg-indigo-50 text-indigo-700 font-semibold shadow-sm shadow-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-300 dark:shadow-none"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-100"
                  )}
                  title={collapsed ? item.name : undefined}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5 shrink-0 transition-colors",
                      active
                        ? "text-indigo-600 dark:text-indigo-400"
                        : "text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300"
                    )}
                  />
                  {!collapsed && (
                    <div className="flex flex-1 items-center justify-between overflow-hidden">
                      <span className="truncate">{item.name}</span>
                      {item.badge && (
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                            item.badge === "Live"
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 animate-pulse"
                              : item.badge === "AI"
                              ? "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300"
                              : "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </Link>
              )
            })}
          </div>
        ))}
      </div>

      {/* User Footer */}
      <div className="border-t border-slate-100 dark:border-slate-800 p-3">
        <div className={cn("flex items-center gap-3 rounded-xl p-2 bg-slate-50 dark:bg-slate-800/50", collapsed && "justify-center")}>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-600/10 text-indigo-600 font-bold text-sm dark:bg-indigo-400/10 dark:text-indigo-400">
            {user?.full_name ? user.full_name[0].toUpperCase() : "A"}
          </div>
          {!collapsed && (
            <div className="flex flex-1 flex-col overflow-hidden">
              <span className="truncate text-xs font-semibold text-slate-800 dark:text-slate-200">
                {user?.full_name || "Admin User"}
              </span>
              <span className="truncate text-[10px] text-slate-400 capitalize">
                {user?.role || "Facility Admin"}
              </span>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={() => logout()}
              className="text-slate-400 hover:text-red-500 transition-colors p-1"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  )
}
