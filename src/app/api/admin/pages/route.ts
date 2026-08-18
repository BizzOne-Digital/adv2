import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { connectDB } from "@/lib/db/connect";
import { Page } from "@/models/Page";
import { pageUpdateSchema } from "@/lib/validation/schemas";
import { sanitizeRichText } from "@/lib/validation/sanitize";
import { revalidateContent, CACHE_TAGS } from "@/lib/seo/metadata";

export async function GET() {
  try {
    await requireAuth();
    await connectDB();
    const pages = await Page.find().sort({ title: 1 }).lean();
    return NextResponse.json(pages);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await requireAuth();
    const body = await request.json();
    const { slug, ...data } = body;
    if (!slug) return NextResponse.json({ error: "Slug required" }, { status: 400 });

    const parsed = pageUpdateSchema.safeParse(data);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    await connectDB();
    const update = { ...parsed.data };
    if (update.sections) {
      update.sections = update.sections.map((s) => ({
        ...s,
        bodyHtml: s.bodyHtml ? sanitizeRichText(s.bodyHtml) : s.bodyHtml,
      }));
    }

    const page = await Page.findOneAndUpdate(
      { slug },
      { ...update, updatedBy: session.userId },
      { new: true },
    );

    if (!page) return NextResponse.json({ error: "Not found" }, { status: 404 });

    revalidateContent([CACHE_TAGS.pages], [`/${slug}`, "/"]);
    return NextResponse.json(page);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
