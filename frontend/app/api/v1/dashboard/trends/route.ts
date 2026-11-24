import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    dates: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    queue_lengths: [18.2, 22.5, 19.8, 25.1, 28.4, 21.0, 16.5],
    served_counts: [240, 310, 285, 360, 420, 290, 215],
    waiting_times: [12.4, 15.2, 13.0, 18.5, 21.3, 14.8, 11.2],
  });
}
