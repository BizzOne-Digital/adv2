import type { Document } from "mongoose";

export function serialize<T>(doc: T): T {
  return JSON.parse(JSON.stringify(doc));
}

export function serializeDoc<T extends Document | Record<string, unknown>>(
  doc: T | null,
): Record<string, unknown> | null {
  if (!doc) return null;
  const obj =
    typeof (doc as Document).toObject === "function"
      ? (doc as Document).toObject({ virtuals: true })
      : doc;
  return JSON.parse(JSON.stringify(obj));
}

export function serializeDocs<T extends Document | Record<string, unknown>>(
  docs: T[],
): Record<string, unknown>[] {
  return docs.map((doc) => serializeDoc(doc)!);
}

export function toIdString(id: unknown): string {
  if (!id) return "";
  return String(id);
}
