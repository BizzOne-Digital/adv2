import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { connectDB } from "@/lib/db/connect";
import { Service } from "@/models/Service";
import { serviceCardSchema, serviceDetailSchema } from "@/lib/validation/schemas";
import { sanitizeRichText } from "@/lib/validation/sanitize";
import { revalidateContent, CACHE_TAGS } from "@/lib/seo/metadata";

export async function GET() {
  try {
    await requireAuth();
    await connectDB();
    const services = await Service.find({ isDeleted: { $ne: true } })
      .sort({ order: 1, title: 1 })
      .lean();
    return NextResponse.json(services);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireAuth();
    const body = await request.json();
    const parsed = serviceCardSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    await connectDB();
    const service = await Service.create({
      ...parsed.data,
      createdBy: session.userId,
      updatedBy: session.userId,
    });

    revalidateContent([CACHE_TAGS.services], ["/services", `/services/${service.slug}`]);
    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    const message = error instanceof Error && error.message.includes("duplicate")
      ? "Slug already exists"
      : "Unable to create service";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await requireAuth();
    const body = await request.json();
    const { id, tab, ...data } = body;
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const schema = tab === "detail" ? serviceDetailSchema : serviceCardSchema;
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const update = { ...parsed.data } as Record<string, unknown>;
    if (update.overviewHtml) update.overviewHtml = sanitizeRichText(String(update.overviewHtml));
    if (update.benefitsHtml) update.benefitsHtml = sanitizeRichText(String(update.benefitsHtml));
    if (update.eligibilityHtml) update.eligibilityHtml = sanitizeRichText(String(update.eligibilityHtml));

    await connectDB();
    const service = await Service.findByIdAndUpdate(
      id,
      { ...update, updatedBy: session.userId },
      { new: true },
    );

    if (!service) return NextResponse.json({ error: "Not found" }, { status: 404 });

    revalidateContent([CACHE_TAGS.services], ["/services", `/services/${service.slug}`]);
    return NextResponse.json(service);
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    await requireAuth("admin");
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    await connectDB();
    await Service.findByIdAndUpdate(id, { isDeleted: true, status: "archived" });
    revalidateContent([CACHE_TAGS.services], ["/services"]);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
