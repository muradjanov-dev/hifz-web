import { AdminShell } from "./_shell";

export const metadata = {
  title: "Admin · Qur'on Yodlaymiz",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
