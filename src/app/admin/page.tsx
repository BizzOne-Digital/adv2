import Link from "next/link";
import { getDashboardStats } from "@/services/content";
import { connectDB } from "@/lib/db/connect";
import { SiteSettings } from "@/models/SiteSettings";
import { Inquiry, Booking } from "@/models/Booking";

export default async function AdminDashboard() {
  const stats = await getDashboardStats();
  await connectDB();
  const settings = await SiteSettings.findOne({ singletonKey: "main" }).lean();
  const contact = settings?.contact as { primaryEmail?: string } | undefined;

  const warnings: string[] = [];
  if (contact?.primaryEmail?.includes("gmail.com")) {
    warnings.push("Replace Gmail address with final domain email before launch.");
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-3xl font-bold">Dashboard</h2>
        <p className="text-muted mt-1">Live overview of your content and submissions.</p>
      </div>

      {warnings.length > 0 && (
        <div className="rounded-2xl border border-signal-red/30 bg-signal-red/5 p-4 text-sm">
          {warnings.map((w) => (
            <p key={w}>⚠ {w}</p>
          ))}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Services", stats.services, "/admin/services"],
          ["Inquiries", stats.inquiries, "/admin/inquiries"],
          ["Bookings", stats.bookings, "/admin/bookings"],
          ["Testimonials", stats.testimonials, "/admin/testimonials"],
          ["FAQs", stats.faqs, "/admin/faqs"],
          ["New inquiries", stats.unreadInquiries, "/admin/inquiries"],
        ].map(([label, count, href]) => (
          <Link key={String(label)} href={String(href)} className="admin-card p-6 hover:shadow-lg transition-shadow">
            <p className="text-muted text-sm">{label}</p>
            <p className="font-display mt-2 text-3xl font-bold">{count}</p>
          </Link>
        ))}
      </div>

      <div className="admin-card p-6">
        <h3 className="font-display text-xl font-bold">Quick actions</h3>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/admin/services/new" className="rounded-full bg-signal-red px-4 py-2 text-sm text-white">Add Service</Link>
          <Link href="/admin/inquiries" className="rounded-full border px-4 py-2 text-sm">View Inquiries</Link>
        </div>
      </div>
    </div>
  );
}
