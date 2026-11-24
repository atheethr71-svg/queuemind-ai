"use client"

import React from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts"

interface HourlyData {
  hour: number
  avg_queue_length: number
  total_served: number
}

interface PeakHoursChartProps {
  data: HourlyData[]
}

export function PeakHoursChart({ data }: PeakHoursChartProps) {
  const formatted = data.map((d) => ({
    time: `${d.hour}:00`,
    queue: d.avg_queue_length,
    served: d.total_served,
    isPeak: d.avg_queue_length >= 25
  }))

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={formatted} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
          <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
          <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
          <Tooltip
            formatter={(value: any, name: string) => [
              name === "queue" ? `${value} avg people` : `${value} served`,
              name === "queue" ? "Avg Queue Size" : "Total Served"
            ]}
            contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}
          />
          <Bar dataKey="queue" radius={[6, 6, 0, 0]}>
            {formatted.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.isPeak ? "#ef4444" : "#4f46e5"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
