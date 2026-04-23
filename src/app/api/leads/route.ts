import { NextResponse } from "next/server";
import { mockLeads } from "@/lib/data";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { data: webhooks } = await supabase
      .from("bolna_webhooks")
      .select("*")
      .order("created_at", { ascending: false });

    const supabaseLeads = (webhooks || []).map((w: any) => {
      const ext = w.extracted_data?.["Lead Details"] || w.extracted_data || {};
      const getValue = (key: string) => ext[key]?.subjective || ext[key];
      
      return {
      id: `lead_${w.id.substring(0, 8)}`,
      name: getValue("lead_name") || "Supabase Webhook Lead",
      phone: w.phone,
      email: "webhook@example.com",
      city: getValue("preferred_location") || "Unknown",
      source: "Bolna Voice Agent",
      status: getValue("disposition") === "qualified" ? "qualified" : "new",
      createdAt: w.created_at,
      updatedAt: w.created_at,
      qualification: ext ? {
        interested: getValue("interested") === "yes",
        budgetMin: getValue("budget_min"),
        budgetMax: getValue("budget_max"),
        preferredLocation: getValue("preferred_location"),
        propertyType: getValue("property_type"),
        timeline: getValue("timeline"),
        wantsSiteVisit: getValue("wants_site_visit") === "yes",
        disposition: getValue("disposition"),
      } : undefined
    }});

    return NextResponse.json({ success: true, data: [...supabaseLeads, ...mockLeads] });
  } catch (error) {
    return NextResponse.json({ success: true, data: mockLeads });
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  const newLead = {
    id: `lead_${Math.random().toString(36).substring(2, 10)}`,
    name: body.name,
    phone: body.phone,
    email: body.email || "",
    city: body.city,
    source: body.source || "Website",
    status: "new" as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockLeads.unshift(newLead);
  return NextResponse.json({ success: true, data: newLead }, { status: 201 });
}
