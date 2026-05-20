"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ready, expand } from "@/lib/telegram-client";
import { cn } from "@/lib/cn";

const TABS = [
  { href: "/app",              label: "Bosh",      icon: HomeIcon },
  { href: "/app/memorize",     label: "Yodlash",   icon: BookIcon },
  { href: "/app/leaderboard",  label: "Reyting",   icon: TrophyIcon },
  { href: "/app/profile",      label: "Profile",   icon: UserIcon },
];

export function MiniAppShell({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    ready();
    expand();
  }, []);

  const pathname = usePathname();

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950">
      <main className="flex-1 pb-20">{children}</main>

      {/* Bottom Tab Bar */}
      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-zinc-200/80 bg-white/95 backdrop-blur-lg dark:border-zinc-800/80 dark:bg-zinc-900/95">
        <div className="mx-auto grid max-w-md grid-cols-4">
          {TABS.map((tab) => {
            const Active =
              tab.href === "/app"
                ? pathname === "/app"
                : pathname?.startsWith(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "flex flex-col items-center gap-1 py-2.5 text-[11px] transition-colors",
                  Active
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                )}
              >
                <tab.icon className="size-5" />
                {tab.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}
function UserIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
function TrophyIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}
function BookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
    </svg>
  );
}
