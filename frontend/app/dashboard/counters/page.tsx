"use client"

import React, { useState, useEffect } from "react"
import { Sliders, Plus, Power, CheckCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { CounterTable } from "@/components/dashboard/CounterTable"
import { apiClient } from "@/lib/api"

export default function CountersPage() {
  const [counters, setCounters] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchCounters = () => {
    apiClient.get("/counters").then((res) => {
      if (res.data) setCounters(res.data)
    }).catch(() => {
      setCounters([
        { id: 1, name: "Registration Counter 1", status: "active", served_today: 95, avg_service_time: 4.5, location_id: 1 },
        { id: 2, name: "Registration Counter 2", status: "active", served_today: 88, avg_service_time: 5.0, location_id: 1 },
        { id: 3, name: "Express Triage Desk", status: "active", served_today: 79, avg_service_time: 3.5, location_id: 1 },
        { id: 4, name: "Specialized Inquiry", status: "inactive", served_today: 34, avg_service_time: 6.0, location_id: 1 },
      ])
    }).finally(() => {
      setLoading(false)
    })
  }

  useEffect(() => {
    fetchCounters()
  }, [])

  const handleToggleStatus = async (counterId: number, currentStatus: string) => {
    const nextStatus = currentStatus === "active" ? "inactive" : "active"
    try {
      await apiClient.patch(`/counters/${counterId}`, { status: nextStatus })
      fetchCounters()
    } catch {
      setCounters((prev) =>
        prev.map((c) => c.id === counterId ? { ...c, status: nextStatus } : c)
      )
    }
  }

  const handleAddCounter = async () => {
    const newName = `Counter ${counters.length + 1}`
    try {
      await apiClient.post("/counters?location_id=1", {
        name: newName,
        avg_service_time: 5.0
      })
      fetchCounters()
    } catch {
      setCounters((prev) => [
        ...prev,
        { id: Date.now(), name: newName, status: "active", served_today: 0, avg_service_time: 5.0, location_id: 1 }
      ])
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl border border-slate-200/90 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
            <Sliders className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Service Counter Operations
            </h2>
            <p className="text-xs text-slate-500">
              Control active service lanes, assign operator shifts, and monitor per-counter throughput
            </p>
          </div>
        </div>

        <Button onClick={handleAddCounter} variant="gradient" className="rounded-xl gap-2 text-xs">
          <Plus className="h-4 w-4" />
          Add Service Counter
        </Button>
      </div>

      <CounterTable counters={counters} onToggleStatus={handleToggleStatus} />
    </div>
  )
}
