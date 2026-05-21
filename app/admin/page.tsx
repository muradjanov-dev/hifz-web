"use client";

import { useApi } from "@/lib/use-api";
import Link from "next/link";

type Stats = {
  total_users?: number;
  premium_users?: number;
  new_today?: number;
  active_today?: number;
  active_7d?: number;
  pending_premium?: number;
};

export default function AdminOverview() {
  const { data, error, isLoading } = useApi<Stats>("/api/admin/stats");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Overview</h1>

      {error && (
        <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
          {(error as Error).message}
        </div>
      )}

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard label="Jami foydalanuvchilar"        value={data?.total_users ?? 0} />
          <StatCard label="Premium"                     value={data?.premium_users ?? 0} badge="💎" />
          <StatCard label="Bugun ro'yxatdan o'tgan"     value={data?.new_today ?? 0} />
          <StatCard label="Bugun faol"                  value={data?.active_today ?? 0} />
          <StatCard label="7 kun ichida faol"           value={data?.active_7d ?? 0} />
          <StatCard
            label="Premium so'rovlar (kutilmoqda)"
            value={data?.pending_premium ?? 0}
            href={(data?.pending_premium ?? 0) > 0 ? "/admin/premium" : undefined}
            highlight={(data?.pending_premium ?? 0) > 0}
          />
        </div>
      )}

      <section className="rounded-2xl border border-zinc-200/80 bg-white p-5 dark:border-zinc-800/80 dark:bg-zinc-900">
        <h2 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Tezkor harakatlar</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/admin/users" className="rounded-full border border-zinc-200 px-4 py-1.5 text-xs hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800">
            👥 Foydalanuvchilar ro&apos;yxati
          </Link>
          <Link href="/admin/premium" className="rounded-full border border-zinc-200 px-4 py-1.5 text-xs hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800">
            💎 Premium so&apos;rovlar
          </Link>
          <Link href="/admin/broadcast" className="rounded-full border border-zinc-200 px-4 py-1.5 text-xs hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800">
            📢 Xabar yuborish
          </Link>
        </div>
      </section>
    </div>
  );
}

function StatCard({
  label, value, badge, href, highlight,
}: {
  label: string; value: number; badge?: string; href?: string; highlight?: boolean;
}) {
  const inner = (
    <div className={`rounded-2xl border bg-white p-5 transition dark:bg-zinc-900 ${
      highlight
        ? "border-amber-300 hover:border-amber-400 dark:border-amber-700/60"
        : "border-zinc-200/80 dark:border-zinc-800/80"
    }`}>
      <p className="text-xs text-zinc-500 dark:text-zinc-400">{label}</p>
      <p className="mt-2 flex items-baseline gap-2 text-3xl font-semibold tracking-tight">
        {badge && <span className="text-2xl">{badge}</span>}
        {value.toLocaleString()}
      </p>
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}
