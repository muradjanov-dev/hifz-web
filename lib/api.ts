/**
 * lib/api.ts — Server-side proxy to the bot's REST API.
 *
 * The webapp's Next.js Route Handlers (app/api/*) call these helpers to
 * forward requests to the bot service. The bot lives on Railway internal
 * network at `${BOT_API_URL}` (default: http://hifz-bot.railway.internal:8080).
 *
 * Two auth modes:
 *   - Mini App routes:  forward incoming X-Telegram-Init-Data header.
 *   - Admin routes:     attach Authorization: Bearer ADMIN_API_TOKEN.
 */

const BOT_API_URL = process.env.BOT_API_URL || "http://hifz-bot.railway.internal:8080";
const ADMIN_API_TOKEN = process.env.ADMIN_API_TOKEN || "";

type FetchOpts = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  initData?: string;
  isAdmin?: boolean;
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
};

export async function botFetch<T>(path: string, opts: FetchOpts = {}): Promise<T> {
  const { method = "GET", body, initData, isAdmin, cache, next } = opts;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (initData) headers["X-Telegram-Init-Data"] = initData;
  if (isAdmin)  headers["Authorization"]        = `Bearer ${ADMIN_API_TOKEN}`;

  const res = await fetch(`${BOT_API_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache,
    next,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new ApiError(res.status, text || res.statusText);
  }
  return res.json() as Promise<T>;
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}
