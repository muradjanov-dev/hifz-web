"use client";

import { useApi } from "@/lib/use-api";

type Achievement = {
  achievement_key?: string;
  title?: string;
  description?: string;
  xp_reward?: number;
  unlocked_at?: string;
};

type Resp = {
  unlocked: Achievement[];
};

export default function AchievementsPage() {
  const { data, error, isLoading } = useApi<Resp>("/api/me/achievements");

  return (
    <div className="mx-auto max-w-md px-4 py-6">
      <header className="mb-5">
        <h1 className="text-xl font-semibold">⭐ Yutuqlarim</h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          {data?.unlocked?.length ?? 0} yutuq qo&apos;lga kiritildi
        </p>
      </header>

      {isLoading && (
        <div className="grid grid-cols-2 gap-3">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
          ))}
        </div>
      )}

      {error && <p className="text-sm text-red-500">{(error as Error).message}</p>}

      {!isLoading && data && data.unlocked.length === 0 && (
        <div className="rounded-2xl border border-dashed border-zinc-300 p-8 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
          Hozircha yutuq yo&apos;q. Birinchi oyatdan boshlang!
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        {data?.unlocked.map((a) => (
          <article
            key={a.achievement_key}
            className="rounded-2xl border border-zinc-200/80 bg-white p-4 dark:border-zinc-800/80 dark:bg-zinc-900"
          >
            <div className="mb-2 flex size-12 items-center justify-center rounded-xl bg-emerald-50 text-2xl dark:bg-emerald-950/40">
              🏆
            </div>
            <h3 className="text-sm font-semibold leading-tight">{a.title || a.achievement_key}</h3>
            {a.description && (
              <p className="mt-1 text-[11px] leading-snug text-zinc-500 dark:text-zinc-400">
                {a.description}
              </p>
            )}
            {(a.xp_reward ?? 0) > 0 && (
              <p className="mt-2 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                +{a.xp_reward} 💎
              </p>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
