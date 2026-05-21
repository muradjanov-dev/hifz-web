import { NextResponse } from "next/server";
import { clearedSessionCookie } from "@/lib/admin-session";

export async function POST() {
  const c = clearedSessionCookie();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(c.name, c.value, { httpOnly: true, path: "/", maxAge: c.maxAgeSec });
  return res;
}
