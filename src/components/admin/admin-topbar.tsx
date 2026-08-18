"use client";

import { useRouter } from "next/navigation";
import type { SessionPayload } from "@/lib/auth/session";

export function AdminTopbar({ user }: { user: SessionPayload }) {
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <header className="flex items-center justify-between border-b bg-white px-4 py-4 md:px-8">
      <div>
        <p className="text-muted text-xs uppercase tracking-widest">Admin</p>
        <h1 className="font-display text-lg font-bold">Content Management</h1>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm">{user.name}</span>
        <button
          type="button"
          onClick={logout}
          className="rounded-full border px-4 py-2 text-sm hover:border-signal-red hover:text-signal-red"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
