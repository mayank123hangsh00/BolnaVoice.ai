import { NextResponse } from "next/server";
import { mockLeads } from "@/lib/data";

export async function GET() {
  return NextResponse.json({ success: true, data: mockLeads });
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
