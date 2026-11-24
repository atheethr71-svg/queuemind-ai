"use client"

import React from "react"
import { Users, Gauge, CheckCircle2, ShieldCheck, Tag } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface DetectionResultProps {
  peopleCount: number
  densityLevel: string
  confidence: number
  modelUsed?: string
  isDemo?: boolean
  timestamp?: string
}

export function DetectionResult({
  peopleCount,
  densityLevel,
  confidence,
  modelUsed = "yolov8n",
  isDemo = true,
  timestamp
}: DetectionResultProps) {
  const getDensityBadge = (density: string) => {
    const d = density.toLowerCase()
    if (d === "critical") return <Badge variant="destructive">Critical Crowd</Badge>
    if (d === "high") return <Badge variant="warning">High Density</Badge>
    if (d === "moderate") return <Badge variant="secondary">Moderate</Badge>
    return <Badge variant="success">Low / Normal</Badge>
  }

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <h4 className="text-base font-bold text-slate-900 dark:text-white">
          Inference & Density Analysis
        </h4>
        {isDemo && (
          <Badge variant="outline" className="text-indigo-600 border-indigo-200 bg-indigo-50/50">
            Demo Sensor Mode
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* People Count */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
            <Users className="h-4 w-4 text-indigo-500" />
            <span>People Count</span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {peopleCount} <span className="text-xs font-normal text-slate-400">detected</span>
          </div>
        </div>

        {/* Density Level */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
            <Gauge className="h-4 w-4 text-violet-500" />
            <span>Crowd Density</span>
          </div>
          <div className="mt-1">
            {getDensityBadge(densityLevel)}
          </div>
        </div>

        {/* Confidence */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span>Confidence</span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {Math.round(confidence * 100)}%
          </div>
        </div>

        {/* Model & Privacy */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
            <ShieldCheck className="h-4 w-4 text-blue-500" />
            <span>Privacy Guard</span>
          </div>
          <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            {modelUsed} (No Face ID)
          </div>
        </div>
      </div>
    </div>
  )
}
