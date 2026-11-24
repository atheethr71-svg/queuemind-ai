import { NextResponse } from 'next/server';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  return NextResponse.json({
    id: Number(params.id),
    is_acknowledged: true,
    acknowledged_at: new Date().toISOString(),
  });
}
