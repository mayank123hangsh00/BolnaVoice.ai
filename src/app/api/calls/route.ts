import { NextResponse } from "next/server";
import { mockCalls } from "@/lib/data";

export async function GET() {
  return NextResponse.json({ success: true, data: mockCalls });
}
