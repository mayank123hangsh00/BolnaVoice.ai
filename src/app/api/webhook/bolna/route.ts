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
  const call = mockCalls.find(
    (c) => c.phoneNumber === phoneNumber && c.status === "in-progress"
  );

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
