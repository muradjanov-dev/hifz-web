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

  // Build two smooth (cubic-Bezier) paths so completed segments can render in
  // solid emerald and ahead segments in dashed teal — clearer progress signal.
  const doneSegs: string[] = [];
  const aheadSegs: string[] = [];
  for (let i = 1; i < pts.length; i++) {
    const p0 = pts[i - 1];
    const p1 = pts[i];
    const midY = (p0.y + p1.y) / 2;
    const seg = `M ${p0.x} ${p0.y} C ${p0.x} ${midY} ${p1.x} ${midY} ${p1.x} ${p1.y}`;
    if (p1.st === "completed") doneSegs.push(seg);
    else aheadSegs.push(seg);
  }

  const doneCount = pts.filter((p) => p.st === "completed").length;
  const regionDone = doneCount === pts.length;
  const regionLocked = pts.every((p) => p.st === "locked");

  return (
    <section>
      {/* Region banner */}
      <div
        className={cn(
          "sticky top-0 z-10 -mx-4 flex items-center gap-3 px-4 py-2.5 backdrop-blur",
          regionDone
            ? "bg-emerald-50/90 dark:bg-emerald-950/40"
            : regionLocked
            ? "bg-zinc-100/90 dark:bg-zinc-900/90"
            : "bg-gradient-to-r from-teal-50/95 to-emerald-50/95 dark:from-teal-950/40 dark:to-emerald-950/40"
        )}
      >
        <span
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-xl text-sm font-bold shadow-sm",
            regionDone
              ? "bg-emerald-500 text-white"
              : regionLocked
              ? "bg-zinc-200 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-500"
              : "bg-gradient-to-br from-teal-600 to-emerald-700 text-white"
          )}
        >
          {regionDone ? "✓" : juz}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <p className="truncate text-sm font-semibold">
              {juz}-pora · {JUZ_NAMES[juz - 1]}
            </p>
            <span className="shrink-0 text-[11px] tabular-nums text-zinc-500 dark:text-zinc-400">
              {doneCount}/{pts.length}
            </span>
          </div>
          <div className="mt-1 h-1 overflow-hidden rounded-full bg-zinc-200/70 dark:bg-zinc-800/70">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                regionDone ? "bg-emerald-500" : "bg-gradient-to-r from-teal-500 to-emerald-500"
              )}
              style={{ width: `${(doneCount / pts.length) * 100}%` }}
            />
          </div>
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
          {/* Ahead (dashed muted) — drawn first so completed paints on top */}
          {aheadSegs.length > 0 && (
            <path
              d={aheadSegs.join(" ")}
              fill="none"
              stroke="rgb(148 163 184 / 0.55)"
              strokeWidth={3}
              strokeDasharray="2 7"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          )}
          {/* Completed (solid emerald gradient) */}
          {doneSegs.length > 0 && (
            <path
              d={doneSegs.join(" ")}
              fill="none"
              stroke="rgb(16 185 129 / 0.85)"
              strokeWidth={4}
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          )}
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
  // Size 64/56/48 — use text-base for 3-digit ids so they fit cleanly.
  const idText = String(valley.id);
  const idClass = idText.length >= 3 ? "text-base" : "text-lg";

  return (
    <button
      onClick={onClick}
      style={{ left: `${x}%`, top: y }}
      className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
    >
      {isCurrent && (
        <span className="mb-1 whitespace-nowrap rounded-full bg-gradient-to-r from-teal-600 to-emerald-700 px-2.5 py-0.5 text-[10px] font-semibold text-white shadow-md">
          📍 Siz shu yerda
        </span>
      )}
      <span className="relative inline-flex items-center justify-center">
        {/* Animated pulse rings on the current node — radar ping effect */}
        {isCurrent && (
          <>
            <span className="absolute inline-flex size-20 rounded-full bg-teal-400/40 opacity-75 animate-ping" />
            <span className="absolute inline-flex size-16 rounded-full bg-teal-400/15" />
          </>
        )}
        <span
          className={cn(
            "relative flex items-center justify-center rounded-full font-bold transition active:scale-95",
            isCurrent
              ? "size-16 bg-gradient-to-br from-teal-500 via-teal-600 to-emerald-700 text-white shadow-lg shadow-emerald-600/40 ring-4 ring-white dark:ring-zinc-950"
              : isDone
              ? "size-14 bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-md shadow-emerald-500/30 ring-2 ring-white dark:ring-zinc-950"
              : "size-12 bg-gradient-to-br from-zinc-100 to-zinc-200 text-zinc-400 shadow-inner ring-2 ring-white dark:from-zinc-800 dark:to-zinc-900 dark:text-zinc-600 dark:ring-zinc-950"
          )}
        >
          {isDone ? (
            <span className="text-2xl drop-shadow-sm">✓</span>
          ) : status === "locked" ? (
            <LockGlyph />
          ) : (
            <span className={cn("font-bold drop-shadow-sm", idClass)}>{valley.id}</span>
          )}
        </span>
        {/* Story-available indicator */}
        {valley.hasStory && !isCurrent && (
          <span
            className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-amber-400 text-[10px] shadow ring-1 ring-white dark:ring-zinc-950"
            title="Hikoyali vodiy"
          >
            📖
          </span>
        )}
      </span>
      {label && (
        <span
          className={cn(
            "mt-1.5 max-w-[100px] truncate text-[10px] font-medium",
            isCurrent
              ? "text-teal-700 dark:text-teal-300"
              : isDone
              ? "text-emerald-700 dark:text-emerald-400"
              : "text-zinc-600 dark:text-zinc-400"
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
