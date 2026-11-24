'use client';

import React from 'react';
import { clsx } from 'clsx';
import { Monitor, User, Wrench, ChevronRight, TrendingUp, Power } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface Counter {
  id: string | number;
  name: string;
  status: string;
  operator?: string;
  served_today: number;
  avg_service_time: number;
  current_queue?: number;
  utilization?: number;
}

interface CounterCardProps {
  counter: Counter;
  onActivate?: (id: any) => void;
  onDeactivate?: (id: any) => void;
  onToggleStatus?: () => void;
  onAssign?: (id: any) => void;
  compact?: boolean;
}

const statusConfig: Record<string, { dot: string; badge: string; border: string }> = {
  Active: {
    dot: 'bg-emerald-500',
    badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
    border: 'border-emerald-200 dark:border-emerald-800',
  },
  Inactive: {
    dot: 'bg-gray-400',
    badge: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
    border: 'border-gray-200 dark:border-gray-700',
  },
  Maintenance: {
    dot: 'bg-amber-500',
    badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
    border: 'border-amber-200 dark:border-amber-800',
  },
};

export function CounterCard({
  counter,
  onActivate,
  onDeactivate,
  onToggleStatus,
  onAssign,
  compact = false
}: CounterCardProps) {
  const rawStatus = (counter?.status || 'Active').toLowerCase();
  const normalizedStatus = rawStatus === 'active' ? 'Active' : rawStatus === 'maintenance' ? 'Maintenance' : 'Inactive';
  const cfg = statusConfig[normalizedStatus] || statusConfig.Inactive;

  const isActive = normalizedStatus === 'Active';

  return (
    <div
      className={clsx(
        'rounded-2xl border bg-white dark:bg-slate-900 shadow-sm transition-all duration-200',
        compact ? 'p-3' : 'p-4',
        cfg.border
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className={clsx('h-2 w-2 rounded-full', cfg.dot, isActive && 'animate-pulse')} />
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">
            {counter.name}
          </h4>
        </div>
        <span className={clsx('rounded-full px-2 py-0.5 text-[10px] font-bold uppercase', cfg.badge)}>
          {normalizedStatus}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 dark:text-slate-400 my-3">
        <div>
          <span>Served Today:</span>
          <p className="font-bold text-slate-800 dark:text-slate-200">{counter.served_today || 0}</p>
        </div>
        <div>
          <span>Avg Duration:</span>
          <p className="font-bold text-slate-800 dark:text-slate-200">{counter.avg_service_time || 5}m</p>
        </div>
      </div>

      {(onToggleStatus || onActivate || onDeactivate) && (
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <Button
            size="sm"
            variant={isActive ? "outline" : "gradient"}
            onClick={() => {
              if (onToggleStatus) onToggleStatus();
              else if (isActive && onDeactivate) onDeactivate(counter.id);
              else if (!isActive && onActivate) onActivate(counter.id);
            }}
            className="h-7 text-xs rounded-lg px-2.5"
          >
            <Power className="h-3 w-3 mr-1" />
            {isActive ? "Turn Off" : "Turn On"}
          </Button>
        </div>
      )}
    </div>
  );
}
