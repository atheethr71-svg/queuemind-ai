import { NextResponse } from 'next/server';

export async function POST() {
  const count = Math.floor(Math.random() * 20) + 10;
  let density = 'moderate';
  if (count > 22) density = 'high';
  else if (count < 12) density = 'low';

  return NextResponse.json({
    id: Date.now(),
    location_id: 1,
    people_count: count,
    density_level: density,
    confidence: 0.92,
    model_used: 'yolov8n',
    is_demo: true,
    created_at: new Date().toISOString(),
  });
}
