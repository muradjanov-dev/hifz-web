import { NextRequest, NextResponse } from "next/server";
import { ApiError, botFetch } from "@/lib/api";

export async function POST(req: NextRequest) {
  const initData = req.headers.get("x-telegram-init-data") || "";
  if (!initData) return NextResponse.json({ error: "Missing initData" }, { status: 401 });
  try {
    const data = await botFetch("/api/me/session/advance", {
      method: "POST",
      initData,
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
