import { NextResponse } from 'next/server';

let countersData = [
  { id: 1, location_id: 1, name: 'Counter 1 (Express)', status: 'active', served_today: 95, avg_service_time: 4.2 },
  { id: 2, location_id: 1, name: 'Counter 2 (General)', status: 'active', served_today: 88, avg_service_time: 5.0 },
  { id: 3, location_id: 1, name: 'Counter 3 (Billing)', status: 'active', served_today: 79, avg_service_time: 4.8 },
  { id: 4, location_id: 1, name: 'Counter 4 (Inquiry)', status: 'inactive', served_today: 42, avg_service_time: 5.5 },
];

export async function GET() {
  return NextResponse.json(countersData);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newCounter = {
      id: countersData.length + 1,
      location_id: 1,
      name: body.name || `Counter ${countersData.length + 1}`,
      status: 'active',
      served_today: 0,
      avg_service_time: body.avg_service_time || 5.0,
    };
    countersData.push(newCounter);
    return NextResponse.json(newCounter);
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 400 });
  }
}
