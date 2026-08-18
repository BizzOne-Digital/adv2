import Link from "next/link";
import { connectDB } from "@/lib/db/connect";
import { Service } from "@/models/Service";

export default async function AdminServicesPage() {
  await connectDB();
  const services = await Service.find({ isDeleted: { $ne: true } })
    .sort({ order: 1 })
    .lean();

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h2 className="font-display text-3xl font-bold">Services</h2>
        <Link href="/admin/services/new" className="rounded-full bg-signal-red px-4 py-2 text-sm text-white">
          Add service
        </Link>
      </div>
      <div className="admin-card overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-warm-ivory/50">
            <tr>
              <th className="p-4">Title</th>
              <th className="p-4">Category</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((s) => (
              <tr key={String(s._id)} className="border-b">
                <td className="p-4">{s.title}</td>
                <td className="p-4">{s.category}</td>
                <td className="p-4 capitalize">{s.status}</td>
                <td className="p-4">
                  <Link href={`/admin/services/${s._id}`} className="text-signal-red">Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
