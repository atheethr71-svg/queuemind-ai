'use client';

import React from 'react';
import { clsx } from 'clsx';
import { Users, AlertTriangle, Monitor, TrendingUp, Bot, Sparkles } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export interface FeedEvent {
  id: string | number;
  type: string;
  message: string;
  timestamp: string;
}

interface ActivityFeedProps {
  events?: FeedEvent[];
  maxItems?: number;
  loading?: boolean;
}

const defaultEvents: FeedEvent[] = [
  { id: 1, type: 'agent', message: 'AI Agent recommended opening Counter 3 for lunch peak', timestamp: '5m ago' },
  { id: 2, type: 'counter', message: 'Counter 2 activated by operator', timestamp: '12m ago' },
  { id: 3, type: 'alert', message: 'Queue surge +14 people detected at Registration Desk', timestamp: '24m ago' },
  { id: 4, type: 'queue', message: 'Wait time decreased from 16m to 11m', timestamp: '38m ago' },
];

export function ActivityFeed({ events = defaultEvents, maxItems = 4, loading = false }: ActivityFeedProps) {
  const displayEvents = (events && events.length > 0) ? events.slice(0, maxItems) : defaultEvents;

  return (
    <Card className="rounded-2xl border-slate-200/90 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-sm">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-indigo-500" />
          <CardTitle className="text-sm font-bold">Activity Log</CardTitle>
        </div>
        <span className="text-xs text-slate-400">Live Feed</span>
      </CardHeader>
      <CardContent className="space-y-3">
        {displayEvents.map((e) => (
          <div key={e.id} className="flex items-start gap-2.5 text-xs">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 mt-0.5">
              <Bot className="h-3.5 w-3.5" />
            </div>
            <div className="flex-1">
              <p className="text-slate-800 dark:text-slate-200 font-medium leading-snug">{e.message}</p>
              <span className="text-[10px] text-slate-400">{e.timestamp}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
