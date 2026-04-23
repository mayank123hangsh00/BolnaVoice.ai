import { NextResponse } from "next/server";
import { mockLeads, mockCalls } from "@/lib/data";

// Webhook endpoint that Bolna calls when a call event occurs
export async function POST(request: Request) {
  const payload = await request.json();

  console.log("[Bolna Webhook] Received:", JSON.stringify(payload, null, 2));

  const executionId = payload.execution_id;
  const status = payload.status;
  const extractedData = payload.extracted_data;
  const transcript = payload.transcript;
  const duration = payload.duration;
  const phoneNumber = payload.call_data?.recipient_phone_number;

  // Find the matching call record
  let call = mockCalls.find(
    (c) => c.phoneNumber === phoneNumber && c.status === "in-progress"
  );

  // Auto-create a lead and call record if Bolna initiates an unexpected call
  if (!call) {
    const newLeadId = `lead_live_${Math.random().toString(36).substring(2, 8)}`;
    const newLead: any = {
      id: newLeadId,
      name: "Live Webhook Test",
      phone: phoneNumber || "+1234567890",
      city: "Unknown",
      source: "Bolna Agent",
      status: "new",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockLeads.unshift(newLead);

    call = {
      id: `call_live_${Math.random().toString(36).substring(2, 8)}`,
      leadId: newLeadId,
      leadName: "Live Webhook Test",
      phoneNumber: phoneNumber || "+1234567890",
      agentId: payload.agent_id || "demo_agent",
      status: "in-progress",
      createdAt: new Date().toISOString(),
    };
    mockCalls.unshift(call);
  }

  if (call) {
    call.status = status === "completed" ? "completed" : "failed";
    call.duration = duration;
    call.transcript = transcript;
    call.extractedData = extractedData;
    call.completedAt = new Date().toISOString();

    if (extractedData) {
      call.summary = `Lead ${extractedData.disposition || "processed"}. ${
        extractedData.interested === "yes"
          ? `Budget: ${extractedData.budget_min}-${extractedData.budget_max}. Location: ${extractedData.preferred_location}. Type: ${extractedData.property_type}.`
          : "Not interested at this time."
      }`;
    }

    // Update the lead
    const lead = mockLeads.find((l) => l.id === call.leadId);
    if (lead && extractedData) {
      const disposition = extractedData.disposition || "qualified";
      if (disposition === "qualified") {
        lead.status = "qualified";
        lead.qualification = {
          interested: extractedData.interested === "yes",
          budgetMin: extractedData.budget_min,
          budgetMax: extractedData.budget_max,
          preferredLocation: extractedData.preferred_location,
          propertyType: extractedData.property_type as "apartment" | "villa" | "plot" | "commercial",
          timeline: extractedData.timeline,
          wantsSiteVisit: extractedData.wants_site_visit === "yes",
          disposition,
        };
      } else if (disposition === "not_interested") {
        lead.status = "not_interested";
      } else if (disposition === "callback") {
        lead.status = "callback";
      } else {
        lead.status = "wrong_number";
      }
      lead.updatedAt = new Date().toISOString();
    }
  }

  return NextResponse.json({ success: true, message: "Webhook processed" });
}
