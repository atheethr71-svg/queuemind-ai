"use client"

import React, { useState, useEffect } from "react"
import { Bell, CheckCheck, AlertTriangle, ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertsTable } from "@/components/dashboard/AlertsTable"
import { apiClient } from "@/lib/api"

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<any[]>([])
  const [filter, setFilter] = useState("all")

  const fetchAlerts = () => {
    apiClient.get("/alerts").then((res) => {
      if (res.data) setAlerts(res.data)
    }).catch(() => {
      setAlerts([
        { id: 1, location_id: 1, type: "queue_length_exceeded", level: "critical", message: "Queue length exceeded threshold (38 waiting at OPD Registration)", actual_value: 38, threshold_value: 20, is_acknowledged: false, created_at: new Date(Date.now() - 300000).toISOString() },
        { id: 2, location_id: 1, type: "wait_time_high", level: "warning", message: "Average waiting time reached 18.5 minutes at Main Meal Counter", actual_value: 18.5, threshold_value: 15.0, is_acknowledged: false, created_at: new Date(Date.now() - 1200000).toISOString() },
        { id: 3, location_id: 1, type: "counter_inactive", level: "warning", message: "Counter 4 remains inactive during peak hour lunch rush", actual_value: 0, threshold_value: 1, is_acknowledged: true, created_at: new Date(Date.now() - 3600000).toISOString() },
      ])
    })
  }

  useEffect(() => {
    fetchAlerts()
  }, [])

  const handleAcknowledge = async (alertId: number) => {
    try {
      await apiClient.patch(`/alerts/${alertId}/acknowledge`, {})
      setAlerts((prev) =>
        prev.map((a) => a.id === alertId ? { ...a, is_acknowledged: true } : a)
      )
    } catch {
      setAlerts((prev) =>
        prev.map((a) => a.id === alertId ? { ...a, is_acknowledged: true } : a)
      )
    }
  }

  const handleAcknowledgeAll = async () => {
    try {
      await apiClient.post("/alerts/acknowledge-all", {})
      setAlerts((prev) => prev.map((a) => ({ ...a, is_acknowledged: true })))
    } catch {
      setAlerts((prev) => prev.map((a) => ({ ...a, is_acknowledged: true })))
    }
  }

  const filteredAlerts = alerts.filter((a) => {
    if (filter === "unack") return !a.is_acknowledged
    if (filter === "critical") return a.level === "critical"
    if (filter === "warning") return a.level === "warning"
    return true
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl border border-slate-200/90 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-400">
            <Bell className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Congestion Alerts & Incidents
            </h2>
            <p className="text-xs text-slate-500">
              Automated notifications triggered by queue length breaches, high wait times, and crowd surges
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleAcknowledgeAll}
            variant="outline"
            size="sm"
            className="rounded-xl text-xs gap-1.5"
          >
            <CheckCheck className="h-3.5 w-3.5 text-indigo-600" />
            Acknowledge All
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 text-xs">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1.5 rounded-xl font-medium transition-colors ${
            filter === "all" ? "bg-indigo-600 text-white" : "bg-white dark:bg-slate-900 text-slate-600 border border-slate-200 dark:border-slate-800"
          }`}
        >
          All Incidents ({alerts.length})
        </button>
        <button
          onClick={() => setFilter("unack")}
          className={`px-3 py-1.5 rounded-xl font-medium transition-colors ${
            filter === "unack" ? "bg-indigo-600 text-white" : "bg-white dark:bg-slate-900 text-slate-600 border border-slate-200 dark:border-slate-800"
          }`}
        >
          Unacknowledged ({alerts.filter((a) => !a.is_acknowledged).length})
        </button>
        <button
          onClick={() => setFilter("critical")}
          className={`px-3 py-1.5 rounded-xl font-medium transition-colors ${
            filter === "critical" ? "bg-red-600 text-white" : "bg-white dark:bg-slate-900 text-slate-600 border border-slate-200 dark:border-slate-800"
          }`}
        >
          Critical Only
        </button>
      </div>

      {/* Alerts Table */}
      <AlertsTable alerts={filteredAlerts} onAcknowledge={handleAcknowledge} />
    </div>
  )
}
