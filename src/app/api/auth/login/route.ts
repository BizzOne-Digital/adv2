import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { User } from "@/models/User";
import {
  createSession,
  setSessionCookie,
  verifyPassword,
} from "@/lib/auth/session";
import { loginSchema } from "@/lib/validation/schemas";
import { rateLimit, getClientIp } from "@/lib/auth/rate-limit";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const limit = rateLimit(`login:${ip}`, 5, 15 * 60_000);
  if (!limit.allowed) {
    return NextResponse.json({ error: "Too many login attempts" }, { status: 429 });
  }

  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
    }

    await connectDB();
    const user = await User.findOne({
      email: parsed.data.email.toLowerCase(),
      isActive: true,
    });

    if (!user || !(await verifyPassword(parsed.data.password, user.passwordHash))) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    user.lastLoginAt = new Date();
    await user.save();

    const token = await createSession({
      userId: String(user._id),
      email: user.email,
      name: user.name,
      role: user.role as "admin" | "editor",
    });
    await setSessionCookie(token);

    return NextResponse.json({
      user: { email: user.email, name: user.name, role: user.role },
    });
  } catch {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
