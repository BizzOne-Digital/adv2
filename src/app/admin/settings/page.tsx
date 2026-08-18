"use client";

import { useEffect, useState } from "react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, unknown> | null>(null);
  const [contact, setContact] = useState({ primaryEmail: "", phone: "", address: "" });
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => {
        setSettings(data);
        const c = data.contact ?? {};
        setContact({
          primaryEmail: c.primaryEmail ?? "",
          phone: c.phone ?? "",
          address: c.address ?? "",
        });
      });
  }, []);

  const save = async () => {
    setStatus("saving");
    const res = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contact }),
    });
    setStatus(res.ok ? "saved" : "error");
  };

  if (!settings) return <p>Loading...</p>;

  return (
    <div className="max-w-2xl space-y-6">
      <h2 className="font-display text-3xl font-bold">Settings</h2>
      <div className="admin-card space-y-4 p-6">
        <h3 className="font-semibold">Contact</h3>
        <p className="text-muted text-sm">Single source of truth for footer and Contact page.</p>
        <input className="w-full rounded-lg border px-3 py-2" placeholder="Primary email" value={contact.primaryEmail} onChange={(e) => setContact({ ...contact, primaryEmail: e.target.value })} />
        <input className="w-full rounded-lg border px-3 py-2" placeholder="Phone" value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} />
        <textarea className="w-full rounded-lg border px-3 py-2" placeholder="Address" value={contact.address} onChange={(e) => setContact({ ...contact, address: e.target.value })} rows={2} />
        <button type="button" onClick={save} className="rounded-full bg-signal-red px-6 py-2 text-white">Save contact settings</button>
        {status === "saved" && <p className="text-accent-teal text-sm">Saved — site will revalidate.</p>}
      </div>
    </div>
  );
}
