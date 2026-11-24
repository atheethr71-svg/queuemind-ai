import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json([
    { id: 1, facility_id: 1, name: 'Main Meal Counter', type: 'Food Service', max_capacity: 120 },
    { id: 2, facility_id: 1, name: 'Quick Snacks & Beverages', type: 'Express', max_capacity: 60 },
    { id: 3, facility_id: 2, name: 'OPD Patient Registration', type: 'Registration', max_capacity: 150 },
    { id: 4, facility_id: 2, name: 'Central Outpatient Pharmacy', type: 'Pharmacy', max_capacity: 80 },
  ]);
}
