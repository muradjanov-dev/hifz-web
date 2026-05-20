import { NextRequest, NextResponse } from "next/server";
import { ApiError, botFetch } from "@/lib/api";

export async function GET(req: NextRequest) {
  const period = req.nextUrl.searchParams.get("period") || "all";
  try {
    const data = await botFetch(`/api/leaderboard?period=${encodeURIComponent(period)}`, {
      cache: "no-store",
    });
    return NextResponse.json(data);
  } catch (e) {
    if (e instanceof ApiError) {
      return NextResponse.json({ error: e.message }, { status: e.status });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
