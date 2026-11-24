'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { clsx } from 'clsx';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

interface DataPoint {
  time: string;
  value: number;
  predicted?: number;
}

interface QueueChartProps {
  data?: DataPoint[];
  title?: string;
  thresholdValue?: number;
  color?: string;
  showPredicted?: boolean;
  height?: number;
  minimal?: boolean;
  loading?: boolean;
}

const defaultData: DataPoint[] = [
  { time: '10:00', value: 12, predicted: 14 },
  { time: '10:15', value: 18, predicted: 19 },
  { time: '10:30', value: 24, predicted: 22 },
  { time: '10:45', value: 21, predicted: 20 },
  { time: '11:00', value: 28, predicted: 26 },
  { time: '11:15', value: 34, predicted: 30 },
  { time: '11:30', value: 26, predicted: 24 },
  { time: '11:45', value: 20, predicted: 18 },
  { time: '12:00', value: 32, predicted: 35 },
];

export function QueueChart({
  data = defaultData,
  title = "Real-Time Queue Inflow & Predictions",
  thresholdValue = 25,
  color = "#4f46e5",
  showPredicted = true,
  height = 260,
  minimal = false,
  loading = false,
}: QueueChartProps) {
  const chartPoints = (data && data.length > 0) ? data : defaultData;

  if (minimal) {
    return (
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartPoints} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
            <Area type="monotone" dataKey="value" stroke={color} fill={color} fillOpacity={0.15} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <Card className="rounded-2xl border-slate-200/90 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
            {title}
          </CardTitle>
          <span className="text-xs text-slate-400 font-medium">Sampling: 15-min intervals</span>
        </div>
        <CardDescription className="text-xs">
          Live sensor readings against M/M/c predicted trajectory
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div style={{ height }} className="w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartPoints} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="queueColorGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}
              />
              <Area
                type="monotone"
                dataKey="value"
                name="Actual Waiting"
                stroke="#4f46e5"
                strokeWidth={2.5}
                fill="url(#queueColorGrad)"
              />
              {showPredicted && (
                <Line
                  type="monotone"
                  dataKey="predicted"
                  name="AI Projected"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={false}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
