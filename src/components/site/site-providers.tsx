"use client";

import { SmoothScroll } from "@/components/motion/smooth-scroll";

export function SiteProviders({ children }: { children: React.ReactNode }) {
  return <SmoothScroll className="site-shell flex min-h-full min-w-0 w-full flex-col">{children}</SmoothScroll>;
}
