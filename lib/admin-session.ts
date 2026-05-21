/**
 * lib/admin-session.ts — Lightweight signed-cookie session for the admin dashboard.
 *
 * Format: `${expiry_unix_ms}.${hmacSha256(expiry, SESSION_SECRET)}`
 * Stored in HttpOnly cookie. No DB lookups, no third-party deps.
 */

import { createHmac, timingSafeEqual } from "crypto";

const COOKIE_NAME = "hifz_admin";
const TTL_MS = 12 * 60 * 60 * 1000; // 12 hours
const SESSION_SECRET = process.env.SESSION_SECRET || "";

if (!SESSION_SECRET && process.env.NODE_ENV === "production") {
  console.warn("[admin-session] SESSION_SECRET is empty — admin cookies cannot be signed safely.");
}

function sign(payload: string): string {
  return createHmac("sha256", SESSION_SECRET).update(payload).digest("hex");
}

export function issueSessionCookie(): { name: string; value: string; maxAgeSec: number } {
  const expiry = Date.now() + TTL_MS;
  const payload = String(expiry);
  const value = `${payload}.${sign(payload)}`;
  return { name: COOKIE_NAME, value, maxAgeSec: Math.floor(TTL_MS / 1000) };
}

export function clearedSessionCookie(): { name: string; value: string; maxAgeSec: number } {
  return { name: COOKIE_NAME, value: "", maxAgeSec: 0 };
}

export function verifySession(cookieValue: string | undefined | null): boolean {
  if (!cookieValue || !SESSION_SECRET) return false;
  const [payload, signature] = cookieValue.split(".");
  if (!payload || !signature) return false;
  const expected = sign(payload);
  try {
    if (
      expected.length !== signature.length ||
      !timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(signature, "hex"))
    ) {
      return false;
    }
  } catch {
    return false;
  }
  const expiry = Number(payload);
  if (!Number.isFinite(expiry) || expiry < Date.now()) return false;
  return true;
}

export const ADMIN_COOKIE_NAME = COOKIE_NAME;
