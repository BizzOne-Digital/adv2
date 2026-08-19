"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

type SerializedSettings = Record<string, unknown>;

type NavService = {
  title: string;
  slug: string;
  category?: string;
};

type NavItem = {
  label: string;
  href: string;
  children?: NavService[];
};

type HeaderProps = {
  settings: SerializedSettings;
  services?: NavService[];
};

function buildMainNav(services: NavService[]): NavItem[] {
  return [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Services", href: "/services", children: services },
    { label: "Gallery", href: "/gallery" },
    { label: "Events", href: "/events" },
    { label: "Stories", href: "/testimonials" },
    { label: "Contact", href: "/contact" },
  ];
}

export function Header({ settings, services = [] }: HeaderProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const mobilePanelRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const servicesMenuRef = useRef<HTMLDivElement>(null);

  const mainNav = buildMainNav(services);

  const branding = settings.branding as Record<string, unknown> | undefined;
  const actions = settings.actions as Record<string, string> | undefined;
  const general = settings.general as Record<string, string> | undefined;
  const logo = (branding?.logo as string) ?? "/logo.png";
  const orgName = general?.organizationName ?? "Light for Immigrants";
  const volunteerUrl = actions?.volunteerUrl ?? "/get-involved";

  const showGlass = scrolled || !isHome;
  const overlayLight = isHome && !scrolled;

  const linkClass = (active: boolean) =>
    cn(
      "text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors",
      overlayLight
        ? active
          ? "text-signal-red"
          : "text-warm-ivory/90 hover:text-white"
        : active
          ? "text-signal-red"
          : "text-near-black hover:text-signal-red",
    );

  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      setMobileOpen(false);
      setMobileServicesOpen(false);
      setServicesOpen(false);
    });
  }, [pathname]);

  useEffect(() => {
    if (!servicesOpen) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!servicesMenuRef.current?.contains(event.target as Node)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [servicesOpen]);

  const trapFocus = useCallback((e: KeyboardEvent) => {
    if (!mobileOpen || !mobilePanelRef.current) return;
    const focusable = mobilePanelRef.current.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.key === "Tab") {
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    if (e.key === "Escape") {
      setMobileOpen(false);
      menuButtonRef.current?.focus();
    }
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", trapFocus);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", trapFocus);
    };
  }, [mobileOpen, trapFocus]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        showGlass ? "glass-header py-3 shadow-md" : "bg-transparent py-5",
      )}
    >
      <div className="mx-auto flex w-full min-w-0 max-w-7xl items-center justify-between gap-3 px-4 sm:gap-6 sm:px-6 lg:grid lg:grid-cols-[auto_1fr_auto] lg:px-8">
        <Link href="/" className="relative z-10 shrink-0">
          <Image
            src={logo}
            alt={orgName}
            width={180}
            height={52}
            className="h-10 w-auto md:h-11"
            priority
          />
        </Link>

        <nav
          className="hidden items-center justify-center gap-8 lg:flex"
          aria-label="Main"
        >
          {mainNav.map((item) => {
            if (item.children?.length) {
              const active = isActive(item.href);
              return (
                <div
                  key={item.href}
                  ref={servicesMenuRef}
                  className="relative"
                  onMouseEnter={() => setServicesOpen(true)}
                  onMouseLeave={() => setServicesOpen(false)}
                >
                  <button
                    type="button"
                    className={cn(
                      "flex items-center gap-1.5",
                      linkClass(active),
                    )}
                    aria-expanded={servicesOpen}
                    aria-haspopup="true"
                    onClick={() => setServicesOpen((open) => !open)}
                  >
                    {item.label}
                    <ChevronDown
                      className={cn(
                        "size-3.5 transition-transform",
                        servicesOpen && "rotate-180",
                      )}
                    />
                  </button>

                  <div
                    className={cn(
                      "absolute left-0 top-full z-50 pt-3 transition-all duration-200",
                      servicesOpen
                        ? "pointer-events-auto translate-y-0 opacity-100"
                        : "pointer-events-none -translate-y-1 opacity-0",
                    )}
                  >
                    <div
                      className={cn(
                        "min-w-[18rem] overflow-hidden rounded-xl border shadow-xl",
                        overlayLight
                          ? "border-warm-ivory/15 bg-near-black/95 text-warm-ivory"
                          : "border-border bg-clean-white text-near-black",
                      )}
                    >
                      <div className="border-b border-border/60 px-4 py-3">
                        <Link
                          href={item.href}
                          className="text-xs font-bold uppercase tracking-[0.16em] text-signal-red hover:underline"
                          onClick={() => setServicesOpen(false)}
                        >
                          View all services
                        </Link>
                      </div>
                      <ul className="max-h-[min(24rem,70vh)] overflow-y-auto py-2">
                        {item.children.map((service) => (
                          <li key={service.slug}>
                            <Link
                              href={`/services/${service.slug}`}
                              className={cn(
                                "block px-4 py-2.5 transition",
                                overlayLight
                                  ? "hover:bg-warm-ivory/10"
                                  : "hover:bg-warm-ivory",
                              )}
                              onClick={() => setServicesOpen(false)}
                            >
                              <span className="text-sm font-semibold leading-snug">
                                {service.title}
                              </span>
                              {service.category && (
                                <span
                                  className={cn(
                                    "mt-0.5 block text-[11px] uppercase tracking-wider",
                                    overlayLight ? "text-warm-ivory/55" : "text-muted",
                                  )}
                                >
                                  {service.category}
                                </span>
                              )}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <Link key={item.href} href={item.href} className={linkClass(isActive(item.href))}>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center justify-end gap-3 lg:flex">
          <Link
            href={volunteerUrl}
            className={cn(
              "rounded-md border px-6 py-3 text-[11px] font-bold uppercase tracking-[0.14em] transition",
              overlayLight
                ? "border-warm-ivory/50 text-warm-ivory hover:border-warm-ivory hover:bg-warm-ivory/10"
                : "border-near-black/25 text-near-black hover:border-signal-red hover:text-signal-red",
            )}
          >
            Volunteer
          </Link>
          <Link
            href="/contact"
            className="rounded-md bg-signal-red px-6 py-3 text-[11px] font-bold uppercase tracking-[0.14em] text-white shadow-[0_8px_30px_rgba(226,29,46,0.3)] transition hover:bg-deep-crimson"
          >
            Get Support
          </Link>
        </div>

        <button
          ref={menuButtonRef}
          type="button"
          className={cn(
            "rounded-lg p-2 lg:hidden",
            overlayLight ? "text-warm-ivory" : "text-near-black",
          )}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X /> : <Menu />}
        </button>
      </div>

      {mobileOpen && (
        <div
          id="mobile-menu"
          ref={mobilePanelRef}
          className="fixed inset-0 z-40 overflow-y-auto bg-near-black/95 px-4 pt-24 sm:px-6 lg:hidden"
          role="dialog"
          aria-modal="true"
        >
          <nav className="flex flex-col gap-5 text-lg uppercase tracking-widest text-warm-ivory">
            {mainNav.map((item) => {
              if (item.children?.length) {
                return (
                  <div key={item.href} className="flex flex-col gap-3">
                    <button
                      type="button"
                      className="flex items-center justify-between text-left"
                      aria-expanded={mobileServicesOpen}
                      onClick={() => setMobileServicesOpen((open) => !open)}
                    >
                      Services
                      <ChevronDown
                        className={cn(
                          "size-5 transition-transform",
                          mobileServicesOpen && "rotate-180",
                        )}
                      />
                    </button>
                    {mobileServicesOpen && (
                      <div className="flex flex-col gap-2 border-l border-warm-ivory/20 pl-4 text-sm normal-case tracking-normal">
                        <Link href="/services" onClick={() => setMobileOpen(false)}>
                          View all services
                        </Link>
                        {item.children.map((service) => (
                          <Link
                            key={service.slug}
                            href={`/services/${service.slug}`}
                            onClick={() => setMobileOpen(false)}
                          >
                            {service.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}>
                  {item.label}
                </Link>
              );
            })}
            <Link
              href={volunteerUrl}
              className="mt-4 rounded-full border border-warm-ivory/40 py-3 text-center"
              onClick={() => setMobileOpen(false)}
            >
              Volunteer
            </Link>
            <Link
              href="/contact"
              className="rounded-full bg-signal-red py-3 text-center font-semibold"
              onClick={() => setMobileOpen(false)}
            >
              Get Support
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
