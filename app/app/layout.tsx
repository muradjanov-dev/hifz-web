import type { Metadata } from "next";
import { MiniAppShell } from "./_shell";

export const metadata: Metadata = {
  title: "Mening sahifam · Qur'on Yodlaymiz",
};

export default function MiniAppLayout({ children }: { children: React.ReactNode }) {
  return <MiniAppShell>{children}</MiniAppShell>;
}
