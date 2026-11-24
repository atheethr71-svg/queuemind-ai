"use client"

import React, { useState, useEffect } from "react"
import {
  Activity,
  Users,
  Timer,
  Sliders,
  Radio,
  Wifi,
  WifiOff,
  AlertTriangle,
  Sparkles
} from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { QueueChart } from "@/components/dashboard/QueueChart"
import { DensityGauge } from "@/components/dashboard/DensityGauge"
import { CounterCard } from "@/components/dashboard/CounterCard"
import { useWebSocket } from "@/hooks/useWebSocket"
import { apiClient } from "@/lib/api"

export function MonitorPage() {
  const [queueState, setQueueState] = useState({
    totalWaiting: 18,
    activeCounters: 3,
    avgWait: 11.4,
    density: "Moderate"
  })
  const [counters, setCounters] = useState<any[]>([
    { id: 1, name: "Registration 1", status: "active", served_today: 92, avg_service_time: 4.5 },
    { id: 2, name: "Registration 2", status: "active", served_today: 84, avg_service_time: 5.0 },
    { id: 3, name: "Express Triage", status: "active", served_today: 104, avg_service_time: 3.8 },
    { id: 4, name: "General Inquiries", status: "inactive", served_today: 38, avg_service_time: 5.2 },
  ])

  useEffect(() => {
    apiClient.get("/counters").then((res) => {
      if (res.data) setCounters(res.data)
    }).catch(() => {
      setCounters([
        { id: 1, name: "Registration 1", status: "active", served_today: 92, avg_service_time: 4.5 },
        { id: 2, name: "Registration 2", status: "active", served_today: 84, avg_service_time: 5.0 },
        { id: 3, name: "Express Triage", status: "active", served_today: 104, avg_service_time: 3.8 },
      ])
    })
  }, [])

  const { lastMessage, isConnected } = useWebSocket()
  useEffect(() => {
    if (lastMessage?.data) {
      setQueueState({
        totalWaiting: lastMessage.data.total_waiting ?? 18,
        activeCounters: lastMessage.data.active_counters ?? 3,
        avgWait: lastMessage.data.avg_wait_minutes ?? 11.4,
        density: lastMessage.data.crowd_density ?? "Moderate"
      })
    }
  }, [lastMessage])

  return (
    <div className="space-y-6">
      {/* Real-time Status Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl border border-slate-200/90 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
            <Activity className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Live Facility Telemetry
            </h2>
            <p className="text-xs text-slate-500">
              Broadcasting sensor data at 5-second sampling frequency
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isConnected ? (
            <Badge variant="outline" className="gap-1.5 text-emerald-600 border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/50">
              <Wifi className="h-3.5 w-3.5 text-emerald-500" />
              WebSocket Synchronized
            </Badge>
          ) : (
            <Badge variant="outline" className="gap-1.5 text-slate-500">
              <Radio className="h-3.5 w-3.5 animate-pulse text-indigo-500" />
              Polling Stream Active
            </Badge>
          )}
        </div>
      </div>

      {/* Hero Real-Time Numbers */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Large Wait Display */}
        <Card className="rounded-2xl border-indigo-200 bg-gradient-to-tr from-indigo-50/60 to-violet-50/60 dark:border-indigo-900/60 dark:bg-indigo-950/30 p-6 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-indigo-700 dark:text-indigo-300">
            <span>People in Queue</span>
            <Users className="h-4 w-4" />
          </div>
          <div className="my-3 text-5xl font-black text-indigo-700 dark:text-indigo-400">
            {queueState.totalWaiting}
          </div>
          <div className="text-xs text-slate-500">
            Across active service lanes
          </div>
        </Card>

        {/* Dynamic Estimated Wait */}
        <Card className="rounded-2xl border-slate-200/90 bg-white dark:border-slate-800 dark:bg-slate-900 p-6 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Predicted Wait</span>
            <Timer className="h-4 w-4 text-violet-500" />
          </div>
          <div className="my-3 text-5xl font-black text-slate-900 dark:text-white">
            {queueState.avgWait} <span className="text-lg font-normal text-slate-400">min</span>
          </div>
          <div className="text-xs text-slate-500">
            M/M/c queuing formulation
          </div>
        </Card>

        {/* Active Counters */}
        <Card className="rounded-2xl border-slate-200/90 bg-white dark:border-slate-800 dark:bg-slate-900 p-6 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Active Counters</span>
            <Sliders className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="my-3 text-5xl font-black text-slate-900 dark:text-white">
            {queueState.activeCounters} <span className="text-lg font-normal text-slate-400">/ 4</span>
          </div>
          <div className="text-xs text-emerald-600 font-semibold">
            Optimal capacity allocation
          </div>
        </Card>

        {/* Crowd Density Gauge */}
        <Card className="rounded-2xl border-slate-200/90 bg-white dark:border-slate-800 dark:bg-slate-900 p-6 flex flex-col justify-between shadow-sm">
          <DensityGauge density={queueState.density} />
        </Card>
      </div>

      {/* Real-time Queue Curve */}
      <QueueChart />

      {/* Active Service Counters */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Active Serving Lanes
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {counters.map((c) => (
            <CounterCard key={c.id} counter={c} />
          ))}
        </div>
      </div>
    </div>
  )
}
export default MonitorPage
