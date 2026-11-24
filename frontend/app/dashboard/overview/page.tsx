"use client"

import React, { useState, useEffect } from "react"
import {
  Users,
  Timer,
  Clock,
  Sliders,
  Gauge,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  Sparkles
} from "lucide-react"
import { MetricCard } from "@/components/dashboard/MetricCard"
import { QueueChart } from "@/components/dashboard/QueueChart"
import { ActivityFeed } from "@/components/dashboard/ActivityFeed"
import { AlertBanner } from "@/components/dashboard/AlertBanner"
import { CounterCard } from "@/components/dashboard/CounterCard"
import { apiClient } from "@/lib/api"
import { useWebSocket } from "@/hooks/useWebSocket"

export default function OverviewPage() {
  const [overview, setOverview] = useState<any>({
    total_waiting: 18,
    avg_waiting_time_minutes: 11.4,
    longest_wait_minutes: 24.0,
    active_counters: 3,
    total_counters: 4,
    crowd_density: "Moderate",
    completion_time: "15:45",
    total_served_today: 342,
    efficiency_score: 91.5,
    alerts_today: 2
  })
  const [counters, setCounters] = useState<any[]>([
    { id: 1, name: "Counter 1 (Express)", status: "active", served_today: 95, avg_service_time: 4.2 },
    { id: 2, name: "Counter 2 (General)", status: "active", served_today: 88, avg_service_time: 5.0 },
    { id: 3, name: "Counter 3 (Billing)", status: "active", served_today: 79, avg_service_time: 4.8 },
    { id: 4, name: "Counter 4 (Inquiry)", status: "inactive", served_today: 42, avg_service_time: 5.5 },
  ])
  const [loading, setLoading] = useState(true)

  // Fetch initial dashboard metrics
  useEffect(() => {
    Promise.all([
      apiClient.get("/dashboard/overview"),
      apiClient.get("/counters")
    ]).then(([ovRes, countRes]) => {
      if (ovRes.data) {
        setOverview((prev: any) => ({
          ...prev,
          ...ovRes.data,
          total_waiting: ovRes.data.current_queue_length || prev.total_waiting,
        }))
      }
      if (countRes.data) {
        setCounters(countRes.data)
      }
    }).catch(() => {
      // Demo fallback
      setCounters([
        { id: 1, name: "Counter 1 (Express)", status: "active", served_today: 95, avg_service_time: 4.2 },
        { id: 2, name: "Counter 2 (General)", status: "active", served_today: 88, avg_service_time: 5.0 },
        { id: 3, name: "Counter 3 (Billing)", status: "active", served_today: 79, avg_service_time: 4.8 },
        { id: 4, name: "Counter 4 (Inquiry)", status: "inactive", served_today: 42, avg_service_time: 5.5 },
      ])
    }).finally(() => {
      setLoading(false)
    })
  }, [])

  // Listen to live WebSocket stream
  const { lastMessage } = useWebSocket()
  useEffect(() => {
    if (lastMessage && lastMessage.type === "queue_update" && lastMessage.data) {
      setOverview((prev: any) => ({
        ...prev,
        total_waiting: lastMessage.data.total_waiting ?? prev.total_waiting,
        active_counters: lastMessage.data.active_counters ?? prev.active_counters,
        avg_waiting_time_minutes: lastMessage.data.avg_wait_minutes ?? prev.avg_waiting_time_minutes,
        crowd_density: lastMessage.data.crowd_density ?? prev.crowd_density,
      }))
    }
  }, [lastMessage])

  return (
    <div className="space-y-6">
      {/* 9 Executive Key Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <MetricCard
          title="Total People Waiting"
          value={overview.total_waiting}
          icon={Users}
          trend={{ value: 4, isPositive: false }}
          subtitle="Monitored in queue"
        />
        <MetricCard
          title="Average Waiting Time"
          value={`${overview.avg_waiting_time_minutes}m`}
          icon={Timer}
          trend={{ value: 12, isPositive: true }}
          subtitle="Dynamic M/M/c estimate"
        />
        <MetricCard
          title="Active Counters"
          value={`${overview.active_counters} / ${overview.total_counters}`}
          icon={Sliders}
          subtitle={`${overview.total_counters - overview.active_counters} standby`}
        />
        <MetricCard
          title="Crowd Density"
          value={overview.crowd_density}
          icon={Gauge}
          subtitle="Computer Vision rating"
        />
        <MetricCard
          title="Efficiency Score"
          value={`${overview.efficiency_score}%`}
          icon={CheckCircle2}
          trend={{ value: 6, isPositive: true }}
          subtitle="System throughput"
        />
      </div>

      {/* Real-time Queue Chart and Real-time Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <QueueChart />
        </div>
        <div className="lg:col-span-1 space-y-6">
          <AlertBanner />
          <ActivityFeed />
        </div>
      </div>

      {/* Live Service Counter Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Live Service Counters Status
          </h3>
          <span className="text-xs text-slate-400">
            Real-time operator workload and throughput
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {counters.map((c) => (
            <CounterCard
              key={c.id}
              counter={c}
              onToggleStatus={() => {
                const newStatus = c.status === "active" ? "inactive" : "active"
                apiClient.patch(`/counters/${c.id}`, { status: newStatus }).then(() => {
                  setCounters((prev) =>
                    prev.map((item) => item.id === c.id ? { ...item, status: newStatus } : item)
                  )
                })
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
