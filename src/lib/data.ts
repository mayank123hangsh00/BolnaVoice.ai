import {
  Lead,
  LeadStatus,
  CallRecord,
  CallStatus,
  DashboardStats,
  DailyCallData,
  AgentConfig,
} from "./types";

// ============================================================
// Mock Data Store (simulates a database)
// ============================================================

const CITIES = ["Mumbai", "Bangalore", "Pune", "Delhi NCR", "Hyderabad", "Chennai"];
const SOURCES = ["99acres", "MagicBricks", "Housing.com", "Website", "Referral", "Walk-in"];
const NAMES = [
  "Rahul Sharma", "Priya Patel", "Amit Verma", "Sneha Gupta", "Vikram Singh",
  "Anjali Reddy", "Rohan Mehta", "Kavya Nair", "Arun Kumar", "Deepika Joshi",
  "Manish Tiwari", "Neha Saxena", "Suresh Rajan", "Pooja Malhotra", "Karthik Iyer",
];

function randomId(): string {
  return Math.random().toString(36).substring(2, 10);
}

function randomPhone(): string {
  return `+91${Math.floor(7000000000 + Math.random() * 2999999999)}`;
}

function randomDate(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - Math.floor(Math.random() * daysAgo));
  d.setHours(Math.floor(Math.random() * 12) + 8);
  d.setMinutes(Math.floor(Math.random() * 60));
  return d.toISOString();
}

const STATUS_POOL: LeadStatus[] = [
  "new", "new", "new", "qualified", "qualified", "not_interested",
  "callback", "calling", "no_answer", "wrong_number",
];

// Generate mock leads
export const mockLeads: Lead[] = NAMES.map((name, i) => {
  const status = STATUS_POOL[i % STATUS_POOL.length];
  const lead: Lead = {
    id: `lead_${randomId()}`,
    name,
    phone: randomPhone(),
    email: `${name.toLowerCase().replace(/\s/g, ".")}@gmail.com`,
    city: CITIES[i % CITIES.length],
    source: SOURCES[i % SOURCES.length],
    status,
    createdAt: randomDate(14),
    updatedAt: randomDate(7),
  };

  if (status === "qualified") {
    lead.qualification = {
      interested: true,
      budgetMin: `${(Math.floor(Math.random() * 5) + 3) * 10}L`,
      budgetMax: `${(Math.floor(Math.random() * 5) + 8) * 10}L`,
      preferredLocation: ["Whitefield", "Bandra West", "Hinjewadi", "Gurgaon", "HITEC City"][i % 5],
      propertyType: (["apartment", "villa", "plot", "commercial"] as const)[i % 4],
      timeline: ["1-3 months", "3-6 months", "6-12 months", "Immediate"][i % 4],
      wantsSiteVisit: Math.random() > 0.3,
      disposition: "qualified",
    };
  }

  return lead;
});

// Generate mock calls
export const mockCalls: CallRecord[] = mockLeads
  .filter((l) => l.status !== "new")
  .map((lead) => ({
    id: `call_${randomId()}`,
    leadId: lead.id,
    leadName: lead.name,
    phoneNumber: lead.phone,
    agentId: "agent_demo_001",
    status: (lead.status === "qualified" ? "completed" : lead.status === "calling" ? "in-progress" : "completed") as CallStatus,
    duration: lead.status === "calling" ? undefined : Math.floor(Math.random() * 180) + 30,
    transcript:
      lead.status === "qualified"
        ? `AI: Hello ${lead.name}, this is Priya from PropConnect Realty. I noticed you were looking at properties in ${lead.city}. Is this a good time to chat?\n\n${lead.name}: Yes, sure. I've been looking for a while now.\n\nAI: That's great to hear! Could you tell me what area within ${lead.city} you're most interested in?\n\n${lead.name}: I'm looking at ${lead.qualification?.preferredLocation || "the central area"}.\n\nAI: Wonderful choice! And what's your approximate budget range?\n\n${lead.name}: Around ${lead.qualification?.budgetMin} to ${lead.qualification?.budgetMax}.\n\nAI: Perfect. Are you looking for an apartment, villa, or a plot?\n\n${lead.name}: I'd prefer a ${lead.qualification?.propertyType || "2BHK apartment"}.\n\nAI: When are you planning to make the purchase?\n\n${lead.name}: Within the next ${lead.qualification?.timeline || "few months"}.\n\nAI: Would you be interested in scheduling a site visit with our team?\n\n${lead.name}: ${lead.qualification?.wantsSiteVisit ? "Yes, that would be great!" : "Not right now, maybe later."}\n\nAI: Thank you so much, ${lead.name}! Our team will reach out shortly to assist you further. Have a wonderful day!`
        : undefined,
    summary:
      lead.status === "qualified"
        ? `Lead qualified. Interested in ${lead.qualification?.propertyType} in ${lead.qualification?.preferredLocation}. Budget: ${lead.qualification?.budgetMin}-${lead.qualification?.budgetMax}. Timeline: ${lead.qualification?.timeline}.`
        : lead.status === "not_interested"
        ? "Lead not interested at this time."
        : lead.status === "no_answer"
        ? "No answer after multiple rings."
        : undefined,
    extractedData:
      lead.status === "qualified" && lead.qualification
        ? {
            lead_name: lead.name,
            interested: "yes",
            budget_min: lead.qualification.budgetMin || "",
            budget_max: lead.qualification.budgetMax || "",
            preferred_location: lead.qualification.preferredLocation || "",
            property_type: lead.qualification.propertyType || "",
            timeline: lead.qualification.timeline || "",
            wants_site_visit: lead.qualification.wantsSiteVisit ? "yes" : "no",
            disposition: "qualified",
          }
        : undefined,
    createdAt: lead.updatedAt,
    completedAt:
      lead.status !== "calling"
        ? new Date(new Date(lead.updatedAt).getTime() + (Math.floor(Math.random() * 180) + 30) * 1000).toISOString()
        : undefined,
  }));

