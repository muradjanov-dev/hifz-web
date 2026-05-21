import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { issueSessionCookie } from "@/lib/admin-session";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";

export async function POST(req: NextRequest) {
  let body: { password?: string } = {};
  try { body = await req.json(); } catch {}
  const submitted = (body.password ?? "").trim();

  if (!ADMIN_PASSWORD) {
    return NextResponse.json(
      { error: "ADMIN_PASSWORD env var is not set on the server." },
      { status: 503 }
    );
  }

  const a = Buffer.from(submitted);
  const b = Buffer.from(ADMIN_PASSWORD);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return NextResponse.json({ error: "Noto‘g‘ri parol" }, { status: 401 });
  }

  const cookie = issueSessionCookie();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(cookie.name, cookie.value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: cookie.maxAgeSec,
  });
  return res;
}
