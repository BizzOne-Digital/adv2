"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="text-center">
        <h1 className="font-display text-3xl font-bold">Something went wrong</h1>
        <p className="text-muted mt-4">Please try again or return to the homepage.</p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 rounded-full bg-signal-red px-6 py-3 text-white"
        >
          Try again
        </button>
      </div>
    </section>
  );
}
