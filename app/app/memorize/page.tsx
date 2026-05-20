"use client";

import { useState, useRef, useEffect } from "react";
import { useApi } from "@/lib/use-api";
import { getInitData } from "@/lib/telegram-client";
import { cn } from "@/lib/cn";

type Surah = { number: number; name: string; ayah_count: number; juz?: number[] };
type Session = {
  session_id: string;
  surah_number: number;
  surah_name: string;
  start_ayah: number;
  current_ayah_index: number;
  reciter: string;
  session_ayahs_count: number;
};
type Ayah = {
  surah: number;
  ayah: number;
  arabic: string;
  uzbek: string;
  audio_url: string;
  image_url: string;
};

export default function MemorizePage() {
  const { data: sessionData, mutate: refetchSession, isLoading } =
    useApi<{ session: Session | null }>("/api/me/session");

  const session = sessionData?.session;

  if (isLoading) return <Skeleton />;

  return (
    <div className="mx-auto max-w-md px-4 py-6">
      {session ? (
        <ActiveSession session={session} onChange={() => refetchSession()} />
      ) : (
        <SurahPicker onStarted={() => refetchSession()} />
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
          Surani tanlang va yodlashni boshlang
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
              <p className="text-sm font-medium">
                {s.number}. {s.name}
              </p>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                {s.ayah_count} oyat
              </p>
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
// Active Session
// ──────────────────────────────────────────────────────────────────────────────

function ActiveSession({ session, onChange }: { session: Session; onChange: () => void }) {
  const currentAyahNum = (session.start_ayah || 1) + (session.current_ayah_index || 0);
  const { data: ayah, isLoading } = useApi<Ayah>(
    `/api/ayah?surah=${session.surah_number}&ayah=${currentAyahNum}&reciter=${session.reciter}`
  );

  const audioRef = useRef<HTMLAudioElement>(null);
  const [advancing, setAdvancing] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [surahDone, setSurahDone] = useState(false);

  // Auto-play audio when ayah loads.
  useEffect(() => {
    if (ayah?.audio_url && audioRef.current) {
      audioRef.current.src = ayah.audio_url;
      audioRef.current.load();
    }
  }, [ayah?.audio_url]);

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

  if (surahDone) {
    return <SurahCompleteCard surahName={session.surah_name} onDone={onChange} />;
  }

  return (
    <>
      <header className="mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">
              {session.surah_name}
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {currentAyahNum}-oyat · {session.session_ayahs_count} ta o&apos;qildi
            </p>
          </div>
          <button
            onClick={exit}
            disabled={exiting}
            className="text-xs text-zinc-500 underline-offset-2 hover:underline dark:text-zinc-400"
          >
            {exiting ? "..." : "Chiqish"}
          </button>
        </div>
      </header>

      {error && (
        <div className="mb-3 rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </div>
      )}

      {isLoading || !ayah ? (
        <div className="space-y-3">
          <div className="h-48 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-20 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
        </div>
      ) : (
        <>
          {/* Ayah image */}
          <div className="mb-3 overflow-hidden rounded-2xl border border-zinc-200/80 bg-white p-4 dark:border-zinc-800/80 dark:bg-zinc-900">
            <img
              src={ayah.image_url}
              alt={`${session.surah_name} ${currentAyahNum}-oyat`}
              className="mx-auto max-h-72 w-auto object-contain"
            />
          </div>

          {/* Audio player */}
          <div className="mb-3 rounded-2xl border border-zinc-200/80 bg-white p-3 dark:border-zinc-800/80 dark:bg-zinc-900">
            <audio
              ref={audioRef}
              controls
              src={ayah.audio_url}
              className="w-full"
              preload="auto"
            >
              Brauzeringiz audio'ni qo&apos;llamaydi.
            </audio>
          </div>

          {/* Uzbek translation */}
          {ayah.uzbek && (
            <div className="mb-4 rounded-2xl border border-zinc-200/80 bg-zinc-50/80 p-4 dark:border-zinc-800/80 dark:bg-zinc-900/50">
              <p className="text-[11px] uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                Tarjima
              </p>
              <p className="mt-1 text-sm leading-relaxed">{ayah.uzbek}</p>
            </div>
          )}

          {/* Action button */}
          <button
            onClick={advance}
            disabled={advancing}
            className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 text-base font-medium text-white shadow-lg shadow-emerald-600/20 transition active:scale-[0.98] disabled:opacity-50"
          >
            {advancing ? "Saqlanmoqda..." : "✅ O'qidim, keyingisi"}
          </button>

          <p className="mt-3 text-center text-[11px] text-zinc-500 dark:text-zinc-400">
            Har bir &quot;O&apos;qidim&quot; +5 Himmat ball beradi.
          </p>
        </>
      )}
    </>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Surah Complete
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
