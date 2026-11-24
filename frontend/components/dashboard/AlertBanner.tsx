'use client';

import React from 'react';
import { clsx } from 'clsx';
import { AlertTriangle, Info, XCircle, Bell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface Alert {
  id: string | number;
  level: string;
  message: string;
  location?: string;
  timestamp?: string;
}

interface AlertBannerProps {
  alerts?: Alert[];
  onAcknowledge?: (id: any) => void;
  maxItems?: number;
}

const defaultAlerts: Alert[] = [
  {
    id: 1,
    level: 'warning',
    message: 'Average wait time reached 18.5 mins at Registration Counter 2',
    timestamp: '10m ago'
  },
  {
    id: 2,
    level: 'critical',
    message: 'Queue length exceeded threshold (38 waiting at Main Entrance)',
    timestamp: '25m ago'
  }
];

export function AlertBanner({ alerts = defaultAlerts, onAcknowledge, maxItems = 3 }: AlertBannerProps) {
  const items = (alerts && alerts.length > 0) ? alerts.slice(0, maxItems) : defaultAlerts;

  return (
    <Card className="rounded-2xl border-slate-200/90 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-sm">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-amber-500" />
          <CardTitle className="text-sm font-bold">Active Alerts</CardTitle>
        </div>
        <Badge variant="warning" className="text-[10px]">
          {items.length} Active
        </Badge>
      </CardHeader>
      <CardContent className="space-y-2.5">
        {items.map((a) => {
          const isCritical = a.level?.toLowerCase() === 'critical';
          return (
            <div
              key={a.id}
              className={clsx(
                'p-3 rounded-xl border text-xs flex items-start gap-2.5',
                isCritical
                  ? 'border-red-200 bg-red-50/60 text-red-900 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300'
                  : 'border-amber-200 bg-amber-50/60 text-amber-900 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300'
              )}
            >
              <AlertTriangle className={clsx('h-4 w-4 shrink-0 mt-0.5', isCritical ? 'text-red-500' : 'text-amber-500')} />
              <div className="flex-1">
                <p className="font-semibold">{a.message}</p>
                {a.timestamp && <span className="text-[10px] opacity-75">{a.timestamp}</span>}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
