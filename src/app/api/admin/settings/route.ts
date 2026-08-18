import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { connectDB } from "@/lib/db/connect";
import { SiteSettings } from "@/models/SiteSettings";
import { revalidateContent, CACHE_TAGS } from "@/lib/seo/metadata";

export async function GET() {
  try {
    await requireAuth();
    await connectDB();
    let settings = await SiteSettings.findOne({ singletonKey: "main" }).lean();
    if (!settings) {
      settings = (await SiteSettings.create({ singletonKey: "main" })).toObject();
    }
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await requireAuth("admin");
    const body = await request.json();
    await connectDB();
    const settings = await SiteSettings.findOneAndUpdate(
      { singletonKey: "main" },
      { ...body, updatedBy: session.userId },
      { new: true, upsert: true },
    );
    revalidateContent([CACHE_TAGS.settings], ["/contact", "/"]);
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
