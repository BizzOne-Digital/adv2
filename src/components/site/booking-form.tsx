"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Calendar } from "lucide-react";
import { bookingSchema, type BookingInput } from "@/lib/validation/schemas";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ServiceOption = {
  _id?: string;
  title: string;
  slug?: string;
};

type BookingFormProps = {
  services?: Array<Record<string, unknown>>;
  className?: string;
};

export function BookingForm({ services = [], className }: BookingFormProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const serviceOptions = services as ServiceOption[];

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BookingInput>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      serviceId: "",
      serviceName: "",
      preferredDate: "",
      preferredTime: "",
      attendees: 1,
      notes: "",
      consent: undefined,
      website: "",
    },
  });

  const selectedServiceId = watch("serviceId");

  const onServiceChange = (serviceId: string) => {
    const service = serviceOptions.find((s) => String(s._id) === serviceId);
    setValue("serviceId", serviceId);
    setValue("serviceName", service?.title ?? "");
  };

  const onSubmit = async (data: BookingInput) => {
    setStatus("loading");
    setErrorMessage("");
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error ?? "Unable to submit booking. Please try again.");
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
        <label htmlFor="booking-website">Website</label>
        <input
          id="booking-website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("website")}
        />
      </div>

      <input type="hidden" {...register("serviceName")} />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="First name" error={errors.firstName?.message}>
          <input className={inputClass} autoComplete="given-name" {...register("firstName")} />
        </Field>
        <Field label="Last name" error={errors.lastName?.message}>
          <input className={inputClass} autoComplete="family-name" {...register("lastName")} />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Email" error={errors.email?.message}>
          <input type="email" className={inputClass} autoComplete="email" {...register("email")} />
        </Field>
        <Field label="Phone (optional)" error={errors.phone?.message}>
          <input type="tel" className={inputClass} autoComplete="tel" {...register("phone")} />
        </Field>
      </div>

      {serviceOptions.length > 0 && (
        <Field label="Service" error={errors.serviceId?.message}>
          <select
            className={inputClass}
            value={selectedServiceId}
            onChange={(e) => onServiceChange(e.target.value)}
          >
            <option value="">Select a service</option>
            {serviceOptions.map((service) => (
              <option key={String(service._id)} value={String(service._id)}>
                {service.title}
              </option>
            ))}
          </select>
        </Field>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Preferred date" error={errors.preferredDate?.message}>
          <div className="relative">
            <Calendar className="text-muted pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2" />
            <input
              type="date"
              className={cn(inputClass, "pl-11")}
              {...register("preferredDate")}
            />
          </div>
        </Field>
        <Field label="Preferred time" error={errors.preferredTime?.message}>
          <input type="time" className={inputClass} {...register("preferredTime")} />
        </Field>
      </div>

      <Field label="Number of attendees" error={errors.attendees?.message}>
        <input
          type="number"
          min={1}
          max={50}
          className={inputClass}
          {...register("attendees")}
        />
      </Field>

      <Field label="Notes (optional)" error={errors.notes?.message}>
        <textarea rows={4} className={cn(inputClass, "resize-y")} {...register("notes")} />
      </Field>

      <label className="flex items-start gap-3 text-sm">
        <input
          type="checkbox"
          className="mt-1 size-4 rounded border-border text-signal-red focus:ring-signal-red"
          {...register("consent")}
        />
        <span>
          I consent to Light for Immigrants contacting me about this booking request.
          {errors.consent && (
            <span className="mt-1 block text-signal-red">{errors.consent.message}</span>
          )}
        </span>
      </label>

      {status === "success" && (
        <p className="rounded-xl bg-accent-teal/10 px-4 py-3 text-sm text-accent-teal" role="status">
          Thank you — your booking request has been received. Our team will confirm shortly.
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
            Submitting...
          </>
        ) : (
          "Request booking"
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
