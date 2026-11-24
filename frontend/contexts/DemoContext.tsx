'use client';

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import {
  DashboardOverview,
  CrowdDetection,
  Alert,
  Counter,
  Queue,
  Location,
} from '@/types';

interface DemoContextValue {
  isDemoMode: boolean;
  toggleDemoMode: () => void;
  demoData: DemoData;
}

interface DemoData {
  overview: DashboardOverview;
  alerts: Alert[];
  counters: Counter[];
  queues: Queue[];
  locations: Location[];
  detections: CrowdDetection[];
}

function generateDemoData(): DemoData {
  const now = new Date().toISOString();

  const locations: Location[] = [
    { id: 'loc1', facility_id: 'fac1', name: 'Main Canteen', type: 'canteen', max_capacity: 200, current_count: 87, created_at: now },
    { id: 'loc2', facility_id: 'fac2', name: 'OPD Reception', type: 'hospital', max_capacity: 150, current_count: 112, created_at: now },
    { id: 'loc3', facility_id: 'fac3', name: 'Teller Hall', type: 'bank', max_capacity: 100, current_count: 43, created_at: now },
    { id: 'loc4', facility_id: 'fac4', name: 'Service Desk', type: 'service_centre', max_capacity: 80, current_count: 29, created_at: now },
  ];

  const queues: Queue[] = [
    { id: 'q1', location_id: 'loc1', current_length: 23, status: 'active', created_at: now, updated_at: now, predicted_wait_minutes: 11 },
    { id: 'q2', location_id: 'loc2', current_length: 41, status: 'active', created_at: now, updated_at: now, predicted_wait_minutes: 18 },
    { id: 'q3', location_id: 'loc3', current_length: 12, status: 'active', created_at: now, updated_at: now, predicted_wait_minutes: 7 },
    { id: 'q4', location_id: 'loc4', current_length: 8, status: 'active', created_at: now, updated_at: now, predicted_wait_minutes: 5 },
  ];

  const counters: Counter[] = [
    { id: 'c1', location_id: 'loc1', name: 'Counter 1', status: 'open', avg_service_time: 90, served_today: 87, created_at: now, updated_at: now },
    { id: 'c2', location_id: 'loc1', name: 'Counter 2', status: 'busy', avg_service_time: 120, served_today: 65, created_at: now, updated_at: now },
    { id: 'c3', location_id: 'loc2', name: 'Counter A', status: 'open', avg_service_time: 180, served_today: 42, created_at: now, updated_at: now },
    { id: 'c4', location_id: 'loc2', name: 'Counter B', status: 'break', avg_service_time: 150, served_today: 38, created_at: now, updated_at: now },
  ];

  const alerts: Alert[] = [
    { id: 'a1', location_id: 'loc2', type: 'overcrowding', level: 'critical', message: 'OPD Reception exceeds 75% capacity. 112/150 people detected.', threshold_value: 75, actual_value: 74.7, is_acknowledged: false, created_at: now },
    { id: 'a2', location_id: 'loc1', type: 'long_wait', level: 'warning', message: 'Wait time at Main Canteen exceeded 10 minutes threshold.', threshold_value: 10, actual_value: 11, is_acknowledged: false, created_at: now },
    { id: 'a3', location_id: 'loc3', type: 'counter_down', level: 'info', message: 'Counter B at OPD is on break. Consider reopening.', is_acknowledged: true, created_at: now, acknowledged_at: now },
  ];

  const detections: CrowdDetection[] = [
    { id: 'd1', location_id: 'loc1', people_count: 87, density_level: 'medium', confidence: 0.94, model_used: 'yolov8n', is_demo: true, created_at: now },
    { id: 'd2', location_id: 'loc2', people_count: 112, density_level: 'high', confidence: 0.91, model_used: 'yolov8n', is_demo: true, created_at: now },
    { id: 'd3', location_id: 'loc3', people_count: 43, density_level: 'low', confidence: 0.96, model_used: 'yolov8n', is_demo: true, created_at: now },
  ];

  const queueTrends = Array.from({ length: 24 }, (_, i) => ({
    timestamp: new Date(Date.now() - (23 - i) * 3600000).toISOString(),
    queue_length: Math.max(0, Math.round(20 + Math.sin((i - 8) * 0.5) * 15 + Math.random() * 5)),
    wait_minutes: Math.max(1, Math.round(8 + Math.sin((i - 8) * 0.5) * 6 + Math.random() * 2)),
    served: Math.round(30 + Math.random() * 20),
  }));

  const overview: DashboardOverview = {
    total_people_in_queue: 84,
    avg_wait_time_minutes: 10.2,
    active_counters: 6,
    total_counters: 8,
    alerts_count: 3,
    critical_alerts_count: 1,
    served_today: 342,
    peak_hour: '12:30 PM',
    locations_summary: [
      { location_id: 'loc1', location_name: 'Main Canteen', facility_name: 'College', current_queue: 23, wait_minutes: 11, density: 'medium', active_counters: 2, total_counters: 3 },
      { location_id: 'loc2', location_name: 'OPD Reception', facility_name: 'City Hospital', current_queue: 41, wait_minutes: 18, density: 'high', active_counters: 2, total_counters: 4 },
      { location_id: 'loc3', location_name: 'Teller Hall', facility_name: 'Metro Bank', current_queue: 12, wait_minutes: 7, density: 'low', active_counters: 2, total_counters: 3 },
    ],
    recent_detections: detections,
    queue_trends: queueTrends,
  };

  return { overview, alerts, counters, queues, locations, detections };
}

const DemoContext = createContext<DemoContextValue | null>(null);

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [isDemoMode, setIsDemoMode] = useState(true);
  const demoData = useMemo(() => generateDemoData(), []);

  const toggleDemoMode = useCallback(() => {
    setIsDemoMode((prev) => !prev);
  }, []);

  return (
    <DemoContext.Provider value={{ isDemoMode, toggleDemoMode, demoData }}>
      {children}
    </DemoContext.Provider>
  );
}

export function useDemoContext(): DemoContextValue {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error('useDemoContext must be used within a DemoProvider');
  return ctx;
}
