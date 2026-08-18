"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { contactSchema, type ContactInput } from "@/lib/validation/schemas";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ContactFormProps = {
  className?: string;
  topics?: string[];
  defaultTopic?: string;
};

const defaultTopics = [
  "General inquiry",
  "Programs & services",
  "Volunteering",
  "Partnerships",
  "Media",
  "Other",
];

export function ContactForm({
  className,
  topics = defaultTopics,
  defaultTopic,
}: ContactFormProps) {
  const initialTopic =
    defaultTopic && topics.includes(defaultTopic) ? defaultTopic : topics[0] ?? "";
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      topic: initialTopic,
      message: "",
      consent: undefined,
      website: "",
    },
  });

  const onSubmit = async (data: ContactInput) => {
    setStatus("loading");
    setErrorMessage("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error ?? "Unable to send message. Please try again.");
      }
      setStatus("success");
      reset();
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("space-y-6", className)}
      noValidate
    >
      <div className="absolute left-[-9999px]" aria-hidden>
        <label htmlFor="website">Website</label>
        <input
          id="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("website")}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="First name" error={errors.firstName?.message}>
          <input
            className={inputClass}
            autoComplete="given-name"
            {...register("firstName")}
          />
        </Field>
        <Field label="Last name" error={errors.lastName?.message}>
          <input
            className={inputClass}
            autoComplete="family-name"
            {...register("lastName")}
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Email" error={errors.email?.message}>
          <input
            type="email"
            className={inputClass}
            autoComplete="email"
            {...register("email")}
          />
        </Field>
        <Field label="Phone (optional)" error={errors.phone?.message}>
          <input
            type="tel"
            className={inputClass}
            autoComplete="tel"
            {...register("phone")}
          />
        </Field>
      </div>

      <Field label="Topic" error={errors.topic?.message}>
        <select className={inputClass} {...register("topic")}>
          {topics.map((topic) => (
            <option key={topic} value={topic}>
              {topic}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Message" error={errors.message?.message}>
        <textarea
          rows={5}
          className={cn(inputClass, "resize-y")}
          {...register("message")}
        />
      </Field>

      <label className="flex items-start gap-3 text-sm">
        <input
          type="checkbox"
          className="mt-1 size-4 rounded border-border text-signal-red focus:ring-signal-red"
          {...register("consent")}
        />
        <span>
          I consent to Light for Immigrants storing my information to respond to
          this inquiry.
          {errors.consent && (
            <span className="mt-1 block text-signal-red">{errors.consent.message}</span>
          )}
        </span>
      </label>

      {status === "success" && (
        <p className="rounded-xl bg-accent-teal/10 px-4 py-3 text-sm text-accent-teal" role="status">
          Thank you — your message has been sent. We will respond soon.
        </p>
      )}
      {status === "error" && (
        <p className="rounded-xl bg-signal-red/10 px-4 py-3 text-sm text-signal-red" role="alert">
          {errorMessage}
        </p>
      )}

      <Button type="submit" disabled={status === "loading"}>
        {status === "loading" ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Sending...
          </>
        ) : (
          "Send message"
        )}
      </Button>
    </form>
  );
}

const inputClass =
  "w-full rounded-xl border border-border bg-clean-white px-4 py-3 text-sm outline-none transition focus:border-signal-red";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium">{label}</label>
      {children}
      {error && <p className="mt-1 text-sm text-signal-red">{error}</p>}
    </div>
  );
}
