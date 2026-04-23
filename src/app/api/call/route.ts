import { NextResponse } from "next/server";
import { mockLeads, mockCalls } from "@/lib/data";
import { CallRecord } from "@/lib/types";

// Simulates triggering a Bolna API call
export async function POST(request: Request) {
  const body = await request.json();
  const { leadId, agentId } = body;

  const lead = mockLeads.find((l) => l.id === leadId);
  if (!lead) {
    return NextResponse.json(
      { success: false, error: "Lead not found" },
      { status: 404 }
    );
  }

  // Check if BOLNA_API_KEY is configured
  const bolnaApiKey = process.env.BOLNA_API_KEY;

  if (bolnaApiKey) {
    // =============================================
    // REAL Bolna API Integration
    // =============================================
    try {
      const response = await fetch("https://api.bolna.ai/call", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${bolnaApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          agent_id: agentId || process.env.BOLNA_AGENT_ID,
          recipient_phone_number: lead.phone,
          variables: {
            lead_name: lead.name,
            lead_city: lead.city,
          },
        }),
      });

      const data = await response.json();

      if (response.ok) {
        lead.status = "calling";
        lead.updatedAt = new Date().toISOString();

        const callRecord: CallRecord = {
          id: `call_${Math.random().toString(36).substring(2, 10)}`,
          leadId: lead.id,
          leadName: lead.name,
          phoneNumber: lead.phone,
          agentId: agentId || "agent_demo_001",
          status: "in-progress",
          createdAt: new Date().toISOString(),
        };
        mockCalls.unshift(callRecord);

        return NextResponse.json({
          success: true,
          data: { callId: callRecord.id, bolnaResponse: data },
          message: "Call initiated via Bolna API",
        });
      } else {
        return NextResponse.json(
          { success: false, error: `Bolna API error: ${JSON.stringify(data)}` },
          { status: response.status }
        );
      }
    } catch (err) {
      return NextResponse.json(
        { success: false, error: `Bolna API connection failed: ${err}` },
        { status: 500 }
      );
    }
  } else {
    // =============================================
    // DEMO MODE — Simulate a call
    // =============================================
    lead.status = "calling";
    lead.updatedAt = new Date().toISOString();

    const callRecord: CallRecord = {
      id: `call_${Math.random().toString(36).substring(2, 10)}`,
      leadId: lead.id,
      leadName: lead.name,
      phoneNumber: lead.phone,
      agentId: agentId || "agent_demo_001",
      status: "in-progress",
      createdAt: new Date().toISOString(),
    };
    mockCalls.unshift(callRecord);

    // Simulate call completion after a delay
    setTimeout(() => {
      const outcomes = ["qualified", "not_interested", "callback", "no_answer"] as const;
      const outcome = outcomes[Math.floor(Math.random() * outcomes.length)];

      callRecord.status = "completed";
      callRecord.duration = Math.floor(Math.random() * 150) + 30;
      callRecord.completedAt = new Date().toISOString();

      lead.status = outcome;
      lead.updatedAt = new Date().toISOString();

      if (outcome === "qualified") {
        lead.qualification = {
          interested: true,
          budgetMin: `${(Math.floor(Math.random() * 5) + 3) * 10}L`,
          budgetMax: `${(Math.floor(Math.random() * 5) + 8) * 10}L`,
          preferredLocation: ["Whitefield", "Bandra", "Hinjewadi", "Gurgaon"][
            Math.floor(Math.random() * 4)
          ],
          propertyType: (["apartment", "villa", "plot"] as const)[Math.floor(Math.random() * 3)],
          timeline: ["1-3 months", "3-6 months", "6-12 months"][Math.floor(Math.random() * 3)],
          wantsSiteVisit: Math.random() > 0.4,
          disposition: "qualified",
        };
        callRecord.summary = `Lead qualified. Budget: ${lead.qualification.budgetMin}-${lead.qualification.budgetMax}. Location: ${lead.qualification.preferredLocation}. Property: ${lead.qualification.propertyType}. Timeline: ${lead.qualification.timeline}.`;
        callRecord.transcript = `AI: Hello ${lead.name}, this is Priya from PropConnect Realty. I noticed you were interested in properties in ${lead.city}. Is this a good time to chat?\n\n${lead.name}: Yes, sure.\n\nAI: Great! What area are you looking at?\n\n${lead.name}: I'm interested in ${lead.qualification.preferredLocation}.\n\nAI: And what's your approximate budget?\n\n${lead.name}: Around ${lead.qualification.budgetMin} to ${lead.qualification.budgetMax}.\n\nAI: What type of property are you looking for?\n\n${lead.name}: A ${lead.qualification.propertyType}.\n\nAI: When are you planning to buy?\n\n${lead.name}: In about ${lead.qualification.timeline}.\n\nAI: Would you like to schedule a site visit?\n\n${lead.name}: ${lead.qualification.wantsSiteVisit ? "Yes, that would be great!" : "Maybe later."}\n\nAI: Thank you ${lead.name}! Our team will reach out shortly.`;
        callRecord.extractedData = {
          lead_name: lead.name,
          interested: "yes",
          budget_min: lead.qualification.budgetMin || "",
          budget_max: lead.qualification.budgetMax || "",
          preferred_location: lead.qualification.preferredLocation || "",
          property_type: lead.qualification.propertyType || "",
          timeline: lead.qualification.timeline || "",
          wants_site_visit: lead.qualification.wantsSiteVisit ? "yes" : "no",
          disposition: "qualified",
        };
      } else if (outcome === "not_interested") {
        callRecord.summary = "Lead indicated they are not currently in the market.";
      } else if (outcome === "callback") {
        callRecord.summary = "Lead requested a callback at a later time.";
      } else {
        callRecord.summary = "No answer — call went unanswered after multiple rings.";
      }
    }, 5000 + Math.random() * 5000); // 5-10 seconds

    return NextResponse.json({
      success: true,
      data: { callId: callRecord.id },
      message: "Demo call initiated (no BOLNA_API_KEY configured). Call will auto-complete in ~8s.",
    });
  }
}
