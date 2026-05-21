"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const params = useSearchParams();
  const from = params.get("from") || "/admin";

  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || `HTTP ${res.status}`);
      }
      router.push(from);
      router.refresh();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 dark:bg-zinc-950">
      <form
        onSubmit={submit}
        className="w-full max-w-sm space-y-4 rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-lg dark:border-zinc-800/80 dark:bg-zinc-900"
      >
        <div>
          <h1 className="text-xl font-semibold">🔐 Admin paneli</h1>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Davom etish uchun parolni kiriting.
          </p>
        </div>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Parol"
          className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-500 dark:border-zinc-800 dark:bg-zinc-950"
          autoComplete="current-password"
          autoFocus
        />

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700 dark:bg-red-950/40 dark:text-red-300">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting || !password}
          className="flex h-11 w-full items-center justify-center rounded-xl bg-emerald-600 text-sm font-medium text-white shadow-lg shadow-emerald-600/20 transition active:scale-[0.98] disabled:opacity-50"
        >
          {submitting ? "Tekshirilmoqda..." : "Kirish"}
        </button>
      </form>
    </div>
  );
}
