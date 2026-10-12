"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useTheme } from "next-themes";

import { apiRequest, type SiteSettings } from "../../lib/transport-api";
import ThemeToggle from "./theme-toggle";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Vehicles", href: "/cars" },
  { label: "Routes", href: "/routes" },
  { label: "About us", href: "/about" },
  { label: "Reviews", href: "/review" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { data: settings } = useQuery({
    queryKey: ["site-settings"],
    queryFn: () => apiRequest<SiteSettings>("/settings"),
  });

  const isHome = pathname === "/";
  const isTransparent = isHome && !scrolled;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 32);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileMenuOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileMenuOpen]);

  const hours = settings
    ? settings.available_24_7
      ? settings.hours_label
      : null
    : "Available 24/7";

  const ctaLabel = settings?.header_cta_label || "Get a quote";
  const configuredHref = settings?.header_cta_href || "/review";

  const ctaHref =
    configuredHref.startsWith("/") &&
    !configuredHref.startsWith("//") &&
    configuredHref !== "/quote" &&
    configuredHref !== "/track"
      ? configuredHref
      : "/review";

  // Keep the logo image background transparent.
  // Use the configured theme-specific logo when available.
  const logo =
    isTransparent || resolvedTheme === "dark"
      ? settings?.logo_dark_url || settings?.logo_url
      : settings?.logo_url || settings?.logo_dark_url;

  const brandName = settings?.brand_name || "RK Transport";

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(href + "/");
  };

  const headerClassName = [
    "z-40 w-full transition-[background-color,border-color,box-shadow] duration-300",
    isHome ? "fixed inset-x-0 top-0" : "sticky top-0",
    isTransparent
      ? "border-b border-transparent bg-transparent shadow-none"
      : "border-b border-slate-200/80 bg-stone-50/95 shadow-sm backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/95",
  ].join(" ");

  const foregroundClass = isTransparent
    ? "text-white"
    : "text-slate-900 dark:text-white";

  const desktopLinkClass = (href: string) => {
    const active = isActive(href);

    return [
      "inline-flex min-h-10 items-center rounded-lg px-3 py-2 text-sm font-semibold transition-colors",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500",
      active
        ? isTransparent
          ? "bg-white/15 text-white"
          : "bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
        : isTransparent
          ? "text-white/85 hover:bg-white/10 hover:text-white"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white",
    ].join(" ");
  };

  const mobileLinkClass = (href: string) => {
    const active = isActive(href);

    return [
      "flex min-h-12 items-center justify-between rounded-xl px-4 py-3 text-base font-semibold transition-colors",
      active
        ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
        : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800",
    ].join(" ");
  };

  return (
    <>
      <header className={headerClassName}>
        <div className="mx-auto flex h-16 w-full max-w-[1600px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          {/* Logo and brand */}
          <Link
            href="/"
            aria-label={brandName + " home"}
            aria-current={pathname === "/" ? "page" : undefined}
            className={"flex min-w-0 shrink-0 items-center gap-2.5 " + foregroundClass}
          >
            <span className="relative flex h-10 w-24 shrink-0 items-center bg-transparent sm:w-28">
              {logo ? (
                <Image
                  src={logo}
                  alt={brandName + " logo"}
                  width={144}
                  height={48}
                  priority
                  unoptimized
                  className="!m-0 block h-full w-full bg-transparent object-contain object-left"
                />
              ) : (
                <span
                  aria-hidden="true"
                  className="grid size-9 place-items-center rounded-xl bg-emerald-800 text-sm font-extrabold text-white"
                >
                  RK
                </span>
              )}
            </span>

            <span className="max-w-[145px] truncate text-sm font-extrabold tracking-tight sm:max-w-none sm:text-base">
              {brandName}
            </span>
          </Link>

          {/* Desktop navigation */}
          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-1 lg:flex"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={desktopLinkClass(link.href)}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop actions */}
          <div className="hidden shrink-0 items-center gap-3 lg:flex">
            {hours && (
              <span
                className={
                  "hidden text-xs font-medium xl:inline " +
                  (isTransparent
                    ? "text-white/80"
                    : "text-slate-500 dark:text-slate-400")
                }
              >
                {hours}
              </span>
            )}

            <ThemeToggle />

            <Link
              href={ctaHref}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-emerald-800 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
            >
              {ctaLabel}
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>

          {/* Mobile and tablet actions */}
          <div className="flex shrink-0 items-center gap-2 lg:hidden">
            <ThemeToggle />

            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              aria-label={
                mobileMenuOpen
                  ? "Close navigation menu"
                  : "Open navigation menu"
              }
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
              className={
                "inline-flex size-11 items-center justify-center rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 " +
                (isTransparent
                  ? "text-white hover:bg-white/10"
                  : "text-slate-800 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-800")
              }
            >
              {mobileMenuOpen ? (
                <X size={23} aria-hidden="true" />
              ) : (
                <Menu size={23} aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div
            id="mobile-navigation"
            className="absolute inset-x-0 top-full z-50 border-b border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-950 lg:hidden"
          >
            <nav
              aria-label="Mobile navigation"
              className="mx-auto flex max-h-[calc(100dvh-4rem)] w-full max-w-[1600px] flex-col gap-1 overflow-y-auto px-4 py-4 sm:px-6"
            >
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={mobileLinkClass(link.href)}
                >
                  <span>{link.label}</span>

                  {isActive(link.href) && (
                    <span
                      aria-hidden="true"
                      className="size-2 rounded-full bg-emerald-600"
                    />
                  )}
                </Link>
              ))}

              {hours && (
                <p className="px-4 py-2 text-sm text-slate-500 dark:text-slate-400">
                  {hours}
                </p>
              )}

              <Link
                href={ctaHref}
                className="mt-2 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-800 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
              >
                {ctaLabel}
                <ArrowUpRight size={17} aria-hidden="true" />
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Backdrop behind the mobile menu */}
      {mobileMenuOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-30 cursor-default bg-black/30 lg:hidden"
        />
      )}
    </>
  );
}