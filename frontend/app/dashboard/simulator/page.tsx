"use client"

import React from "react"
import { Cpu, Sparkles, SlidersHorizontal } from "lucide-react"
import { SimulatorPanel } from "@/components/dashboard/SimulatorPanel"
import { Badge } from "@/components/ui/badge"

export default function SimulatorPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl border border-slate-200/90 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
            <Cpu className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Smart Counter Allocation Simulator
            </h2>
            <p className="text-xs text-slate-500">
              Interactive mathematical testbed for evaluating counter adjustments before physical deployment
            </p>
          </div>
        </div>

        <Badge variant="outline" className="border-indigo-200 text-indigo-700 bg-indigo-50/60 dark:bg-indigo-950/40">
          <Sparkles className="h-3.5 w-3.5 mr-1 text-indigo-600" />
          Real-Time Mathematical Engine
        </Badge>
      </div>

      {/* Simulator Interface */}
      <SimulatorPanel />
    </div>
  )
}
