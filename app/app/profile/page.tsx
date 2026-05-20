"use client";

import { useApi } from "@/lib/use-api";

type Profile = {
  full_name?: string;
  total_verses?: number;
  total_reps?: number;
  total_time?: string;
  himmat?: number;
  himmat_fmt?: string;
  streak?: number;
  longest_streak?: number;
  level_num?: number;
  level_name?: string;
  rank?: number;
  percent_complete?: number;
  is_premium?: boolean;
  premium_expiry?: string;
  current_surah?: number;
  current_ayah?: number;
  completed_surahs?: number[];
  completed_juz?: number[];
  today_stats?: { verses_read?: number; minutes?: number };
  week_stats?:  { verses_read?: number; minutes?: number };
  month_stats?: { verses_read?: number; minutes?: number };
  year_stats?:  { verses_read?: number; minutes?: number };
  referral_count?: number;
};

export default function ProfilePage() {
  const { data, error, isLoading } = useApi<Profile>("/api/me");

  if (isLoading) return <Skeleton />;
  if (error)     return <p className="mx-auto max-w-md p-6 text-sm text-red-500">{(error as Error).message}</p>;
  if (!data)     return null;

  return (
    <div className="mx-auto max-w-md px-4 py-6 space-y-5">
      <header>
        <h1 className="text-xl font-semibold">📊 Mening sahifam</h1>
      </header>

      {/* Identity card */}
      <section className="rounded-2xl border border-zinc-200/80 bg-white p-5 dark:border-zinc-800/80 dark:bg-zinc-900">
        <div className="flex items-center gap-4">
          <div className="flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-2xl font-semibold text-white">
            {(data.full_name || "F")[0]?.toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-base font-semibold">{data.full_name || "Foydalanuvchi"}</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {data.level_name || "Level 1"} · #{data.rank ?? "—"} reyting
            </p>
          </div>
          {data.is_premium && (
            <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-medium text-amber-800 dark:bg-amber-950 dark:text-amber-300">
              💎 Premium
            </span>
          )}
        </div>
        {data.is_premium && data.premium_expiry && (
          <p className="mt-3 text-[11px] text-zinc-500 dark:text-zinc-400">
            Premium amal qiladi: {data.premium_expiry} gacha
          </p>
        )}
      </section>

      {/* Period stats */}
      <section>
        <h2 className="mb-3 px-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Vaqt bo&apos;yicha statistika
        </h2>
        <div className="space-y-2">
          <PeriodRow label="Bugun" stats={data.today_stats} />
          <PeriodRow label="Hafta" stats={data.week_stats} />
          <PeriodRow label="Oy"    stats={data.month_stats} />
          <PeriodRow label="Yil"   stats={data.year_stats} />
        </div>
      </section>

      {/* Totals */}
      <section>
        <h2 className="mb-3 px-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">Jami</h2>
        <div className="grid grid-cols-2 gap-3">
          <Tile label="Oyat"          value={String(data.total_verses ?? 0)} />
          <Tile label="Takror"         value={String(data.total_reps ?? 0)} />
          <Tile label="Vaqt"           value={data.total_time || "0 daq."} />
          <Tile label="Himmat"         value={data.himmat_fmt || String(data.himmat ?? 0)} />
          <Tile label="Streak"         value={`${data.streak ?? 0} kun`} />
          <Tile label="Eng uzun"        value={`${data.longest_streak ?? 0} kun`} />
          <Tile label="Sura"           value={`${data.completed_surahs?.length ?? 0}/114`} />
          <Tile label="Juz"            value={`${data.completed_juz?.length ?? 0}/30`} />
        </div>
      </section>

      {/* Current memo */}
      {data.current_surah && (
        <section className="rounded-2xl border border-emerald-200/80 bg-emerald-50/50 p-4 dark:border-emerald-800/40 dark:bg-emerald-950/20">
          <p className="text-xs text-emerald-800 dark:text-emerald-300">Joriy yodlash</p>
          <p className="mt-1 text-sm font-semibold">
            Sura {data.current_surah}, oyat {data.current_ayah}
          </p>
        </section>
      )}

      {/* Referrals */}
      {(data.referral_count ?? 0) > 0 && (
        <section className="rounded-2xl border border-zinc-200/80 bg-white p-4 dark:border-zinc-800/80 dark:bg-zinc-900">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Taklif qilgan</p>
          <p className="mt-1 text-lg font-semibold">{data.referral_count} do&apos;st</p>
        </section>
      )}
    </div>
  );
}

function Tile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-zinc-200/80 bg-white p-3 dark:border-zinc-800/80 dark:bg-zinc-900">
      <p className="text-[11px] text-zinc-500 dark:text-zinc-400">{label}</p>
      <p className="mt-0.5 text-lg font-semibold leading-tight">{value}</p>
    </div>
  );
}

function PeriodRow({
  label,
  stats,
}: {
  label: string;
  stats?: { verses_read?: number; minutes?: number };
}) {
  const v = stats?.verses_read ?? 0;
  const m = stats?.minutes ?? 0;
  return (
    <div className="flex items-center justify-between rounded-xl border border-zinc-200/80 bg-white px-4 py-3 dark:border-zinc-800/80 dark:bg-zinc-900">
      <span className="text-sm font-medium">{label}</span>
      <div className="flex gap-4 text-xs">
        <span className="text-zinc-600 dark:text-zinc-400">📖 {v} oyat</span>
        <span className="text-zinc-600 dark:text-zinc-400">⏱ {m} daq.</span>
      </div>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="mx-auto max-w-md px-4 py-6 space-y-5">
      <div className="h-6 w-40 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
      <div className="h-24 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
      <div className="space-y-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-12 animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800" />
        ))}
      </div>
    </div>
  );
}
