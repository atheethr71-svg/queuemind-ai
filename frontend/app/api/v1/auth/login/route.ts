import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = body.email || 'admin@queuemind.ai';
    const isOperator = email.includes('operator');

    return NextResponse.json({
      access_token: 'demo_jwt_token_queuemind_' + Date.now(),
      token_type: 'bearer',
      user: {
        id: isOperator ? 2 : 1,
        email: email,
        full_name: isOperator ? 'Service Counter Operator' : 'Facility Administrator',
        role: isOperator ? 'operator' : 'admin',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    });
  } catch {
    return NextResponse.json({
      access_token: 'demo_jwt_token',
      token_type: 'bearer',
      user: {
        id: 1,
        email: 'admin@queuemind.ai',
        full_name: 'Facility Administrator',
        role: 'admin',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    });
  }
}
