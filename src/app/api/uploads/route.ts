import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { processUpload } from "@/lib/uploads/process";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const session = await requireAuth();
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const alt = String(formData.get("alt") ?? "");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const result = await processUpload(file, alt, session.userId);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 400 },
    );
  }
}
