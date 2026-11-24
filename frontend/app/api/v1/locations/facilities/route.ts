import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json([
    {
      id: 1,
      name: 'Central College Canteen',
      type: 'College Campus',
      address: 'Building B, Food Court',
      locations: [
        { id: 1, name: 'Main Meal Counter', type: 'Food Service', max_capacity: 120 },
        { id: 2, name: 'Quick Snacks & Beverages', type: 'Express', max_capacity: 60 },
      ],
    },
    {
      id: 2,
      name: 'City General Hospital',
      type: 'Healthcare',
      address: 'North Wing, Level 1',
      locations: [
        { id: 3, name: 'OPD Patient Registration', type: 'Registration', max_capacity: 150 },
        { id: 4, name: 'Central Outpatient Pharmacy', type: 'Pharmacy', max_capacity: 80 },
      ],
    },
    {
      id: 3,
      name: 'Metro Commercial Bank',
      type: 'Banking & Finance',
      address: 'Downtown Financial Plaza',
      locations: [
        { id: 5, name: 'Cash Deposit & Withdrawal', type: 'Teller', max_capacity: 90 },
      ],
    },
  ]);
}
