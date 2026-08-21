import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { Booking } from "@/models/Booking";
import { bookingSchema } from "@/lib/validation/schemas";
import { rateLimit, getClientIp } from "@/lib/auth/rate-limit";
import { notifyBookingReceived } from "@/lib/email/notifications";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const limit = rateLimit(`booking:${ip}`, 5, 60_000);
  if (!limit.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const body = await request.json();
    const parsed = bookingSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    if (parsed.data.website) {
      return NextResponse.json({ ok: true });
    }

    await connectDB();
    await Booking.create({
      ...parsed.data,
      serviceName: body.serviceName,
    });

    await notifyBookingReceived({
      ...parsed.data,
      serviceName: body.serviceName,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unable to submit booking" }, { status: 500 });
  }
}
