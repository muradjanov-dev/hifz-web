"use client";

import { useState, useRef, useEffect } from "react";
import { useApi } from "@/lib/use-api";
import { getInitData } from "@/lib/telegram-client";
import { cn } from "@/lib/cn";

type Surah = { number: number; name: string; ayah_count: number; juz?: number[] };

type AyahPayload = {
  surah: number;
  ayah: number;
  arabic: string;
  uzbek: string;
  audio_url: string;
  image_url: string;
};

type Session = {
  session_id: string;
  surah_number: number;
  surah_name: string;
  start_ayah: number;
  current_ayah_index: number;
  reciter: string;
  session_ayahs_count: number;
};

type StagePayload = {
  session: Session | null;
  stage?: "ayah" | "repeat_pair" | "accumulate";
  stage_label?: string;
  target_reps?: number;
  ayahs?: AyahPayload[];
  progress?: {
    session_ayahs_count: number;
    current_ayah_in_surah: number;
    total_ayahs_in_surah: number;
  };
};

export default function MemorizePage() {
  const { data, error, mutate, isLoading } = useApi<StagePayload>("/api/me/session");

  if (isLoading) return <Skeleton />;
  if (error)     return <ErrorBlock message={(error as Error).message} />;

  return (
    <div className="mx-auto max-w-md px-4 py-6">
      {data?.session ? (
        <ActiveSession state={data} onChange={() => mutate()} />
      ) : (
        <SurahPicker onStarted={() => mutate()} />
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Surah Picker
// ──────────────────────────────────────────────────────────────────────────────

function SurahPicker({ onStarted }: { onStarted: () => void }) {
  const { data, isLoading } = useApi<{ surahs: Surah[] }>("/api/surahs");
  const [starting, setStarting] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function startSession(surahNumber: number) {
    setStarting(surahNumber);
    setError(null);
    try {
      const res = await fetch("/api/me/session/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Telegram-Init-Data": getInitData(),
        },
        body: JSON.stringify({ surah: surahNumber, direction: "forward", reciter: "husary" }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || `HTTP ${res.status}`);
      }
      onStarted();
    } catch (e) {
      setError((e as Error).message);
      setStarting(null);
    }
  }

  return (
    <>
      <header className="mb-5">
        <h1 className="text-xl font-semibold">📗 Yodlash</h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Surani tanlang. Har oyat uzunligiga qarab 5-11 marta takrorlanadi,
          har 2 oyatda juftlik, har 5 oyatda jamlash.
        </p>
      </header>

      {error && (
        <div className="mb-3 rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </div>
      )}

      {isLoading && (
        <div className="space-y-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="h-14 animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800" />
          ))}
        </div>
      )}

      <div className="space-y-1.5">
        {data?.surahs.map((s) => (
          <button
            key={s.number}
            onClick={() => startSession(s.number)}
            disabled={starting !== null}
            className={cn(
              "flex w-full items-center justify-between rounded-xl border border-zinc-200/80 bg-white px-4 py-3 text-left transition active:scale-[0.98] dark:border-zinc-800/80 dark:bg-zinc-900",
              starting === s.number && "opacity-50",
              starting !== null && starting !== s.number && "opacity-30 pointer-events-none"
            )}
          >
            <div>
              <p className="text-sm font-medium">{s.number}. {s.name}</p>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">{s.ayah_count} oyat</p>
            </div>
            {starting === s.number ? (
              <span className="text-xs text-emerald-600">Boshlanmoqda...</span>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-5 text-zinc-400">
                <path d="m9 18 6-6-6-6" />
              </svg>
            )}
          </button>
        ))}
      </div>
    </>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Active Session — stage-aware
// ──────────────────────────────────────────────────────────────────────────────

function ActiveSession({ state, onChange }: { state: StagePayload; onChange: () => void }) {
  const session     = state.session!;
  const stage       = state.stage ?? "ayah";
  const stageLabel  = state.stage_label ?? "Yodlash";
  const target      = state.target_reps ?? 0;
  const ayahs       = state.ayahs ?? [];
  const progress    = state.progress;

  const [advancing, setAdvancing]   = useState(false);
  const [exiting,   setExiting]     = useState(false);
  const [error,     setError]       = useState<string | null>(null);
  const [surahDone, setSurahDone]   = useState(false);
  const [surahDoneName, setSurahDoneName] = useState("");

  async function advance() {
    setAdvancing(true);
    setError(null);
    try {
      const res = await fetch("/api/me/session/advance", {
        method: "POST",
        headers: { "X-Telegram-Init-Data": getInitData() },
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || `HTTP ${res.status}`);
      }
      const j = await res.json();
      if (j.surah_complete) {
        setSurahDoneName(session.surah_name);
        setSurahDone(true);
      } else {
        onChange();
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setAdvancing(false);
    }
  }

  async function exit() {
    setExiting(true);
    try {
      await fetch("/api/me/session/exit", {
        method: "POST",
        headers: { "X-Telegram-Init-Data": getInitData() },
      });
      onChange();
    } finally {
      setExiting(false);
    }
  }

  if (surahDone) return <SurahCompleteCard surahName={surahDoneName} onDone={onChange} />;

  const buttonLabel = (() => {
    if (stage === "repeat_pair") return `✅ Juftlikni ${target} marta o'qidim`;
    if (stage === "accumulate")  return `✅ Hammasini ${target} marta o'qidim`;
    return `✅ ${target} marta o'qidim`;
  })();

  return (
    <>
      <header className="mb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-lg font-semibold truncate">{session.surah_name}</h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {progress?.current_ayah_in_surah ?? "?"} / {progress?.total_ayahs_in_surah ?? "?"} oyat
              {" · "}
              {progress?.session_ayahs_count ?? 0} ta o&apos;qildi
            </p>
          </div>
          <button
            onClick={exit}
            disabled={exiting}
            className="shrink-0 text-xs text-zinc-500 underline-offset-2 hover:underline dark:text-zinc-400"
          >
            {exiting ? "..." : "Chiqish"}
          </button>
        </div>
      </header>

      {/* Stage badge */}
      <div className="mb-3 flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs dark:bg-emerald-950/40">
        <span className="inline-block size-1.5 rounded-full bg-emerald-500" />
        <span className="font-medium text-emerald-700 dark:text-emerald-300">{stageLabel}</span>
        <span className="text-emerald-600/70 dark:text-emerald-400/70">·</span>
        <span className="text-emerald-700 dark:text-emerald-300">
          {target} marta takror
        </span>
      </div>

      {error && (
        <div className="mb-3 rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Ayahs list */}
      <div className="space-y-3 mb-4">
        {ayahs.map((a) => (
          <AyahCard key={`${a.surah}_${a.ayah}`} ayah={a} singleStage={stage === "ayah"} />
        ))}
      </div>

      {/* Action button */}
      <button
        onClick={advance}
        disabled={advancing}
        className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 text-base font-medium text-white shadow-lg shadow-emerald-600/20 transition active:scale-[0.98] disabled:opacity-50"
      >
        {advancing ? "Saqlanmoqda..." : buttonLabel}
      </button>

      <p className="mt-3 text-center text-[11px] text-zinc-500 dark:text-zinc-400">
        {stage === "ayah" && "Oyat uzunligiga qarab takrorlar soni."}
        {stage === "repeat_pair" && "2 ta oyatni birga 5 marta o'qing."}
        {stage === "accumulate" && "Oxirgi 5 ta oyatni birga takrorlang."}
      </p>
    </>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Single Ayah Card (Arabic, audio, translation, optional image)
// ──────────────────────────────────────────────────────────────────────────────

function AyahCard({ ayah, singleStage }: { ayah: AyahPayload; singleStage: boolean }) {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (ayah.audio_url && audioRef.current) {
      audioRef.current.src = ayah.audio_url;
      audioRef.current.load();
    }
  }, [ayah.audio_url]);

  return (
    <div className="overflow-hidden rounded-2xl border border-emerald-200/60 bg-gradient-to-br from-emerald-50 to-white shadow-sm dark:border-emerald-900/40 dark:from-emerald-950/30 dark:to-zinc-900">
      {/* Arabic */}
      <div className="px-5 pt-5 pb-3">
        <p
          dir="rtl"
          lang="ar"
          className="text-center"
          style={{
            fontSize: singleStage ? "2.25rem" : "1.5rem",
            lineHeight: "2.3",
            fontFamily:
              'var(--font-amiri), "Amiri Quran", "Amiri", "Scheherazade New", "Traditional Arabic", serif',
          }}
        >
          {ayah.arabic}
        </p>
        <p className="mt-2 text-center text-[11px] text-emerald-700/70 dark:text-emerald-300/70">
          {ayah.surah}:{ayah.ayah}
        </p>
      </div>

      {/* Audio */}
      {ayah.audio_url && (
        <div className="border-t border-emerald-200/40 bg-white/40 px-3 py-2 dark:border-emerald-900/30 dark:bg-zinc-900/40">
          <audio ref={audioRef} controls src={ayah.audio_url} className="w-full" preload="metadata">
            Brauzeringiz audio&apos;ni qo&apos;llamaydi.
          </audio>
        </div>
      )}

      {/* Uzbek (only for single ayah; in pair/accumulate keep it compact) */}
      {singleStage && ayah.uzbek && (
        <div className="border-t border-emerald-200/40 bg-zinc-50/60 px-5 py-3 dark:border-emerald-900/30 dark:bg-zinc-900/60">
          <p className="text-[10px] uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Tarjima
          </p>
          <p className="mt-1 text-sm leading-relaxed">{ayah.uzbek}</p>
        </div>
      )}

      {/* Mushaf image (single-stage only) */}
      {singleStage && (
        <details className="border-t border-emerald-200/40 dark:border-emerald-900/30">
          <summary className="cursor-pointer px-4 py-2 text-xs font-medium text-zinc-600 dark:text-zinc-400">
            📖 Mushaf rasmida ko&apos;rish
          </summary>
          <div className="bg-white p-2">
            <img
              src={ayah.image_url}
              alt={`${ayah.surah}:${ayah.ayah}`}
              className="block w-full h-auto"
            />
          </div>
        </details>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────

function SurahCompleteCard({ surahName, onDone }: { surahName: string; onDone: () => void }) {
  return (
    <div className="mt-12 text-center">
      <div className="mb-4 text-6xl">🎉</div>
      <h2 className="text-2xl font-semibold">Tabriklaymiz!</h2>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        {surahName} surasini to&apos;liq tugatdingiz.
      </p>
      <button
        onClick={onDone}
        className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-emerald-600 px-6 text-sm font-medium text-white"
      >
        Yangi surani tanlash
      </button>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="mx-auto max-w-md px-4 py-6 space-y-3">
      <div className="h-6 w-32 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
      <div className="h-48 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
      <div className="h-14 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
    </div>
  );
}

function ErrorBlock({ message }: { message: string }) {
  return (
    <div className="mx-auto max-w-md px-4 py-12 text-center">
      <div className="mb-3 text-4xl">⚠️</div>
      <h2 className="text-lg font-semibold">Xatolik yuz berdi</h2>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{message}</p>
    </div>
  );
}
