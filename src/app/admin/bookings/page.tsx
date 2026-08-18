import { connectDB } from "@/lib/db/connect";
import { Booking } from "@/models/Booking";

export default async function AdminBookingsPage() {
  await connectDB();
  const bookings = await Booking.find({ isDeleted: { $ne: true } })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  return (
    <div>
      <h2 className="font-display mb-8 text-3xl font-bold">Bookings</h2>
      <div className="admin-card overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-warm-ivory/50">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Service</th>
              <th className="p-4">Preferred</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={String(b._id)} className="border-b">
                <td className="p-4">{b.firstName} {b.lastName}</td>
                <td className="p-4">{b.serviceName ?? "—"}</td>
                <td className="p-4">{b.preferredDate} {b.preferredTime}</td>
                <td className="p-4 capitalize">{b.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
