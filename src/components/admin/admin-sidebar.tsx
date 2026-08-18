"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  MessageSquare,
  HelpCircle,
  Users,
  Calendar,
  ShoppingBag,
  DollarSign,
  Inbox,
  FolderOpen,
  Settings,
  UserCog,
} from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/pages", label: "Pages", icon: FileText },
  { href: "/admin/services", label: "Services", icon: Briefcase },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquare },
  { href: "/admin/faqs", label: "FAQs", icon: HelpCircle },
  { href: "/admin/team", label: "Team", icon: Users },
  { href: "/admin/bookings", label: "Bookings", icon: Calendar },
  { href: "/admin/products", label: "Products", icon: ShoppingBag },
  { href: "/admin/pricing", label: "Pricing", icon: DollarSign },
  { href: "/admin/inquiries", label: "Inquiries", icon: Inbox },
  { href: "/admin/media", label: "Media Library", icon: FolderOpen },
  { href: "/admin/settings", label: "Settings", icon: Settings },
  { href: "/admin/users", label: "Users", icon: UserCog, adminOnly: true },
];

export function AdminSidebar({ role }: { role: string }) {
  const pathname = usePathname();

  return (
    <aside className="admin-sidebar hidden w-64 shrink-0 flex-col p-4 md:flex">
      <Link href="/admin" className="font-display mb-8 text-lg font-bold">
        LFI Admin
      </Link>
      <nav className="flex flex-1 flex-col gap-1 text-sm">
        {links
          .filter((l) => !l.adminOnly || role === "admin")
          .map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors",
                pathname === href ? "bg-signal-red text-white" : "hover:bg-white/10",
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
      </nav>
      <Link href="/" className="mt-4 text-xs text-warm-ivory/60 hover:text-white">
        View site →
      </Link>
    </aside>
  );
}
