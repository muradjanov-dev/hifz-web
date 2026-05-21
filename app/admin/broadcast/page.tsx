"use client";

import { useState } from "react";

type Target = "all" | "premium" | "free";

export default function AdminBroadcast() {
  const [text, setText] = useState("");
  const [target, setTarget] = useState<Target>("all");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ sent: number; failed: number; target_total: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function send() {
    if (!text.trim()) return;
    if (!confirm(`${target === "all" ? "BARCHA" : target === "premium" ? "FAQAT PREMIUM" : "FAQAT BEPUL"} foydalanuvchilarga xabar yuborilsinmi?`)) return;

    setSending(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/admin/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.trim(), target }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || `HTTP ${res.status}`);
      setResult(j);
      setText("");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Broadcast</h1>
      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        Foydalanuvchilarga xabar yuborish. Telegram tezligi: ~25/sekund.
      </p>

      {/* Target picker */}
      <div className="flex gap-2">
        {([
          { id: "all",     label: "Hammasi" },
          { id: "premium", label: "💎 Faqat premium" },
          { id: "free",    label: "Bepul foydalanuvchilar" },
        ] as { id: Target; label: string }[]).map((t) => (
          <button
            key={t.id}
            onClick={() => setTarget(t.id)}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
              target === t.id
                ? "bg-emerald-600 text-white"
                : "border border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={8}
        placeholder="Xabar matnini yozing..."
        className="w-full rounded-2xl border border-zinc-200 bg-white p-4 text-sm outline-none focus:border-emerald-500 dark:border-zinc-800 dark:bg-zinc-900"
      />

      <div className="flex items-center justify-between">
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          {text.length} ta belgi
        </p>
        <button
          onClick={send}
          disabled={sending || !text.trim()}
          className="rounded-full bg-emerald-600 px-6 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {sending ? "Yuborilmoqda..." : "📢 Yuborish"}
        </button>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </div>
      )}

      {result && (
        <div className="rounded-2xl border border-emerald-200/60 bg-emerald-50 p-4 dark:border-emerald-900/40 dark:bg-emerald-950/40">
          <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">✅ Yuborildi</p>
          <p className="mt-1 text-xs text-emerald-700 dark:text-emerald-400">
            {result.sent}/{result.target_total} ta yuborildi
            {result.failed > 0 && `, ${result.failed} ta xato`}
          </p>
        </div>
      )}
    </div>
  );
}
