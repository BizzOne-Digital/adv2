"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export function ServicesFilter({ categories }: { categories: string[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get("category") ?? "";
  const q = searchParams.get("q") ?? "";

  const update = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      router.push(`/services?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  return (
    <div className="flex w-full min-w-0 flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex min-w-0 flex-wrap gap-2">
        <button
          type="button"
          onClick={() => update("category", "")}
          className={`rounded-full px-4 py-2 text-sm ${!current ? "bg-signal-red text-white" : "bg-white border border-border"}`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => update("category", cat)}
            className={`rounded-full px-4 py-2 text-sm ${current === cat ? "bg-signal-red text-white" : "bg-white border border-border"}`}
          >
            {cat}
          </button>
        ))}
      </div>
      <input
        type="search"
        placeholder="Search services..."
        defaultValue={q}
        className="w-full min-w-0 rounded-full border border-border bg-white px-4 py-2.5 text-sm md:max-w-xs lg:max-w-sm"
        onChange={(e) => update("q", e.target.value)}
        aria-label="Search services"
      />
    </div>
  );
}
