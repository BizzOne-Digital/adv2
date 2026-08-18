import { connectDB } from "@/lib/db/connect";
import { Inquiry } from "@/models/Booking";

export default async function AdminInquiriesPage() {
  await connectDB();
  const inquiries = await Inquiry.find({ isDeleted: { $ne: true } })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  return (
    <div>
      <h2 className="font-display mb-8 text-3xl font-bold">Inquiries</h2>
      <div className="admin-card overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-warm-ivory/50">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Topic</th>
              <th className="p-4">Status</th>
              <th className="p-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.map((item) => (
              <tr key={String(item._id)} className="border-b">
                <td className="p-4">{item.firstName} {item.lastName}</td>
                <td className="p-4">{item.email}</td>
                <td className="p-4">{item.topic}</td>
                <td className="p-4 capitalize">{item.status}</td>
                <td className="p-4">{new Date(item.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
