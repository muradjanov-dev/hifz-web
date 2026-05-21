"use client";

import { useState } from "react";
import { useApi } from "@/lib/use-api";

type User = {
  telegram_id: number;
  full_name: string;
  username: string;
  language: string;
  created_at?: string;
  himmat_points: number;
  total_verses: number;
  streak_days: number;
  is_premium: boolean;
};

type Resp = {
  page: number;
  per_page: number;
  total: number;
  has_more: boolean;
  users: User[];
};

export default function AdminUsers() {
  const [page, setPage] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const qs = new URLSearchParams({
    page: String(page),
    per_page: "30",
    ...(search ? { search } : {}),
  }).toString();

  const { data, isLoading, error } = useApi<Resp>(`/api/admin/users?${qs}`);

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearch(searchInput.trim());
    setPage(0);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Foydalanuvchilar</h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          {data && `${data.total.toLocaleString()} ta foydalanuvchi`}
        </p>
      </div>

      <form onSubmit={submitSearch} className="flex gap-2">
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Ism, username yoki Telegram ID bo'yicha qidirish..."
          className="flex-1 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 dark:border-zinc-800 dark:bg-zinc-900"
        />
        <button
          type="submit"
          className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white"
        >
          Qidirish
        </button>
        {search && (
          <button
            type="button"
            onClick={() => { setSearch(""); setSearchInput(""); setPage(0); }}
            className="rounded-xl border border-zinc-200 px-4 py-2 text-sm dark:border-zinc-800"
          >
            Tozalash
          </button>
        )}
      </form>

      {error && (
        <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
          {(error as Error).message}
        </div>
      )}

      {isLoading ? (
        <div className="space-y-2">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800" />
          ))}
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80">
            <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
              <thead className="bg-zinc-50 dark:bg-zinc-900/60">
                <tr className="text-left text-[11px] uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                  <th className="px-4 py-2">Foydalanuvchi</th>
                  <th className="px-4 py-2 text-right">Himmat</th>
                  <th className="px-4 py-2 text-right">Oyatlar</th>
                  <th className="px-4 py-2 text-right">Streak</th>
                  <th className="px-4 py-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 bg-white dark:divide-zinc-800 dark:bg-zinc-900">
                {data?.users.map((u) => (
                  <tr key={u.telegram_id} className="text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                    <td className="px-4 py-3">
                      <p className="font-medium">{u.full_name || "Anonim"}</p>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                        {u.username && `@${u.username} · `}{u.telegram_id}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">{u.himmat_points.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{u.total_verses}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{u.streak_days} 🔥</td>
                    <td className="px-4 py-3 text-right">
                      {u.is_premium ? (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                          💎 Premium
                        </span>
                      ) : (
                        <span className="text-[10px] text-zinc-400">Bepul</span>
                      )}
                    </td>
                  </tr>
                ))}
                {data?.users.length === 0 && (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-zinc-500">
                    Topilmadi
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {data && data.total > data.per_page && (
            <div className="flex items-center justify-between text-xs">
              <button
                disabled={page === 0}
                onClick={() => setPage(p => Math.max(0, p - 1))}
                className="rounded-lg border border-zinc-200 px-3 py-1.5 disabled:opacity-40 dark:border-zinc-800"
              >
                ← Oldingi
              </button>
              <span className="text-zinc-500 dark:text-zinc-400">
                Sahifa {page + 1} / {Math.ceil(data.total / data.per_page)}
              </span>
              <button
                disabled={!data.has_more}
                onClick={() => setPage(p => p + 1)}
                className="rounded-lg border border-zinc-200 px-3 py-1.5 disabled:opacity-40 dark:border-zinc-800"
              >
                Keyingi →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
