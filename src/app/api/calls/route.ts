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

    const supabaseCalls = (webhooks || []).map((w: any) => ({
      id: `call_${w.id.substring(0, 8)}`,
      leadId: `lead_${w.id.substring(0, 8)}`,
      leadName: w.extracted_data?.lead_name || "Supabase Webhook Lead",
      phoneNumber: w.phone,
      agentId: "agent_live_001",
      status: w.status,
      duration: w.duration,
      extractedData: w.extracted_data,
      summary: w.extracted_data ? `Lead ${w.extracted_data.disposition}. Budget: ${w.extracted_data.budget_min}-${w.extracted_data.budget_max}` : "Call processed",
      createdAt: w.created_at,
      completedAt: w.created_at,
    }));

    return NextResponse.json({ success: true, data: [...supabaseCalls, ...mockCalls] });
  } catch (error) {
    return NextResponse.json({ success: true, data: mockCalls });
  }
}
