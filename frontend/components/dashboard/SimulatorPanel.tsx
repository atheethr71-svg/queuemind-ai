"use client"

import React, { useState, useEffect } from "react"
import {
  Sliders,
  Sparkles,
  ArrowRight,
  TrendingDown,
  CheckCircle2,
  Clock,
  Users,
  Percent,
  Check
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { apiClient } from "@/lib/api"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts"

export function SimulatorPanel() {
  const [queueLength, setQueueLength] = useState(24)
  const [currentCounters, setCurrentCounters] = useState(2)
  const [proposedCounters, setProposedCounters] = useState(3)
  const [avgServiceTime, setAvgServiceTime] = useState(5.0)
  const [incomingPeople, setIncomingPeople] = useState(10)
  const [maxCounters, setMaxCounters] = useState(6)
  const [simResult, setSimResult] = useState<any>(null)
  const [applying, setApplying] = useState(false)
  const [applied, setApplied] = useState(false)

  // Real mathematical calculation function executed on every change
  const runSimulation = async () => {
    try {
      const res = await apiClient.post("/counters/simulate", {
        location_id: 1,
        queue_length: queueLength,
        current_counters: currentCounters,
        proposed_counters: proposedCounters,
        avg_service_time_minutes: avgServiceTime,
        incoming_people: incomingPeople
      })
      if (res.data) {
        setSimResult(res.data)
      }
    } catch {
      // Local fallback calculation if backend temporarily unreachable
      const svcRatePerMin = 1.0 / Math.max(0.5, avgServiceTime)
      const totalVolume = queueLength + incomingPeople
      const curWait = (totalVolume / (currentCounters * svcRatePerMin)).toFixed(1)
      const propWait = (totalVolume / (proposedCounters * svcRatePerMin)).toFixed(1)
      const saved = Math.max(0, Number(curWait) - Number(propWait)).toFixed(1)
      const util = Math.min(100, Math.round(((totalVolume / (proposedCounters * 20)) * 100)))

      setSimResult({
        current_counters: currentCounters,
        proposed_counters: proposedCounters,
        current_wait: Number(curWait),
        predicted_wait: Number(propWait),
        time_saved: Number(saved),
        utilisation: util,
        recommendation: `Adding ${proposedCounters - currentCounters} counter(s) yields an estimated wait time reduction of ${saved} minutes per person.`
      })
    }
  }

  useEffect(() => {
    runSimulation()
    setApplied(false)
  }, [queueLength, currentCounters, proposedCounters, avgServiceTime, incomingPeople])

  const handleApply = async () => {
    setApplying(true)
    try {
      await apiClient.post("/counters/apply-recommendation", {
        location_id: 1,
        proposed_counters: proposedCounters
      })
      setApplied(true)
      setCurrentCounters(proposedCounters)
    } finally {
      setApplying(false)
    }
  }

  // Generate chart data for counter options from 1 to maxCounters
  const chartData = []
  const svcRate = 1.0 / Math.max(0.5, avgServiceTime)
  for (let c = 1; c <= maxCounters; c++) {
    const wait = Number(((queueLength + incomingPeople) / (c * svcRate)).toFixed(1))
    chartData.push({
      counters: `${c} Counters`,
      count: c,
      waitTime: wait,
      isSelected: c === proposedCounters
    })
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Input Configuration Panel (5 cols) */}
        <Card className="lg:col-span-5 rounded-2xl shadow-sm border-slate-200/90 dark:border-slate-800">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                <Sliders className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-base font-bold">Simulator Controls</CardTitle>
                <CardDescription className="text-xs">
                  Simulate queue scenarios and test counter configurations
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-5">
            {/* Queue Length Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <Label htmlFor="qLen" className="font-semibold text-slate-700 dark:text-slate-300">
                  Current Waiting People
                </Label>
                <span className="font-bold text-indigo-600 text-sm">{queueLength}</span>
              </div>
              <input
                id="qLen"
                type="range"
                min="1"
                max="80"
                value={queueLength}
                onChange={(e) => setQueueLength(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 dark:bg-slate-700"
              />
            </div>

            {/* Current vs Proposed Active Counters */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <Label className="font-semibold text-slate-700 dark:text-slate-300">
                    Current Active
                  </Label>
                  <span className="font-bold text-slate-900 dark:text-white">{currentCounters}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max={maxCounters}
                  value={currentCounters}
                  onChange={(e) => setCurrentCounters(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-600 dark:bg-slate-700"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <Label className="font-semibold text-indigo-600 dark:text-indigo-400">
                    Proposed Counters
                  </Label>
                  <span className="font-bold text-indigo-600 text-sm">{proposedCounters}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max={maxCounters}
                  value={proposedCounters}
                  onChange={(e) => setProposedCounters(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 dark:bg-slate-700"
                />
              </div>
            </div>

            {/* Average Service Time */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <Label className="font-semibold text-slate-700 dark:text-slate-300">
                  Avg Service Time (mins/person)
                </Label>
                <span className="font-bold text-indigo-600 text-sm">{avgServiceTime}m</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="15.0"
                step="0.5"
                value={avgServiceTime}
                onChange={(e) => setAvgServiceTime(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 dark:bg-slate-700"
              />
            </div>

            {/* Incoming People Influx */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <Label className="font-semibold text-slate-700 dark:text-slate-300">
                  Expected Influx (Next 15m)
                </Label>
                <span className="font-bold text-indigo-600 text-sm">+{incomingPeople}</span>
              </div>
              <input
                type="range"
                min="0"
                max="40"
                value={incomingPeople}
                onChange={(e) => setIncomingPeople(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 dark:bg-slate-700"
              />
            </div>
          </CardContent>
        </Card>

        {/* Right Mathematical Results Panel (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Comparison Cards: Current vs Proposed */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Current Config */}
            <div className="p-5 rounded-2xl border border-slate-200/90 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-sm">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
                <span>Current Setup</span>
                <Badge variant="outline">{currentCounters} Active</Badge>
              </div>
              <div className="text-3xl font-black text-slate-900 dark:text-white">
                {simResult?.current_wait ?? 15.0} <span className="text-sm font-medium text-slate-400">mins</span>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Baseline waiting time for {queueLength} people
              </p>
            </div>

            {/* Recommended Config */}
            <div className="p-5 rounded-2xl border border-indigo-200 bg-gradient-to-tr from-indigo-50/70 to-violet-50/70 dark:border-indigo-900/60 dark:bg-indigo-950/30 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between text-xs font-semibold text-indigo-700 dark:text-indigo-300 mb-2">
                <span className="flex items-center gap-1 font-bold">
                  <Sparkles className="h-3.5 w-3.5" /> Proposed Setup
                </span>
                <Badge variant="default" className="bg-indigo-600">{proposedCounters} Active</Badge>
              </div>
              <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400">
                {simResult?.predicted_wait ?? 8.5} <span className="text-sm font-medium text-indigo-400">mins</span>
              </div>
              <div className="mt-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <TrendingDown className="h-3.5 w-3.5" />
                <span>
                  Saves ~{simResult?.time_saved ?? 6.5} mins per person
                </span>
              </div>
            </div>
          </div>

          {/* Comparative Bar Chart across Counter Counts */}
          <Card className="rounded-2xl shadow-sm border-slate-200/90 dark:border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold">
                Wait Time Sensitivity by Counter Capacity
              </CardTitle>
              <CardDescription className="text-xs">
                Calculated wait duration for {queueLength + incomingPeople} total people
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="counters" stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} unit="m" />
                    <Tooltip
                      formatter={(val: any) => [`${val} mins`, "Expected Wait"]}
                      contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}
                    />
                    <Bar dataKey="waitTime" radius={[8, 8, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.isSelected ? "#4f46e5" : "#cbd5e1"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Action Banner with Apply Button */}
              <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <div className="text-xs text-slate-600 dark:text-slate-300">
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {simResult?.recommendation}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Utilisation rating: {simResult?.utilisation ?? 82}%
                  </p>
                </div>

                <Button
                  onClick={handleApply}
                  variant={applied ? "secondary" : "gradient"}
                  className="rounded-xl px-5 shrink-0"
                  disabled={applying || applied || currentCounters === proposedCounters}
                >
                  {applied ? (
                    <span className="flex items-center gap-1.5 text-emerald-600">
                      <Check className="h-4 w-4" /> Applied
                    </span>
                  ) : applying ? (
                    "Deploying Counters..."
                  ) : (
                    "Apply Recommendation"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
