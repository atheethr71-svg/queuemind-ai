import { NextResponse } from 'next/server';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    return NextResponse.json({
      id: Number(params.id),
      status: body.status || 'active',
      name: body.name || `Counter ${params.id}`,
      updated_at: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 400 });
  }
}
