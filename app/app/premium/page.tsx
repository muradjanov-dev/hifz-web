"use client";

import { useApi } from "@/lib/use-api";
import Link from "next/link";

type Quota = {
  is_premium: boolean;
  premium_expiry?: string | null;
  used_today: number;
  limit: number | null;
  remaining: number | null;
};

const BOT_USERNAME = "quranyodla_bot";

export default function PremiumPage() {
  const { data, isLoading } = useApi<Quota>("/api/me/quota");

  return (
    <div className="mx-auto max-w-md px-4 py-6 space-y-5">
      <header>
        <h1 className="text-xl font-semibold">💎 Premium</h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Yodlash safaringizni cheksiz qiling
        </p>
      </header>

      {/* Current status */}
      {isLoading ? (
        <div className="h-28 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
      ) : data?.is_premium ? (
        <section className="rounded-2xl border border-amber-200/60 bg-gradient-to-br from-amber-50 to-white p-5 dark:border-amber-900/40 dark:from-amber-950/30 dark:to-zinc-900">
          <p className="text-xs uppercase tracking-wide text-amber-700 dark:text-amber-400">Joriy holat</p>
          <p className="mt-1 text-2xl font-semibold">💎 Premium faol</p>
          {data.premium_expiry && (
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {data.premium_expiry} gacha amal qiladi
            </p>
          )}
        </section>
      ) : (
        <section className="rounded-2xl border border-zinc-200/80 bg-white p-5 dark:border-zinc-800/80 dark:bg-zinc-900">
          <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Joriy holat</p>
          <p className="mt-1 text-lg font-semibold">Bepul foydalanuvchi</p>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Bugun: {data?.used_today ?? 0} / {data?.limit ?? 5} oyat
          </p>
        </section>
      )}

      {/* Features comparison */}
      <section>
        <h2 className="mb-3 px-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Premium nima beradi?
        </h2>
        <div className="rounded-2xl border border-zinc-200/80 bg-white dark:border-zinc-800/80 dark:bg-zinc-900">
          <FeatureRow label="Yangi oyat / kun"     free="5 ta"          premium="Cheksiz" highlight />
          <FeatureRow label="Qori (audio)"          free="1 ta — Husary" premium="5 ta qori" highlight />
          <FeatureRow label="Himmat ko'paytirgich"  free="1×"            premium="2× ko'paytma" highlight />
          <FeatureRow label="Surah audio yuklab olish" free="—"          premium="✅" />
          <FeatureRow label="Batafsil grafiklar"    free="—"             premium="✅" />
          <FeatureRow label="Tafsir"                 free="—"             premium="✅" />
          <FeatureRow label="Oyatni rasm sifatida ulashish" free="—"     premium="✅" />
          <FeatureRow label="Reytingda yashirin"    free="—"             premium="✅" />
        </div>
      </section>

      {/* CTA */}
      {!data?.is_premium && (
        <>
          <section className="rounded-2xl border border-emerald-200/60 bg-gradient-to-br from-emerald-50 to-white p-5 dark:border-emerald-900/40 dark:from-emerald-950/30 dark:to-zinc-900">
            <p className="text-3xl font-semibold">
              <span className="text-emerald-700 dark:text-emerald-400">3 000</span>
              <span className="text-base text-zinc-600 dark:text-zinc-400"> so&apos;m / oy</span>
            </p>
            <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">
              Bir piyola choy narxiga — oyiga yodlash uchun cheksiz imkoniyat.
            </p>
            <a
              href={`https://t.me/${BOT_USERNAME}?start=premium`}
              className="mt-4 flex h-12 items-center justify-center gap-2 rounded-full bg-emerald-600 text-sm font-medium text-white shadow-lg shadow-emerald-600/20"
            >
              <TelegramIcon className="size-4" />
              Bot orqali chek yuborish
            </a>
            <p className="mt-3 text-center text-[11px] text-zinc-500 dark:text-zinc-400">
              Botda &quot;💎 Premium&quot; tugmasini bosib chek rasmini yuboring.
              Admin tasdiqlagandan keyin darhol faollashadi.
            </p>
          </section>

          {/* Trial CTA */}
          <section className="rounded-2xl bg-zinc-100 p-4 text-center dark:bg-zinc-900">
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              🎁 Birinchi marta sinab ko&apos;rasiz?{" "}
              <a
                href={`https://t.me/${BOT_USERNAME}?start=trial`}
                className="font-medium text-emerald-600 underline-offset-2 hover:underline dark:text-emerald-400"
              >
                3 kunlik bepul triallni faollashtirish
              </a>
            </p>
          </section>
        </>
      )}

      <Link
        href="/app"
        className="block text-center text-xs text-zinc-500 underline-offset-2 hover:underline dark:text-zinc-400"
      >
        ← Bosh sahifaga
      </Link>
    </div>
  );
}

function FeatureRow({
  label, free, premium, highlight,
}: {
  label: string; free: string; premium: string; highlight?: boolean;
}) {
  return (
    <div className="grid grid-cols-3 items-center gap-2 border-b border-zinc-100 px-4 py-3 last:border-0 dark:border-zinc-800">
      <p className="col-span-1 text-xs font-medium text-zinc-700 dark:text-zinc-300">{label}</p>
      <p className="col-span-1 text-center text-xs text-zinc-500 dark:text-zinc-400">{free}</p>
      <p className={`col-span-1 text-right text-xs ${highlight ? "font-semibold text-emerald-700 dark:text-emerald-400" : "text-zinc-700 dark:text-zinc-300"}`}>
        {premium}
      </p>
    </div>
  );
}

function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z" />
    </svg>
  );
}
