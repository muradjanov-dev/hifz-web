"use client";

import { useState } from "react";
import { useApi } from "@/lib/use-api";

type Req = {
  request_id: string;
  user_id: number;
  username?: string;
  full_name?: string;
  file_id?: string;
  status?: string;
  created_at?: string;
};

type Resp = { requests: Req[] };

export default function AdminPremium() {
  const { data, isLoading, error, mutate } = useApi<Resp>("/api/admin/premium/pending");
  const [busy, setBusy] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(null);

  async function decide(req_id: string, action: "approve" | "reject", extra?: { months?: number; reason?: string }) {
    setBusy(req_id);
    setFeedback(null);
    try {
      const res = await fetch(`/api/admin/premium/${encodeURIComponent(req_id)}/decide`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...extra }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || `HTTP ${res.status}`);
      }
      const j = await res.json();
      setFeedback({ ok: true, msg: `So'rov ${j.status === "approved" ? "tasdiqlandi" : "rad etildi"}` });
      mutate();
    } catch (e) {
      setFeedback({ ok: false, msg: (e as Error).message });
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Premium so&apos;rovlar</h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          {data && `${data.requests.length} ta kutilmoqda`}
        </p>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
          {(error as Error).message}
        </div>
      )}

      {feedback && (
        <div className={`rounded-xl p-3 text-sm ${
          feedback.ok
            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
            : "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300"
        }`}>
          {feedback.msg}
        </div>
      )}

      {isLoading ? (
        <div className="space-y-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
          ))}
        </div>
      ) : !data?.requests.length ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 p-12 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
          ✨ Hozircha kutilayotgan so&apos;rov yo&apos;q
        </div>
      ) : (
        <div className="space-y-3">
          {data.requests.map((r) => (
            <article key={r.request_id} className="rounded-2xl border border-zinc-200/80 bg-white p-4 dark:border-zinc-800/80 dark:bg-zinc-900">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium">{r.full_name || "Anonim"}</p>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    {r.username && `@${r.username} · `}{r.user_id}
                  </p>
                  {r.created_at && (
                    <p className="mt-1 text-[10px] text-zinc-400">
                      {new Date(r.created_at).toLocaleString("uz")}
                    </p>
                  )}
                </div>
                {r.file_id && (
                  <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                    📎 Chek bor
                  </span>
                )}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={() => decide(r.request_id, "approve", { months: 1 })}
                  disabled={busy === r.request_id}
                  className="rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-medium text-white disabled:opacity-50"
                >
                  ✅ 1 oy tasdiqlash
                </button>
                <button
                  onClick={() => decide(r.request_id, "approve", { months: 3 })}
                  disabled={busy === r.request_id}
                  className="rounded-full bg-emerald-700 px-4 py-1.5 text-xs font-medium text-white disabled:opacity-50"
                >
                  ✅ 3 oy
                </button>
                <button
                  onClick={() => decide(r.request_id, "approve", { months: 12 })}
                  disabled={busy === r.request_id}
                  className="rounded-full bg-emerald-800 px-4 py-1.5 text-xs font-medium text-white disabled:opacity-50"
                >
                  ✅ 1 yil
                </button>
                <button
                  onClick={() => {
                    const reason = prompt("Rad etish sababini yozing (ixtiyoriy):") || "";
                    decide(r.request_id, "reject", { reason });
                  }}
                  disabled={busy === r.request_id}
                  className="rounded-full border border-red-300 px-4 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/40"
                >
                  ❌ Rad etish
                </button>
                {r.file_id && (
                  <a
                    href={`https://t.me/quranyodla_bot?start=adminreceipt_${r.request_id}`}
                    target="_blank"
                    rel="noopener"
                    className="rounded-full border border-zinc-200 px-4 py-1.5 text-xs hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800"
                  >
                    📎 Chekni botda ko&apos;rish
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
