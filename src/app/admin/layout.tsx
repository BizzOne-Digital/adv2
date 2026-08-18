import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import "../globals.css";
import { DM_Sans, Syne } from "next/font/google";

const display = Syne({ variable: "--font-display", subsets: ["latin"], weight: ["700"] });
const body = DM_Sans({ variable: "--font-body", subsets: ["latin"] });

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="min-h-screen bg-warm-ivory antialiased">
        {session ? (
          <div className="flex min-h-screen">
            <AdminSidebar role={session.role} />
            <div className="flex flex-1 flex-col">
              <AdminTopbar user={session} />
              <main className="flex-1 p-4 md:p-8">{children}</main>
            </div>
          </div>
        ) : (
          children
        )}
      </body>
    </html>
  );
}
