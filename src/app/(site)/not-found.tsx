import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] items-center py-24">
      <Container className="text-center">
        <p className="text-signal-red text-sm font-semibold uppercase tracking-widest">404</p>
        <h1 className="font-display mt-4 text-4xl font-bold md:text-6xl">Page not found</h1>
        <p className="text-muted mx-auto mt-4 max-w-md">
          The page you are looking for may have moved or is not yet published.
        </p>
        <Button href="/" className="mt-8">
          Return home
        </Button>
      </Container>
    </section>
  );
}
