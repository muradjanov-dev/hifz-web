"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/cn";

const NAV = [
  { href: "/admin",           label: "Overview" },
  { href: "/admin/users",     label: "Users" },
  { href: "/admin/premium",   label: "Premium" },
  { href: "/admin/broadcast", label: "Broadcast" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/admin/login") return <>{children}</>;

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950">
      <header className="border-b border-zinc-200/80 bg-white dark:border-zinc-800/80 dark:bg-zinc-900">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">🔐</span>
            <h1 className="text-sm font-semibold">Admin paneli</h1>
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
              Qur&apos;on Yodlaymiz
            </span>
          </div>
          <button
            onClick={logout}
            className="rounded-full border border-zinc-200 px-3 py-1 text-xs hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800"
          >
            Chiqish
          </button>
        </div>
        <nav className="border-t border-zinc-200/60 dark:border-zinc-800/60">
          <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4">
            {NAV.map((item) => {
              const active = pathname === item.href ||
                (item.href !== "/admin" && pathname?.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-4 py-2.5 text-xs font-medium border-b-2 transition",
                    active
                      ? "border-emerald-600 text-emerald-700 dark:text-emerald-400"
                      : "border-transparent text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </header>

      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-6 py-6">{children}</div>
      </main>
    </div>
  );
}
