"use client"

import React, { useState, useEffect } from "react"
import {
  BarChart3,
  Download,
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle2,
  Users
} from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PeakHoursChart } from "@/components/dashboard/PeakHoursChart"
import { AnalyticsChart } from "@/components/dashboard/AnalyticsChart"
import { apiClient } from "@/lib/api"

export default function AnalyticsPage() {
  const [trends, setTrends] = useState<any>({
    dates: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    queue_lengths: [18, 24, 21, 28, 32, 19, 14],
    waiting_times: [11.2, 14.5, 12.8, 17.0, 19.4, 12.0, 9.5]
  })
  const [peakHours, setPeakHours] = useState<any[]>([
    { hour: 8, avg_queue_length: 15, total_served: 45 },
    { hour: 9, avg_queue_length: 22, total_served: 78 },
    { hour: 10, avg_queue_length: 18, total_served: 65 },
    { hour: 11, avg_queue_length: 12, total_served: 50 },
    { hour: 12, avg_queue_length: 34, total_served: 115 },
    { hour: 13, avg_queue_length: 31, total_served: 98 },
    { hour: 14, avg_queue_length: 16, total_served: 58 },
    { hour: 17, avg_queue_length: 26, total_served: 84 },
    { hour: 18, avg_queue_length: 21, total_served: 70 },
  ])

  useEffect(() => {
    apiClient.get("/dashboard/trends").then((res) => {
      if (res.data) setTrends(res.data)
    }).catch(() => {})

    apiClient.get("/analytics/peak-hours").then((res) => {
      if (res.data?.hourly_data) setPeakHours(res.data.hourly_data)
    }).catch(() => {})
  }, [])

  const handleExportCSV = () => {
    window.open("/api/v1/analytics/export", "_blank")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl border border-slate-200/90 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
            <BarChart3 className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Queue Intelligence & Performance Analytics
            </h2>
            <p className="text-xs text-slate-500">
              Aggregated historical wait trends, hourly congestion curves, and operational audit reports
            </p>
          </div>
        </div>

        <Button onClick={handleExportCSV} variant="gradient" className="rounded-xl gap-2 text-xs">
          <Download className="h-4 w-4" />
          Export CSV Report
        </Button>
      </div>

      {/* Two Column Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Peak Congestion Curve */}
        <Card className="rounded-2xl border-slate-200/90 dark:border-slate-800 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold">Hourly Congestion Pattern</CardTitle>
              <Badge variant="outline" className="text-xs">Peak: 12:00 - 14:00</Badge>
            </div>
            <CardDescription className="text-xs">
              Average queue size across 24-hour daily timeline
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PeakHoursChart data={peakHours} />
          </CardContent>
        </Card>

        {/* 7-Day Wait Time & Queue Trend */}
        <Card className="rounded-2xl border-slate-200/90 dark:border-slate-800 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold">7-Day Wait Time vs Volume</CardTitle>
              <Badge variant="outline" className="text-xs">Weekly Trajectory</Badge>
            </div>
            <CardDescription className="text-xs">
              Tracking wait reduction after adaptive counter allocation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AnalyticsChart
              dates={trends.dates || []}
              queueLengths={trends.queue_lengths || []}
              waitingTimes={trends.waiting_times || []}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
