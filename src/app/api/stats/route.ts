import { NextResponse } from "next/server";
import { getDashboardStats, getDailyCallData } from "@/lib/data";
import { supabase } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

export async function GET() {
  const stats = getDashboardStats();
  
  try {
    const { data: webhooks } = await supabase.from("bolna_webhooks").select("*");
    if (webhooks && webhooks.length > 0) {
      stats.totalLeads += webhooks.length;
      stats.totalCalls += webhooks.length;
      stats.leadsToday += webhooks.length;
      stats.callsToday += webhooks.length;
      stats.qualifiedLeads += webhooks.filter(w => {
        const ext = w.extracted_data?.["Lead Details"] || w.extracted_data || {};
        return (ext.disposition?.subjective || ext.disposition) === 'qualified';
      }).length;
    }
  } catch (error) {}

  return NextResponse.json({
    success: true,
    data: {
      stats,
      dailyData: getDailyCallData(),
    },
  });
}
