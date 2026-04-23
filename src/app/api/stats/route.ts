import { NextResponse } from "next/server";
import { getDashboardStats, getDailyCallData } from "@/lib/data";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      stats: getDashboardStats(),
      dailyData: getDailyCallData(),
    },
  });
}
