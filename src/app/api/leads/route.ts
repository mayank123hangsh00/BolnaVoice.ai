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

    const supabaseLeads = (webhooks || []).map((w: any) => ({
      id: `lead_${w.id.substring(0, 8)}`,
      name: w.extracted_data?.lead_name || "Supabase Webhook Lead",
      phone: w.phone,
      email: "webhook@example.com",
      city: w.extracted_data?.preferred_location || "Unknown",
      source: "Bolna Voice Agent",
      status: w.extracted_data?.disposition === "qualified" ? "qualified" : "new",
      createdAt: w.created_at,
      updatedAt: w.created_at,
      qualification: w.extracted_data ? {
        interested: w.extracted_data.interested === "yes",
        budgetMin: w.extracted_data.budget_min,
        budgetMax: w.extracted_data.budget_max,
        preferredLocation: w.extracted_data.preferred_location,
        propertyType: w.extracted_data.property_type,
        timeline: w.extracted_data.timeline,
        wantsSiteVisit: w.extracted_data.wants_site_visit === "yes",
        disposition: w.extracted_data.disposition,
      } : undefined
    }));

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
