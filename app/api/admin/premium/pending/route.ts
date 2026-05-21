import { NextRequest, NextResponse } from "next/server";
import { ApiError, botFetch } from "@/lib/api";
import { ADMIN_COOKIE_NAME, verifySession } from "@/lib/admin-session";

export async function GET(req: NextRequest) {
  if (!verifySession(req.cookies.get(ADMIN_COOKIE_NAME)?.value)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const data = await botFetch("/api/admin/premium/pending", { isAdmin: true, cache: "no-store" });
    return NextResponse.json(data);
  } catch (e) {
    if (e instanceof ApiError) return NextResponse.json({ error: e.message }, { status: e.status });
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
