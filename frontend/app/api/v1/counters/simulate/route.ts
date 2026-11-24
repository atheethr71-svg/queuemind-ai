import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const queueLength = body.queue_length ?? 24;
    const currentCounters = Math.max(1, body.current_counters ?? 2);
    const proposedCounters = Math.max(1, body.proposed_counters ?? 3);
    const avgServiceTime = Math.max(0.5, body.avg_service_time_minutes ?? 5.0);
    const incomingPeople = body.incoming_people ?? 10;

    const svcRatePerMin = 1.0 / avgServiceTime;
    const totalVolume = queueLength + incomingPeople;
    const curWait = Number((totalVolume / (currentCounters * svcRatePerMin)).toFixed(1));
    const propWait = Number((totalVolume / (proposedCounters * svcRatePerMin)).toFixed(1));
    const timeSaved = Number(Math.max(0, curWait - propWait).toFixed(1));
    const util = Math.min(100, Math.round(((totalVolume / (proposedCounters * 20)) * 100)));

    const diff = proposedCounters - currentCounters;
    const rec = diff > 0
      ? `Opening ${diff} additional counter(s) yields an estimated wait time reduction of ${timeSaved} minutes per person.`
      : `Maintaining ${proposedCounters} counters yields an estimated wait time of ${propWait} minutes.`;

    return NextResponse.json({
      location_id: body.location_id || 1,
      current_counters: currentCounters,
      proposed_counters: proposedCounters,
      current_wait: curWait,
      predicted_wait: propWait,
      time_saved: timeSaved,
      utilisation: util,
      recommendation: rec,
      created_at: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({ error: 'Simulation failed' }, { status: 400 });
  }
}
