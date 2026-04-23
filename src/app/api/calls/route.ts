import { NextResponse } from "next/server";
import { mockCalls } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ success: true, data: mockCalls });
}
