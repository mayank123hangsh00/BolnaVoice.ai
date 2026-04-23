import { NextResponse } from "next/server";
import { mockCalls } from "@/lib/data";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { data: webhooks } = await supabase
      .from("bolna_webhooks")
      .select("*")
      .order("created_at", { ascending: false });

    const supabaseCalls = (webhooks || []).map((w: any) => {
      const ext = w.extracted_data?.["Lead Details"] || w.extracted_data || {};
      const getValue = (key: string) => ext[key]?.subjective || ext[key];
      const disposition = getValue("disposition");
      const budgetMin = getValue("budget_min");
      const budgetMax = getValue("budget_max");

      const flattenedData = w.extracted_data?.["Lead Details"] 
        ? Object.fromEntries(Object.entries(w.extracted_data["Lead Details"]).map(([k,v]:any) => [k, v?.subjective || v]))
        : w.extracted_data;

      return {
      id: `call_${w.id.substring(0, 8)}`,
      leadId: `lead_${w.id.substring(0, 8)}`,
      leadName: getValue("lead_name") || "Supabase Webhook Lead",
      phoneNumber: w.phone,
      agentId: "agent_live_001",
      status: w.status,
      duration: w.duration,
      extractedData: flattenedData,
      summary: disposition ? `Lead ${disposition}. Budget: ${budgetMin}-${budgetMax}` : "Call processed",
      transcript: w.transcript || null,
      createdAt: w.created_at,
      completedAt: w.created_at,
    }});

    return NextResponse.json({ success: true, data: [...supabaseCalls, ...mockCalls] });
  } catch (error) {
    return NextResponse.json({ success: true, data: mockCalls });
  }
}
