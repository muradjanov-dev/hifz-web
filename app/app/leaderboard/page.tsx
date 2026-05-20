"use client";

import { useState } from "react";
import { useApi } from "@/lib/use-api";
import { cn } from "@/lib/cn";

type Entry = {
  user_id: number;
  full_name?: string;
  username?: string;
  total_verses?: number;
  himmat_points?: number;
};

type Resp = {
  period: string;
  entries: Entry[];
};

const PERIODS: { key: "day" | "week" | "month" | "year" | "all"; label: string }[] = [
  { key: "day",   label: "Bugun" },
  { key: "week",  label: "Hafta" },
  { key: "month", label: "Oy" },
  { key: "year",  label: "Yil" },
  { key: "all",   label: "Umumiy" },
];

export default function LeaderboardPage() {
  const [period, setPeriod] = useState<typeof PERIODS[number]["key"]>("all");
  const { data, error, isLoading } = useApi<Resp>(`/api/leaderboard?period=${period}`);

  const entries = data?.entries || [];

  return (
    <div className="mx-auto max-w-md px-4 py-6">
      <header className="mb-5">
        <h1 className="text-xl font-semibold">🏆 Reyting</h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Top 50 yodlovchi
        </p>
      </header>

      {/* Period selector */}
      <div className="mb-5 flex gap-1 overflow-x-auto rounded-full bg-zinc-100 p-1 dark:bg-zinc-800">
        {PERIODS.map((p) => (
          <button
            key={p.key}
            onClick={() => setPeriod(p.key)}
            className={cn(
              "flex-1 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition",
              period === p.key
                ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-zinc-100"
                : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      {isLoading && <ListSkeleton />}
      {error && <p className="text-sm text-red-500">{(error as Error).message}</p>}

      {!isLoading && entries.length === 0 && (
        <div className="rounded-2xl border border-dashed border-zinc-300 p-8 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
          Hozircha ma&apos;lumot yo&apos;q
        </div>
      )}

      <ol className="space-y-2">
        {entries.map((e, idx) => (
          <li
            key={e.user_id}
            className={cn(
              "flex items-center gap-3 rounded-2xl border bg-white p-3 dark:bg-zinc-900",
              idx === 0 && "border-amber-300 bg-amber-50/40 dark:border-amber-700/50 dark:bg-amber-950/20",
              idx === 1 && "border-zinc-300/80 dark:border-zinc-700",
              idx === 2 && "border-orange-300/80 bg-orange-50/30 dark:border-orange-800/50 dark:bg-orange-950/20",
              idx > 2 && "border-zinc-200/80 dark:border-zinc-800/80"
            )}
          >
            <span
              className={cn(
                "flex size-8 items-center justify-center rounded-full text-sm font-semibold",
                idx === 0 && "bg-amber-400 text-white",
                idx === 1 && "bg-zinc-400 text-white",
                idx === 2 && "bg-orange-400 text-white",
                idx > 2 && "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
              )}
            >
              {idx + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">
                {e.full_name || "Anonim"}
              </p>
              {e.username && (
                <p className="truncate text-[11px] text-zinc-500 dark:text-zinc-400">
                  @{e.username}
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold">💎 {(e.himmat_points || 0).toLocaleString()}</p>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                📖 {e.total_verses || 0}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function ListSkeleton() {
  return (
    <div className="space-y-2">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="h-16 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
      ))}
    </div>
  );
}
