import { NextResponse } from 'next/server';

export async function GET() {
  const csvData = [
    'Timestamp,Location ID,Metric Type,Value,Notes',
    `${new Date().toISOString()},1,Counter Served (Counter 1),95,Status: active, Avg Time: 4.2m`,
    `${new Date().toISOString()},1,Counter Served (Counter 2),88,Status: active, Avg Time: 5.0m`,
    `${new Date().toISOString()},1,Counter Served (Counter 3),79,Status: active, Avg Time: 4.8m`,
    `${new Date().toISOString()},1,Alert (critical),38,Queue length exceeded threshold`,
  ].join('\n');

  return new NextResponse(csvData, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename=queuemind_analytics_report.csv',
    },
  });
}
