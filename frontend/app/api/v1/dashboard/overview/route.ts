import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    total_waiting: 18,
    avg_waiting_time_minutes: 11.4,
    longest_wait_minutes: 24.0,
    active_counters: 3,
    total_counters: 4,
    current_queue_length: 18,
    crowd_density: 'Moderate',
    total_served_today: 342,
    alerts_today: 2,
    efficiency_score: 91.5,
    peak_hour: '12:00 - 14:00',
  });
}
