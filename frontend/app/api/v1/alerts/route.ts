import { NextResponse } from 'next/server';

let alertsList = [
  { id: 1, location_id: 1, type: 'queue_length_exceeded', level: 'critical', message: 'Queue length exceeded threshold (38 waiting at OPD Registration)', actual_value: 38, threshold_value: 20, is_acknowledged: false, created_at: new Date(Date.now() - 300000).toISOString() },
  { id: 2, location_id: 1, type: 'wait_time_high', level: 'warning', message: 'Average waiting time reached 18.5 minutes at Main Meal Counter', actual_value: 18.5, threshold_value: 15.0, is_acknowledged: false, created_at: new Date(Date.now() - 1200000).toISOString() },
  { id: 3, location_id: 1, type: 'counter_inactive', level: 'warning', message: 'Counter 4 remains inactive during peak hour lunch rush', actual_value: 0, threshold_value: 1, is_acknowledged: true, created_at: new Date(Date.now() - 3600000).toISOString() },
];

export async function GET() {
  return NextResponse.json(alertsList);
}
