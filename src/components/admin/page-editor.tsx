"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Section = Record<string, unknown>;

export function PageEditor({ page }: { page: Record<string, unknown> }) {
  const router = useRouter();
  const [sections, setSections] = useState<Section[]>(
    (page.sections as Section[]) ?? [],
  );
  const [status, setStatus] = useState<string>("idle");
  const hero = (page.hero as Record<string, string>) ?? {};

  const save = async () => {
    setStatus("saving");
    const res = await fetch("/api/admin/pages", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug: page.slug,
        sections,
        hero,
        status: "published",
      }),
    });
    setStatus(res.ok ? "saved" : "error");
    if (res.ok) router.refresh();
  };

  const updateSection = (index: number, field: string, value: string) => {
    setSections((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)),
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-3xl font-bold">{String(page.title)}</h2>
          <p className="text-muted">/{String(page.slug)}</p>
        </div>
        <button
          type="button"
          onClick={save}
          className="rounded-full bg-signal-red px-6 py-3 text-sm font-semibold text-white"
        >
          {status === "saving" ? "Saving..." : "Publish / Update"}
        </button>
      </div>

      <div className="admin-card p-6">
        <h3 className="font-semibold">Hero</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {["eyebrow", "heading", "subheading", "backgroundImage", "backgroundImageAlt"].map(
            (field) => (
              <div key={field}>
                <label className="text-sm capitalize">{field}</label>
                <input
                  className="mt-1 w-full rounded-lg border px-3 py-2"
                  value={hero[field] ?? ""}
                  onChange={(e) => {
                    hero[field] = e.target.value;
                  }}
                />
              </div>
            ),
          )}
        </div>
      </div>

      {sections.map((section, index) => (
        <details key={String(section.key)} className="admin-card p-6" open={index === 0}>
          <summary className="cursor-pointer font-semibold">
            {String(section.internalLabel ?? section.key)}
          </summary>
          <div className="mt-4 grid gap-4">
            {["eyebrow", "heading", "subheading"].map((field) => (
              <div key={field}>
                <label className="text-sm capitalize">{field}</label>
                <input
                  className="mt-1 w-full rounded-lg border px-3 py-2"
                  value={String(section[field] ?? "")}
                  onChange={(e) => updateSection(index, field, e.target.value)}
                />
              </div>
            ))}
            <div>
              <label className="text-sm">Body HTML</label>
              <textarea
                className="mt-1 w-full rounded-lg border px-3 py-2 font-mono text-sm"
                rows={4}
                value={String(section.bodyHtml ?? "")}
                onChange={(e) => updateSection(index, "bodyHtml", e.target.value)}
              />
            </div>
          </div>
        </details>
      ))}

      {status === "saved" && (
        <p className="text-accent-teal text-sm">Saved — frontend will revalidate automatically.</p>
      )}
      {status === "error" && (
        <p className="text-sm text-signal-red">Save failed. Check your session and try again.</p>
      )}
    </div>
  );
}
