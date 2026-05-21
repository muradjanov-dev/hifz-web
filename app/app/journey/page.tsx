"use client";

import { useState } from "react";
import Link from "next/link";
import { useApi } from "@/lib/use-api";
import { cn } from "@/lib/cn";
import {
  VALLEYS,
  JUZ_NAMES,
  STORIES,
  STORY_TYPE_LABEL,
  NUM_VALLEYS,
  valleyStatus,
  currentValley,
  completedCount,
  type Valley,
  type ValleyStatus,
} from "@/lib/valleys";

type Profile = { total_verses?: number };

export default function JourneyPage() {
  const { data, isLoading, error } = useApi<Profile>("/api/me");
  const [selected, setSelected] = useState<Valley | null>(null);

  if (isLoading) return <Loading />;
  if (error) return <ErrorBlock message={(error as Error).message} />;

  const total = data?.total_verses ?? 0;
  const cur = currentValley(total);
  const done = completedCount(total);
  const toNext = Math.max(0, cur.endAyah - total);

  // Group valleys by juz region for headers.
  const regions = Array.from({ length: 30 }, (_, j) =>
    VALLEYS.filter((v) => v.juz === j + 1)
  );

  return (
    <div className="mx-auto max-w-md px-4 py-6">
      {/* Hero */}
      <header className="mb-5">
        <h1 className="text-xl font-semibold">🗺️ 300 Vodiy Sayohati</h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Har 21 oyat — bir vodiy. Yodlagan sari yangi qissalar ochiladi.
        </p>
      </header>

      <section className="mb-6 rounded-2xl bg-gradient-to-br from-teal-600 via-teal-700 to-emerald-800 p-5 text-white shadow-lg shadow-teal-700/25">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs opacity-80">Hozirgi vodiy</p>
            <p className="mt-1 text-3xl font-bold leading-none">{cur.id}<span className="text-lg opacity-70">/{NUM_VALLEYS}</span></p>
            <p className="mt-1 text-xs opacity-90">{cur.name}</p>
          </div>
          <div className="text-right">
            <p className="text-xs opacity-80">O'tilgan</p>
            <p className="mt-1 text-2xl font-semibold">{done}</p>
            <p className="text-[11px] opacity-80">vodiy</p>
          </div>
        </div>
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/25">
          <div
            className="h-full rounded-full bg-white transition-all"
            style={{ width: `${(done / NUM_VALLEYS) * 100}%` }}
          />
        </div>
        <p className="mt-2 text-[11px] opacity-90">
          Keyingi vodiygacha yana <b>{toNext}</b> oyat
        </p>
      </section>

      {/* Roadmap */}
      <div className="space-y-3">
        {regions.map((valleys, j) => (
          <RegionRoadmap
            key={j + 1}
            juz={j + 1}
            valleys={valleys}
            total={total}
            onPick={setSelected}
          />
        ))}
      </div>

      <div className="mt-8 text-center text-3xl">🏁</div>
      <p className="mb-2 text-center text-xs text-zinc-500 dark:text-zinc-400">
        Butun Qur&apos;on — 300 vodiy. Yo&apos;l sizni kutmoqda.
      </p>

      {selected && (
        <StorySheet
          valley={selected}
          status={valleyStatus(selected, total)}
          remaining={Math.max(0, selected.startAyah - total)}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}

// ── Roadmap: a winding game-style path of 10 nodes per juz region ──────────────
const STEP = 96;          // vertical px between nodes
const AMP = 34;           // horizontal swing (% of width)

function RegionRoadmap({
  juz,
  valleys,
  total,
  onPick,
}: {
  juz: number;
  valleys: Valley[];
  total: number;
  onPick: (v: Valley) => void;
}) {
  const height = valleys.length * STEP;
  const pts = valleys.map((v, i) => ({
    x: 50 + Math.sin(i * 1.15) * AMP,
    y: i * STEP + STEP / 2,
    v,
    st: valleyStatus(v, total),
  }));
  const pathD = pts.map((p, i) => `${i ? "L" : "M"} ${p.x} ${p.y}`).join(" ");
  const regionDone = valleys.every((v) => valleyStatus(v, total) === "completed");
  const regionLocked = valleys.every((v) => valleyStatus(v, total) === "locked");

  return (
    <section>
      {/* Region banner */}
      <div className="sticky top-0 z-10 -mx-4 flex items-center gap-2 bg-zinc-50/90 px-4 py-2 backdrop-blur dark:bg-zinc-950/90">
        <span
          className={cn(
            "flex size-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold",
            regionDone
              ? "bg-emerald-500 text-white"
              : regionLocked
              ? "bg-zinc-200 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-500"
              : "bg-teal-700 text-white"
          )}
        >
          {regionDone ? "✓" : juz}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">
            {juz}-pora · {JUZ_NAMES[juz - 1]}
          </p>
          <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
            {valleys[0].id}–{valleys[valleys.length - 1].id}-vodiylar
          </p>
        </div>
      </div>

      {/* Winding path */}
      <div className="relative" style={{ height }}>
        <svg
          className="absolute inset-0"
          width="100%"
          height={height}
          viewBox={`0 0 100 ${height}`}
          preserveAspectRatio="none"
          aria-hidden
        >
          <path
            d={pathD}
            fill="none"
            stroke={regionLocked ? "rgb(212 212 216 / 0.6)" : "rgb(13 148 136 / 0.45)"}
            strokeWidth={4}
            strokeDasharray="1 6"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {pts.map(({ x, y, v, st }) => (
          <RoadNode key={v.id} valley={v} status={st} x={x} y={y} onClick={() => onPick(v)} />
        ))}
      </div>
    </section>
  );
}

function RoadNode({
  valley,
  status,
  x,
  y,
  onClick,
}: {
  valley: Valley;
  status: ValleyStatus;
  x: number;
  y: number;
  onClick: () => void;
}) {
  const isCurrent = status === "current";
  const isDone = status === "completed";
  const label = valley.hasStory || isCurrent ? valley.name : null;

  return (
    <button
      onClick={onClick}
      style={{ left: `${x}%`, top: y }}
      className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
    >
      {isCurrent && (
        <span className="mb-1 whitespace-nowrap rounded-full bg-teal-700 px-2 py-0.5 text-[10px] font-semibold text-white shadow">
          Siz shu yerda
        </span>
      )}
      <span
        className={cn(
          "flex items-center justify-center rounded-full font-bold shadow-md transition active:scale-95",
          isCurrent
            ? "size-16 bg-gradient-to-br from-teal-500 to-emerald-700 text-white ring-4 ring-teal-300/50 dark:ring-teal-500/40"
            : isDone
            ? "size-14 bg-gradient-to-br from-emerald-400 to-emerald-600 text-white"
            : "size-12 bg-zinc-200 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-600"
        )}
      >
        {isDone ? (
          <span className="text-xl">✓</span>
        ) : status === "locked" ? (
          <LockGlyph />
        ) : (
          <span className="text-lg">{valley.id}</span>
        )}
      </span>
      {label && (
        <span
          className={cn(
            "mt-1 max-w-[88px] truncate text-[10px] font-medium",
            isCurrent ? "text-teal-700 dark:text-teal-400" : "text-zinc-600 dark:text-zinc-400"
          )}
        >
          {valley.name}
        </span>
      )}
    </button>
  );
}

function LockGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-5">
      <rect width="18" height="11" x="3" y="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function StorySheet({
  valley,
  status,
  remaining,
  onClose,
}: {
  valley: Valley;
  status: ReturnType<typeof valleyStatus>;
  remaining: number;
  onClose: () => void;
}) {
  const story = STORIES[valley.id];
  const locked = status === "locked";

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="max-h-[88vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-white p-6 pb-24 shadow-2xl dark:bg-zinc-900"
        style={{ animation: "hifz-sheet 0.25s ease-out" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-zinc-300 dark:bg-zinc-700" />

        <p className="text-sm font-medium uppercase tracking-wide text-teal-700 dark:text-teal-400">
          {valley.id}-vodiy · {valley.juz}-pora
        </p>
        <h2 className="mt-1 text-2xl font-semibold">{valley.name}</h2>

        {locked ? (
          <div className="mt-6 rounded-2xl bg-zinc-100/80 p-5 text-center dark:bg-zinc-800/60">
            <div className="mb-2 text-4xl">🔒</div>
            <p className="text-base text-zinc-600 dark:text-zinc-400">
              Bu vodiy hali yopiq. Ochish uchun yana <b>{remaining}</b> oyat yodlang.
            </p>
          </div>
        ) : story ? (
          <div className="mt-4">
            <span className="inline-block rounded-full bg-teal-50 px-3 py-1 text-sm font-medium text-teal-700 dark:bg-teal-950/40 dark:text-teal-300">
              {STORY_TYPE_LABEL[story.type]}
            </span>
            <h3 className="mt-3 text-xl font-semibold">{story.title}</h3>
            <p className="mt-3 text-[17px] leading-8 text-zinc-700 dark:text-zinc-200">
              {story.body}
            </p>
            <div className="mt-5 rounded-xl border-l-4 border-emerald-500 bg-emerald-50/60 p-4 dark:bg-emerald-950/30">
              <p className="text-xs uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
                Manba
              </p>
              <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">{story.source}</p>
            </div>
          </div>
        ) : (
          <div className="mt-6 rounded-2xl bg-zinc-100/80 p-5 text-center dark:bg-zinc-800/60">
            <div className="mb-2 text-4xl">✨</div>
            <p className="text-base text-zinc-600 dark:text-zinc-400">
              Ushbu vodiy hikoyasi tez orada qo&apos;shiladi. Sayohatni davom ettiring!
            </p>
          </div>
        )}

        <div className="mt-6 space-y-2">
          <Link
            href="/app/memorize"
            className="flex h-12 items-center justify-center rounded-full bg-emerald-600 text-base font-medium text-white shadow-lg shadow-emerald-600/20"
          >
            📗 Yodlash bo&apos;limiga o&apos;tish
          </Link>
          <button
            onClick={onClose}
            className="block w-full rounded-full border border-zinc-200 py-2.5 text-sm font-medium dark:border-zinc-700"
          >
            Yopish
          </button>
        </div>
      </div>
    </div>
  );
}

function Loading() {
  return (
    <div className="mx-auto max-w-md px-4 py-6">
      <div className="mb-5 h-6 w-48 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
      <div className="mb-6 h-32 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
      <div className="space-y-2">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="h-16 animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800" />
        ))}
      </div>
    </div>
  );
}

function ErrorBlock({ message }: { message: string }) {
  return (
    <div className="mx-auto max-w-md px-4 py-12 text-center">
      <div className="mb-3 text-4xl">⚠️</div>
      <h2 className="text-lg font-semibold">Xatolik</h2>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{message}</p>
    </div>
  );
}
