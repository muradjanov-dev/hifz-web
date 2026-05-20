"use client";

import useSWR, { type SWRConfiguration } from "swr";
import { getInitData } from "@/lib/telegram-client";

async function fetcher(path: string): Promise<unknown> {
  const headers: Record<string, string> = {};
  const initData = getInitData();
  if (initData) headers["X-Telegram-Init-Data"] = initData;
  const res = await fetch(path, { headers, cache: "no-store" });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export function useApi<T>(path: string | null, opts?: SWRConfiguration<T>) {
  return useSWR<T>(path, fetcher as (p: string) => Promise<T>, opts);
}
