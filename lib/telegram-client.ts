/**
 * Telegram WebApp client-side helpers. Runs in the browser (Mini App context).
 *
 * The @twa-dev/sdk loads only when window.Telegram.WebApp is present, i.e.
 * inside an actual Telegram Mini App. For local dev outside Telegram, we
 * stub the bare minimum so the page doesn't crash.
 */

"use client";

import type WebApp from "@twa-dev/sdk";

let _webApp: typeof WebApp | null = null;

export function getWebApp(): typeof WebApp | null {
  if (typeof window === "undefined") return null;
  if (_webApp) return _webApp;
  // Dynamic import avoids SSR errors.
  // The SDK reads window.Telegram, so it must run in the browser.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  _webApp = require("@twa-dev/sdk").default ?? null;
  return _webApp;
}

export function getInitData(): string {
  const wa = getWebApp();
  return wa?.initData ?? "";
}

export function getInitUser():
  | { id: number; first_name: string; last_name?: string; username?: string }
  | null {
  const wa = getWebApp();
  return wa?.initDataUnsafe?.user ?? null;
}

/** Tells Telegram the Mini App finished loading (hides the loading spinner). */
export function ready() {
  getWebApp()?.ready();
}

/** Expands the Mini App to full screen height inside Telegram. */
export function expand() {
  getWebApp()?.expand();
}

/** Whether we're running inside an actual Telegram Mini App context. */
export function isInTelegram(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean((window as unknown as { Telegram?: unknown }).Telegram);
}
