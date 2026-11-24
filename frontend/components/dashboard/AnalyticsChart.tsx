"use client"

import React from "react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts"

interface AnalyticsChartProps {
  dates: string[]
  queueLengths: number[]
  waitingTimes: number[]
}

export function AnalyticsChart({ dates, queueLengths, waitingTimes }: AnalyticsChartProps) {
  const chartData = dates.map((d, i) => ({
    date: d,
    queue: queueLengths[i] || 0,
    wait: waitingTimes[i] || 0
  }))

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
          <defs>
            <linearGradient id="queueColor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="waitColor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
          <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
          <Tooltip
            contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}
          />
          <Area
            type="monotone"
            dataKey="queue"
            name="Queue Volume"
            stroke="#4f46e5"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#queueColor)"
          />
          <Area
            type="monotone"
            dataKey="wait"
            name="Wait Time (m)"
            stroke="#0ea5e9"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#waitColor)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
