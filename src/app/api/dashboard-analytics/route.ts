import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET() {
  // 1. Total requests this month
  const { data: totalRequestsMonthData } = await supabase.rpc('total_requests_this_month')
  // 2. Average completion time (hours)
  const { data: avgCompletionTimeData } = await supabase.rpc('average_completion_time_hours')
  // 3. Top 3 properties by requests
  const { data: topPropertiesData } = await supabase.rpc('top_properties_by_requests')
  // 4. Completion rate
  const { data: completionRateData } = await supabase.rpc('completion_rate')
  // 5. Monthly trend (last 6 months)
  const { data: monthlyTrendData } = await supabase.rpc('monthly_trend_last_6')

  return NextResponse.json({
    totalRequestsThisMonth: totalRequestsMonthData?.count ?? 0,
    averageCompletionTimeHours: avgCompletionTimeData?.avg_hours ?? null,
    topProperties: topPropertiesData ?? [],
    completionRate: completionRateData?.completion_rate ?? null,
    monthlyTrend: monthlyTrendData ?? []
  })
}

// Note: The SQL functions (RPCs) must be created in Supabase. If not present, I can provide the SQL for you to add them. 