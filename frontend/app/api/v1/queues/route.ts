import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json([
    { id: 1, location_id: 1, current_length: 18, status: 'active', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 2, location_id: 2, current_length: 12, status: 'active', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  ]);
}
