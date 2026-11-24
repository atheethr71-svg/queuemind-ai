'use client';

import React from 'react';
import { clsx } from 'clsx';
import { Gauge } from 'lucide-react';

interface DensityGaugeProps {
  density?: number | string;
  level?: 'Low' | 'Moderate' | 'High' | 'Critical';
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const levelColors = {
  Low: {
    bar: 'bg-emerald-500',
    text: 'text-emerald-600 dark:text-emerald-400',
    badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
  },
  Moderate: {
    bar: 'bg-amber-500',
    text: 'text-amber-600 dark:text-amber-400',
    badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  },
  High: {
    bar: 'bg-orange-500',
    text: 'text-orange-600 dark:text-orange-400',
    badge: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  },
  Critical: {
    bar: 'bg-red-500',
    text: 'text-red-600 dark:text-red-400',
    badge: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  },
};

export function DensityGauge({ density = 45, level, showLabel = true, size = 'md' }: DensityGaugeProps) {
  let resolvedLevel: 'Low' | 'Moderate' | 'High' | 'Critical' = 'Moderate';
  let numericDensity = 45;

  if (typeof density === 'string') {
    const dLower = density.toLowerCase();
    if (dLower === 'critical') {
      resolvedLevel = 'Critical';
      numericDensity = 90;
    } else if (dLower === 'high') {
      resolvedLevel = 'High';
      numericDensity = 72;
    } else if (dLower === 'low') {
      resolvedLevel = 'Low';
      numericDensity = 25;
    } else {
      resolvedLevel = 'Moderate';
      numericDensity = 48;
    }
  } else if (typeof density === 'number') {
    numericDensity = density;
    if (level) {
      resolvedLevel = level;
    } else {
      if (density > 75) resolvedLevel = 'Critical';
      else if (density > 50) resolvedLevel = 'High';
      else if (density > 25) resolvedLevel = 'Moderate';
      else resolvedLevel = 'Low';
    }
  }

  const colors = levelColors[resolvedLevel] || levelColors.Moderate;

  return (
    <div className="flex flex-col justify-between h-full space-y-3">
      <div className="flex items-center justify-between text-xs font-bold text-slate-500">
        <span className="flex items-center gap-1.5">
          <Gauge className="h-4 w-4 text-violet-500" />
          <span>Crowd Density</span>
        </span>
        <span className={clsx('rounded-full px-2 py-0.5 text-[10px] font-bold uppercase', colors.badge)}>
          {resolvedLevel}
        </span>
      </div>

      <div>
        <div className="text-3xl font-black text-slate-900 dark:text-white">
          {numericDensity}%
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className={clsx('h-full rounded-full transition-all duration-300', colors.bar)}
            style={{ width: `${Math.min(100, Math.max(0, numericDensity))}%` }}
          />
        </div>
      </div>

      <div className="text-[11px] text-slate-400">
        Computer vision crowd density rating
      </div>
    </div>
  );
}
