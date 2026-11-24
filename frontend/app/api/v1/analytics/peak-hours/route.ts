import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    location_id: 1,
    date_range: 'Last 7 Days',
    hourly_data: [
      { hour: 8, avg_queue_length: 15, total_served: 45 },
      { hour: 9, avg_queue_length: 22, total_served: 78 },
      { hour: 10, avg_queue_length: 18, total_served: 65 },
      { hour: 11, avg_queue_length: 12, total_served: 50 },
      { hour: 12, avg_queue_length: 34, total_served: 115 },
      { hour: 13, avg_queue_length: 31, total_served: 98 },
      { hour: 14, avg_queue_length: 16, total_served: 58 },
      { hour: 17, avg_queue_length: 26, total_served: 84 },
      { hour: 18, avg_queue_length: 21, total_served: 70 },
    ],
    peak_hour: 12,
    peak_avg_queue: 34,
  });
}
