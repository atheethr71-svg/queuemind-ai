import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    id: 1,
    email: 'admin@queuemind.ai',
    full_name: 'Facility Administrator',
    role: 'admin',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });
}
