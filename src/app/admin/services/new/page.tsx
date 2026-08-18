"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/utils";

export default function NewServicePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Settlement");
  const [shortDescription, setShortDescription] = useState("");
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/admin/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        slug: slugify(title),
        category,
        shortDescription,
        status: "published",
      }),
    });
    if (res.ok) {
      router.push("/admin/services");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error ?? "Failed");
    }
  };

  return (
    <form onSubmit={submit} className="admin-card max-w-xl space-y-4 p-6">
      <h2 className="font-display text-2xl font-bold">New Service</h2>
      <input className="w-full rounded-lg border px-3 py-2" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <input className="w-full rounded-lg border px-3 py-2" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} required />
      <textarea className="w-full rounded-lg border px-3 py-2" placeholder="Short description" value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} rows={3} />
      {error && <p className="text-sm text-signal-red">{error}</p>}
      <button type="submit" className="rounded-full bg-signal-red px-6 py-2 text-white">Create</button>
    </form>
  );
}
