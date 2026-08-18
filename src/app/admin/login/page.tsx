"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/lib/validation/schemas";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: { email: string; password: string }) => {
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-near-black px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
        <div className="relative mx-auto mb-6 h-14 w-40">
          <Image src="/logo.png" alt="Light for Immigrants" fill className="object-contain" />
        </div>
        <h1 className="font-display text-center text-2xl font-bold">Admin Login</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
          <div>
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <input id="email" type="email" className="mt-1 w-full rounded-xl border px-4 py-3" {...register("email")} />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium">Password</label>
            <input id="password" type="password" className="mt-1 w-full rounded-xl border px-4 py-3" {...register("password")} />
          </div>
          {error && <p className="text-sm text-signal-red">{error}</p>}
          <button type="submit" disabled={isSubmitting} className="w-full rounded-full bg-signal-red py-3 font-semibold text-white">
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
