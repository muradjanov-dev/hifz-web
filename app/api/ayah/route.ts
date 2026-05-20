import { NextRequest, NextResponse } from "next/server";
import { ApiError, botFetch } from "@/lib/api";

export async function GET(req: NextRequest) {
  const qs = req.nextUrl.searchParams.toString();
  try {
    const data = await botFetch(`/api/ayah?${qs}`, {
      next: { revalidate: 3600 }, // ayah text rarely changes
    });
    return NextResponse.json(data);
  } catch (e) {
    if (e instanceof ApiError) {
      return NextResponse.json({ error: e.message }, { status: e.status });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
