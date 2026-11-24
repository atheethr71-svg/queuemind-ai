import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json([
    { id: 1, location_id: 1, people_count: 24, density_level: 'high', confidence: 0.93, model_used: 'yolov8n', is_demo: true, created_at: new Date(Date.now() - 600000).toISOString() },
    { id: 2, location_id: 1, people_count: 15, density_level: 'moderate', confidence: 0.89, model_used: 'yolov8n', is_demo: true, created_at: new Date(Date.now() - 1800000).toISOString() },
    { id: 3, location_id: 1, people_count: 8, density_level: 'low', confidence: 0.95, model_used: 'yolov8n', is_demo: true, created_at: new Date(Date.now() - 3600000).toISOString() },
  ]);
}
