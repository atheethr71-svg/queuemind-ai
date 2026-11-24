'use client';

import React, { ReactNode } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { clsx } from 'clsx';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: number | { value: number; isPositive?: boolean };
  trendLabel?: string;
  icon?: any;
  badge?: { label: string; color: 'green' | 'yellow' | 'orange' | 'red' | 'blue' | 'purple' };
  onClick?: () => void;
  loading?: boolean;
  className?: string;
  highlight?: boolean;
}

export function MetricCard({
  title,
  value,
  subtitle,
  trend,
  trendLabel,
  icon,
  badge,
  onClick,
  loading = false,
  className,
  highlight = false,
}: MetricCardProps) {
  let isPositiveTrend = false;
  let isNegativeTrend = false;
  let trendVal: number | undefined;

  if (typeof trend === 'number') {
    trendVal = trend;
    isPositiveTrend = trend > 0;
    isNegativeTrend = trend < 0;
  } else if (trend && typeof trend === 'object') {
    trendVal = trend.value;
    isPositiveTrend = !!trend.isPositive;
    isNegativeTrend = !trend.isPositive;
  }

  // Render icon whether it's a function/component or a React node
  const renderIcon = () => {
    if (!icon) return null;
    if (React.isValidElement(icon)) return icon;
    if (typeof icon === 'function') {
      const IconComp = icon;
      return <IconComp className="h-5 w-5" />;
    }
    return null;
  };

  if (loading) {
    return (
      <div className={clsx('rounded-2xl border border-slate-200 bg-white p-5 shadow-sm animate-pulse dark:border-slate-800 dark:bg-slate-900', className)}>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-3"></div>
        <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-1/3"></div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={clsx(
        'rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm transition-all duration-200 dark:border-slate-800 dark:bg-slate-900',
        onClick && 'cursor-pointer hover:border-indigo-400 hover:shadow-md',
        highlight && 'border-indigo-300 bg-indigo-50/30 dark:border-indigo-800 dark:bg-indigo-950/20',
        className
      )}
    >
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
        <span className="font-semibold truncate">{title}</span>
        {icon && (
          <div className="p-2 rounded-xl bg-slate-50 text-indigo-600 dark:bg-slate-800 dark:text-indigo-400 shrink-0">
            {renderIcon()}
          </div>
        )}
      </div>

      <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
        {value}
      </div>

      <div className="mt-2 flex items-center justify-between text-xs">
        {subtitle && (
          <span className="text-slate-500 dark:text-slate-400 truncate max-w-[150px]">
            {subtitle}
          </span>
        )}

        {trendVal !== undefined && (
          <span
            className={clsx(
              'inline-flex items-center gap-0.5 font-bold',
              isPositiveTrend && 'text-emerald-600 dark:text-emerald-400',
              isNegativeTrend && 'text-red-500 dark:text-red-400'
            )}
          >
            {isPositiveTrend ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {trendVal}%
          </span>
        )}
      </div>
    </div>
  );
}
