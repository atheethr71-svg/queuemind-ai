import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    total_served_today: 342,
    avg_waiting_time_minutes: 11.4,
    active_counters: 3,
    total_counters: 4,
    current_queue_length: 18,
    alerts_today: 2,
    peak_hour: '12:00 - 14:00',
    efficiency_score: 91.5,
  });
}
