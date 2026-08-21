import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { Inquiry } from "@/models/Booking";
import { contactSchema } from "@/lib/validation/schemas";
import { rateLimit, getClientIp } from "@/lib/auth/rate-limit";
import { notifyInquiryReceived } from "@/lib/email/notifications";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const limit = rateLimit(`inquiry:${ip}`, 5, 60_000);
  if (!limit.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const body = await request.json();
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    if (parsed.data.website) {
      return NextResponse.json({ ok: true });
    }

    await connectDB();
    await Inquiry.create({
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      email: parsed.data.email,
      phone: parsed.data.phone,
      topic: parsed.data.topic,
      message: parsed.data.message,
      consent: parsed.data.consent,
    });

    await notifyInquiryReceived(parsed.data);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unable to submit inquiry" }, { status: 500 });
  }
}
