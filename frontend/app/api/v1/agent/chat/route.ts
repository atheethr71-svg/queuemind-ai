import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const q = (body.message || '').toLowerCase();

    let content = '';
    const tools = [];

    if (q.includes('confirm') || q.includes('yes') || q.includes('apply') || q.includes('open counter')) {
      content = '✅ **Action Executed:** Opened Counter 3 successfully.\n\nActive counters increased from 2 to 3. Projected waiting time is reduced from 15.2m to 9.8m (-35%).';
      tools.push({ tool: 'apply_counter_change', result: { active_counters: 3, status: 'deployed' } });
    } else if (q.includes('how many') || q.includes('waiting') || q.includes('queue length')) {
      content = 'Currently, there are **18 people waiting** across active registration lanes.\n\n- **Active Counters:** 3 of 4\n- **Average Wait Time:** 11.4 minutes\n- **Crowd Density:** Moderate\n\nWould you like me to simulate opening another counter?';
      tools.push({ tool: 'get_queue_status', result: { total_waiting: 18, active_counters: 3 } });
    } else if (q.includes('should i open') || q.includes('open another') || q.includes('simulate')) {
      content = '📊 **Counter Allocation Simulation:**\n\n- **Current Wait:** 15.2 minutes (2 counters)\n- **Proposed Wait:** **9.8 minutes** (3 counters)\n- **Estimated Time Saved:** **5.4 minutes per person**\n- **Counter Utilisation:** 82%\n\n💡 **Recommendation:** Yes, opening an additional counter is highly recommended.\n\nReply **"Confirm"** or click "Apply" to open Counter 3 now.';
      tools.push({ tool: 'run_simulation', result: { time_saved: 5.4, proposed_wait: 9.8 } });
    } else if (q.includes('predict') || q.includes('next 30') || q.includes('forecast')) {
      content = '🔮 **30-Minute Predictive Forecast:**\n\n- **Expected Inflow:** +14 people\n- **Projected Wait Time:** **13.5 minutes** (with 3 counters active)\n- **Confidence Rating:** 92%\n\nThroughput will remain stable without threshold breaches.';
      tools.push({ tool: 'predict_waiting_time', result: { projected_wait: 13.5, confidence: 0.92 } });
    } else if (q.includes('summary') || q.includes('summarise') || q.includes('today')) {
      content = '📈 **Today’s Queue Performance Summary:**\n\n- **Total Served Today:** 342 people\n- **Average Service Duration:** 4.8 minutes\n- **Average Wait Time:** 11.4 minutes\n- **Queue Efficiency Score:** 91.5%\n- **Peak Congestion Window:** 12:00 PM – 2:00 PM';
      tools.push({ tool: 'get_analytics_summary', result: { served: 342, efficiency: 91.5 } });
    } else {
      content = 'Hello! I am your QueueMind Operations Agent. I monitor real-time queue lengths, compute M/M/c queueing formulas, evaluate counter throughput, and assist with operational adjustments.\n\nAsk me to **"Simulate opening an extra counter"** or **"Predict wait times for the next 30 minutes"**.';
    }

    return NextResponse.json({
      conversation_id: body.conversation_id || 1,
      message: {
        id: Date.now(),
        conversation_id: body.conversation_id || 1,
        role: 'assistant',
        content: content,
        tool_calls_json: { tools },
        created_at: new Date().toISOString(),
      },
      tool_results: tools,
    });
  } catch {
    return NextResponse.json({
      conversation_id: 1,
      message: {
        id: Date.now(),
        conversation_id: 1,
        role: 'assistant',
        content: 'QueueMind Agent is active in live simulation mode. Current queue volume is 18 people with 11.4 minutes expected wait.',
        created_at: new Date().toISOString(),
      },
      tool_results: [],
    });
  }
}
