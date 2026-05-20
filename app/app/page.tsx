"use client";

import { useApi } from "@/lib/use-api";
import Link from "next/link";

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
  quran_progress_bar?: string;
  is_premium?: boolean;
  current_surah?: number;
  current_ayah?: number;
  completed_surahs?: number[];
  completed_juz?: number[];
};

type Quota = {
  is_premium: boolean;
  used_today: number;
  limit: number | null;
  remaining: number | null;
};

export default function Dashboard() {
  const { data, error, isLoading } = useApi<Profile>("/api/me");
  const { data: quota } = useApi<Quota>("/api/me/quota");

  if (isLoading) return <Loading />;
  if (error)     return <ErrorBlock message={(error as Error).message} />;
  if (!data)     return <ErrorBlock message="Hech narsa topilmadi" />;

  const himmat        = data.himmat_fmt || String(data.himmat ?? 0);
  const surahsDone    = data.completed_surahs?.length ?? 0;
  const juzDone       = data.completed_juz?.length ?? 0;
  const pctComplete   = data.percent_complete ?? 0;

  return (
    <div className="mx-auto max-w-md px-4 py-6">
      {/* Greeting */}
      <header className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Assalomu alaykum</p>
          <h1 className="text-xl font-semibold">{data.full_name || "Foydalanuvchi"}</h1>
        </div>
        {data.is_premium && (
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800 dark:bg-amber-950 dark:text-amber-300">
            💎 Premium
          </span>
        )}
      </header>

      {/* Hero card: level + Himmat */}
      <section className="mb-5 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 p-5 text-white shadow-lg shadow-emerald-500/20">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs opacity-80">{data.level_name || "Level 1"}</p>
            <p className="mt-1 text-3xl font-semibold leading-none">{himmat}</p>
            <p className="mt-1 text-xs opacity-80">Himmat ballari</p>
          </div>
          <div className="text-right">
            <p className="text-xs opacity-80">Reyting</p>
            <p className="mt-1 text-2xl font-semibold">#{data.rank ?? "—"}</p>
          </div>
        </div>
      </section>

      {/* Stats grid */}
      <section className="mb-5 grid grid-cols-2 gap-3">
        <StatCard label="Yodlangan oyat"   value={String(data.total_verses ?? 0)} sub={`${pctComplete}% Qur'on`} />
        <StatCard label="Streak"           value={String(data.streak ?? 0)}        sub={`${data.longest_streak ?? 0} kun eng uzun`} />
        <StatCard label="Tugatilgan sura"  value={`${surahsDone}/114`}              sub="" />
        <StatCard label="Tugatilgan juz"   value={`${juzDone}/30`}                  sub="" />
      </section>

      {/* Daily quota (only for free users) */}
      {quota && !quota.is_premium && (
        <section className="mb-5 rounded-2xl border border-amber-200/60 bg-gradient-to-br from-amber-50 to-white p-4 dark:border-amber-900/40 dark:from-amber-950/30 dark:to-zinc-900">
          <div className="flex items-baseline justify-between">
            <p className="text-xs uppercase tracking-wide text-amber-700 dark:text-amber-400">
              Bugungi limit
            </p>
            <p className="text-sm font-semibold">
              {quota.used_today} / {quota.limit ?? 5}
            </p>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-amber-200/40 dark:bg-amber-900/40">
            <div
              className="h-full rounded-full bg-amber-500 transition-all"
              style={{
                width: `${Math.min(100, ((quota.used_today || 0) / (quota.limit || 5)) * 100)}%`,
              }}
            />
          </div>
          <a
            href="/app/premium"
            className="mt-3 block text-center text-xs font-medium text-amber-700 underline-offset-2 hover:underline dark:text-amber-400"
          >
            Cheksiz yodlash → Premium olish 💎
          </a>
        </section>
      )}

      {/* Quran progress bar */}
      <section className="mb-5 rounded-2xl border border-zinc-200/80 bg-white p-5 dark:border-zinc-800/80 dark:bg-zinc-900">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Qur&apos;on bo&apos;ylab taraqqiyot
          </h2>
          <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
            {pctComplete}%
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all"
            style={{ width: `${Math.min(pctComplete, 100)}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
          {data.total_verses ?? 0} / 6236 oyat
        </p>
      </section>

      {/* Time + reps */}
      <section className="mb-5 grid grid-cols-2 gap-3">
        <StatCard label="Jami vaqt"   value={data.total_time || "0 daq."}  sub="" />
        <StatCard label="Takrorlar"   value={String(data.total_reps ?? 0)} sub="" />
      </section>

      {/* Quick links */}
      <section className="space-y-2">
        <QuickLink href="/app/leaderboard" emoji="🏆" title="Reyting" subtitle="Top 50 ishtirokchi" />
        <QuickLink href="/app/achievements" emoji="⭐" title="Yutuqlarim" subtitle="Mukofotlar galereyasi" />
        <QuickLink href="/app/profile" emoji="📊" title="Batafsil profil" subtitle="To'liq statistika" />
      </section>
    </div>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 dark:border-zinc-800/80 dark:bg-zinc-900">
      <p className="text-xs text-zinc-500 dark:text-zinc-400">{label}</p>
      <p className="mt-1 text-2xl font-semibold tracking-tight">{value}</p>
      {sub && <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400">{sub}</p>}
    </div>
  );
}

function QuickLink({ href, emoji, title, subtitle }: { href: string; emoji: string; title: string; subtitle: string }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between rounded-2xl border border-zinc-200/80 bg-white p-4 transition hover:bg-zinc-50 dark:border-zinc-800/80 dark:bg-zinc-900 dark:hover:bg-zinc-800/60"
    >
      <div className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-xl dark:bg-emerald-950/40">
          {emoji}
        </span>
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">{subtitle}</p>
        </div>
      </div>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-5 text-zinc-400">
        <path d="m9 18 6-6-6-6" />
      </svg>
    </Link>
  );
}

function Loading() {
  return (
    <div className="mx-auto max-w-md px-4 py-6">
      <div className="mb-6 space-y-2">
        <div className="h-3 w-24 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-6 w-48 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
      </div>
      <div className="mb-5 h-32 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
      <div className="grid grid-cols-2 gap-3">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
        ))}
      </div>
    </div>
  );
}

function ErrorBlock({ message }: { message: string }) {
  return (
    <div className="mx-auto max-w-md px-4 py-12 text-center">
      <div className="mb-3 text-4xl">⚠️</div>
      <h2 className="text-lg font-semibold">Xatolik yuz berdi</h2>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{message}</p>
      <p className="mt-6 text-xs text-zinc-500 dark:text-zinc-400">
        Iltimos, Mini App&apos;ni Telegram bot ichidan oching.
      </p>
    </div>
  );
}
