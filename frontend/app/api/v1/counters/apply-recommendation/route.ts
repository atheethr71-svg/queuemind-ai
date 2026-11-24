import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const proposed = body.proposed_counters || 3;
    return NextResponse.json({
      status: 'success',
      message: `Successfully deployed updated counter layout. ${proposed} counter(s) are now active.`,
      active_counters: proposed,
      total_counters: 4,
    });
  } catch {
    return NextResponse.json({ status: 'success', active_counters: 3 });
  }
}
