import Link from "next/link";

export default function Landing() {
  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-zinc-200/80 dark:border-zinc-800/80">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-emerald-50 via-white to-amber-50 dark:from-emerald-950/40 dark:via-zinc-950 dark:to-amber-950/40" />
        <div className="mx-auto flex max-w-6xl flex-col items-center px-6 py-24 text-center sm:py-32">
          <span className="mb-6 inline-flex items-center rounded-full border border-emerald-200/60 bg-white/60 px-4 py-1.5 text-xs font-medium text-emerald-700 backdrop-blur dark:border-emerald-800/60 dark:bg-zinc-900/60 dark:text-emerald-300">
            <span className="mr-2 inline-block size-1.5 rounded-full bg-emerald-500" />
            6,236 oyat · 30 juz · 114 sura
          </span>
          <h1 className="max-w-3xl text-balance text-4xl font-semibold tracking-tight sm:text-6xl">
            Qur&apos;oni Karimni{" "}
            <span className="bg-gradient-to-br from-emerald-600 to-emerald-400 bg-clip-text text-transparent">
              ilmiy usulda
            </span>{" "}
            yodlang
          </h1>
          <p className="mt-6 max-w-2xl text-balance text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Telegram bot yordamida har kuni 10 daqiqadan yodlash. Takror, audio, oyat
            rasmlari, kunlik eslatma — barchasi bitta joyda. Yodlash safaringizni
            bugun boshlang.
          </p>
          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
            <a
              href="https://t.me/quranyodla_bot"
              target="_blank"
              rel="noopener"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-emerald-600 px-7 text-sm font-medium text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700"
            >
              <TelegramIcon className="size-5" />
              Telegram&apos;da boshlash
            </a>
            <Link
              href="/app"
              className="inline-flex h-12 items-center justify-center rounded-full border border-zinc-200 bg-white/80 px-7 text-sm font-medium text-zinc-900 backdrop-blur transition hover:bg-white dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-100 dark:hover:bg-zinc-900"
            >
              Webapp&apos;ni ko&apos;rish →
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-balance text-3xl font-semibold tracking-tight">
          Yodlashga qaratilgan asboblar
        </h2>
        <p className="mt-3 max-w-2xl text-zinc-600 dark:text-zinc-400">
          Har bir funksiya — yodlash samaradorligini oshirish uchun.
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <article
              key={f.title}
              className="group rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-zinc-800/80 dark:bg-zinc-900"
            >
              <div className="mb-4 inline-flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-2xl dark:bg-emerald-950/40">
                {f.emoji}
              </div>
              <h3 className="text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                {f.body}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-zinc-200/80 bg-white py-20 dark:border-zinc-800/80 dark:bg-zinc-900">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Bugundan boshlang
          </h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            Onboarding 30 soniya oladi. Birinchi oyatdan boshlab har kunlik
            taraqqiyotingizni kuzating.
          </p>
          <a
            href="https://t.me/quranyodla_bot"
            target="_blank"
            rel="noopener"
            className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-emerald-600 px-7 text-sm font-medium text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700"
          >
            <TelegramIcon className="size-5" />
            @quranyodla_bot
          </a>
        </div>
      </section>
    </main>
  );
}

const FEATURES = [
  {
    emoji: "📗",
    title: "Tizimli yodlash",
    body: "Har oyatni 3, 7, 11 marta takrorlang. Yangi → eski oyatlarga qaytib o'tib mustahkamlash.",
  },
  {
    emoji: "🎧",
    title: "Husary, Afasy, Sudais",
    body: "5 ta mashhur qori — yoqimli ovozda har bir oyatni eshiting va o'rganing.",
  },
  {
    emoji: "🖼",
    title: "Madani Mushaf rasmlari",
    body: "6,236 oyat rasmi avtomatik yuklanadi — bosma kitobdek ko'rinish.",
  },
  {
    emoji: "🔥",
    title: "Streak va Himmat",
    body: "Har kunlik aktivlik streak'ni saqlaydi. Himmat ballarini to'plang va levelda ko'taring.",
  },
  {
    emoji: "🏆",
    title: "Yutuqlar va reyting",
    body: "30+ yutuq, kunlik/haftalik/oylik top-10. Boshqa hofizlar bilan birga taraqqiy eting.",
  },
  {
    emoji: "📊",
    title: "Mening sahifam",
    body: "Mukammal statistika: necha oyat, qaysi sura, qancha vaqt — barcha keshlangan.",
  },
];

function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z" />
    </svg>
  );
}
