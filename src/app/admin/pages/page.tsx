import Link from "next/link";
import { connectDB } from "@/lib/db/connect";
import { Page } from "@/models/Page";

export default async function AdminPagesPage() {
  await connectDB();
  const pages = await Page.find().sort({ title: 1 }).lean();

  return (
    <div>
      <h2 className="font-display text-3xl font-bold">Pages</h2>
      <p className="text-muted mt-1 mb-8">Edit hero and section content for each public page.</p>
      <div className="admin-card overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-warm-ivory/50">
            <tr>
              <th className="p-4">Title</th>
              <th className="p-4">Slug</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pages.map((page) => (
              <tr key={String(page._id)} className="border-b">
                <td className="p-4 font-medium">{page.title}</td>
                <td className="p-4 text-muted">/{page.slug}</td>
                <td className="p-4 capitalize">{page.status}</td>
                <td className="p-4">
                  <Link href={`/admin/pages/${page.slug}`} className="text-signal-red font-medium">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
