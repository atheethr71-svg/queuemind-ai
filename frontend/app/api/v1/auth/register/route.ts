import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return NextResponse.json({
      access_token: 'demo_jwt_token_registered_' + Date.now(),
      token_type: 'bearer',
      user: {
        id: Math.floor(Math.random() * 1000) + 10,
        email: body.email,
        full_name: body.full_name || 'Administrator',
        role: body.role || 'admin',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    });
  } catch {
    return NextResponse.json({ error: 'Registration failed' }, { status: 400 });
  }
}
