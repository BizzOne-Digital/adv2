"use client";

import { useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

type RouteTransitionProps = {
  children: React.ReactNode;
};

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function RouteTransition({ children }: RouteTransitionProps) {
  const pathname = usePathname();
  const reducedMotion = useSyncExternalStore(
    (onStoreChange) => {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      mq.addEventListener("change", onStoreChange);
      return () => mq.removeEventListener("change", onStoreChange);
    },
    () => prefersReducedMotion(),
    () => false,
  );

  if (reducedMotion) {
    return <>{children}</>;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 1 }}
        className="site-shell relative flex min-w-0 w-full flex-1 flex-col"
      >
        <AnimatePresence>
          <motion.div
            key={`curtain-${pathname}`}
            className={cn(
              "pointer-events-none fixed inset-0 z-[90] origin-left",
              "light-beam opacity-90",
            )}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: [0, 1, 0] }}
            transition={{
              duration: 0.7,
              times: [0, 0.45, 1],
              ease: ["easeInOut", "easeInOut"],
            }}
            aria-hidden
          />
        </AnimatePresence>
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
