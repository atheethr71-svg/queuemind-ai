'use client';

import React from 'react';
import { clsx } from 'clsx';
import { Clock, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';
import { format, addMinutes } from 'date-fns';

interface PredictionCardProps {
  predictedMinutes?: number;
  confidence?: number;
  formulaUsed?: string;
  serviceRate?: number;
  queueLength?: number;
  activeCounters?: number;
  loading?: boolean;
  className?: string;
}

export function PredictionCard({
  predictedMinutes = 11.4,
  confidence = 0.92,
  formulaUsed = "M/M/c Erlang Formula",
  serviceRate = 42,
  queueLength = 18,
  activeCounters = 3,
  loading = false,
  className,
}: PredictionCardProps) {
  const completionTime = addMinutes(new Date(), Math.round(predictedMinutes));
  const confPct = confidence <= 1.0 ? Math.round(confidence * 100) : Math.round(confidence);
  const confidenceLevel = confPct >= 80 ? 'high' : confPct >= 60 ? 'medium' : 'low';

  const confidenceConfig = {
    high: { color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/30', label: 'High Confidence' },
    medium: { color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/30', label: 'Medium Confidence' },
    low: { color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30', label: 'Low Confidence' },
  };
  const cfg = confidenceConfig[confidenceLevel];

  return (
    <div className={clsx('rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900', className)}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Estimated Wait</span>
        <span className={clsx('rounded-full px-2.5 py-0.5 text-[10px] font-bold', cfg.bg, cfg.color)}>
          {confPct}% {cfg.label}
        </span>
      </div>

      <div className="text-4xl font-black text-indigo-600 dark:text-indigo-400">
        {predictedMinutes} <span className="text-base font-normal text-slate-400">minutes</span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-slate-500 pt-3 border-t border-slate-100 dark:border-slate-800">
        <div>
          <span>Service Completion:</span>
          <p className="font-bold text-slate-800 dark:text-slate-200">{format(completionTime, 'HH:mm')}</p>
        </div>
        <div>
          <span>Hourly Throughput:</span>
          <p className="font-bold text-slate-800 dark:text-slate-200">{serviceRate} people/hr</p>
        </div>
      </div>
    </div>
  );
}