// Default agent config
export const defaultAgentConfig: AgentConfig = {
  id: "agent_demo_001",
  name: "PropConnect Lead Qualifier",
  welcomeMessage: "Hello {lead_name}, this is Priya from PropConnect Realty. I noticed you were looking at properties in {lead_city}. Is this a good time for a quick chat?",
  systemPrompt: `**Personality:** You are Priya, a warm and professional real estate consultant at PropConnect Realty. You speak clearly, are empathetic, and naturally conversational. Keep responses concise (2-3 sentences max).

**Context:** You are calling {lead_name} who expressed interest in buying a property in {lead_city}. Your goal is to qualify this lead by gathering key information.

**Instructions:**
1. Greet the person warmly and introduce yourself
2. Confirm they are looking for a property
3. Ask about their preferred LOCATION within {lead_city}
4. Ask about their BUDGET range
5. Ask about their preferred PROPERTY TYPE (apartment/villa/plot)
6. Ask about their TIMELINE (when they plan to buy)
7. Ask if they'd like to schedule a site visit
8. Thank them and confirm next steps

**Guardrails:**
- Never discuss competitor properties or agents
- Never make price guarantees or commitments
- If asked about legal matters, say you'll connect them with the team
- If the person is not interested, thank them politely and end the call
- Stay on topic — do not discuss unrelated subjects
- Do not speak more than 3 sentences at a time`,
  extractionPrompt: JSON.stringify(
    {
      lead_name: "Name of the person",
      interested: "yes/no",
      budget_min: "Minimum budget mentioned",
      budget_max: "Maximum budget mentioned",
      preferred_location: "Preferred area/locality",
      property_type: "apartment/villa/plot/commercial",
      timeline: "When they plan to buy",
      wants_site_visit: "yes/no",
      disposition: "qualified/not_interested/callback/wrong_number",
    },
    null,
    2
  ),
  webhookUrl: "",
  llmModel: "gpt-4o",
  voiceProvider: "elevenlabs",
  voiceId: "pNInz6obpgDQGcFmaJgB",
  language: "en",
};

// ============================================================
// Dashboard Stats
// ============================================================
export function getDashboardStats(): DashboardStats {
  const totalLeads = mockLeads.length;
  const qualifiedLeads = mockLeads.filter((l) => l.status === "qualified").length;
  const totalCalls = mockCalls.length;
  const completedCalls = mockCalls.filter((c) => c.status === "completed" && c.duration);
  const avgDuration =
    completedCalls.length > 0
      ? Math.round(completedCalls.reduce((sum, c) => sum + (c.duration || 0), 0) / completedCalls.length)
      : 0;

  return {
    totalLeads,
    qualifiedLeads,
    totalCalls,
    avgCallDuration: avgDuration,
    conversionRate: totalLeads > 0 ? Math.round((qualifiedLeads / totalLeads) * 100) : 0,
    responseTime: 2,
    callsToday: Math.floor(Math.random() * 5) + 3,
    leadsToday: Math.floor(Math.random() * 8) + 5,
  };
}

export function getDailyCallData(): DailyCallData[] {
  const data: DailyCallData[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    data.push({
      date: d.toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
      calls: Math.floor(Math.random() * 25) + 5,
      qualified: Math.floor(Math.random() * 12) + 2,
    });
  }
  return data;
}
