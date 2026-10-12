
"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { apiRequest, type SiteSettings } from "../../lib/transport-api";
import ThemeToggle from "./theme-toggle";

export default function SiteHeader() {
  const pathname = usePathname();

  const { data: settings } = useQuery({
    queryKey: ["site-settings"],
    queryFn: () => apiRequest<SiteSettings>("/settings"),
  });

  const [menuPath, setMenuPath] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  const menuOpen = menuPath === pathname;
  const isHome = pathname === "/";
  const transparent = isHome && !scrolled;

  const links = [
    ["Home", "/"],
    ["Services", "/services"],
    ["Vehicles", "/cars"],
    ["Location", "/routes"],
    ["About us", "/about"],
    ["Review", "/review"],
  ];

  useEffect(() => {
    const updateScroll = () => setScrolled(window.scrollY > 32);

    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });

    return () => window.removeEventListener("scroll", updateScroll);
  }, [pathname]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setMenuPath(null));
    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  // Use exactly one logo throughout the entire website.
  const logo = settings?.logo_url;
  const brandName = settings?.brand_name || "RK Transport";

  const hours = settings
    ? settings.available_24_7
      ? settings.hours_label
      : null
    : "Available 24/7";

  const cta = settings?.header_cta_label || "Get a quote";
  const requestedHref = settings?.header_cta_href || "/review";

  const safeCtaHref =
    requestedHref.startsWith("/") &&
    !requestedHref.startsWith("//") &&
    requestedHref !== "/quote" &&
    requestedHref !== "/track"
      ? requestedHref
      : "/review";

  const isActive = (path: string) =>
    path === "/"
      ? pathname === "/"
      : pathname === path || pathname.startsWith(`${path}/`);

  return (
    <>
      <header
        className={`${
          isHome ? "fixed inset-x-0 top-0" : "sticky top-0"
        } z-40 transition-[background-color,border-color,box-shadow] duration-300 ${
          transparent
            ? "border-b border-transparent bg-transparent shadow-none"
            : "border-b border-slate-200/80 bg-stone-50/95 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/95"
        }`}
      >
        <div className="flex h-16 w-full items-center justify-between gap-3 px-4 sm:px-8">
          {/* Single site logo and brand name */}
          <Link
            href="/"
            aria-label={`${brandName} home`}
            aria-current={pathname === "/" ? "page" : undefined}
            className={`flex min-w-0 shrink-0 items-center gap-2 sm:gap-3 ${
              transparent ? "text-white" : "text-slate-900 dark:text-white"
            }`}
          >
            {logo ? (
              <span className="flex h-11 w-[76px] shrink-0 items-center justify-center overflow-hidden bg-transparent sm:w-[88px]">
                <Image
                  src={logo}
                  alt={`${brandName} logo`}
                  width={176}
                  height={88}
                  unoptimized
                  priority
                  sizes="88px"
                  className="block h-full w-full bg-transparent object-contain object-center"
                />
              </span>
            ) : (
              <span
                aria-hidden="true"
                className="grid size-10 shrink-0 place-items-center rounded-lg border border-current text-sm font-extrabold"
              >
                RK
              </span>
            )}

            <span className="truncate text-sm font-bold tracking-tight sm:text-base">
              {brandName}
            </span>
          </Link>

          {/* Desktop navigation */}
          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-1 md:flex lg:gap-2"
          >
            {links.map(([label, path]) => {
              const active = isActive(path);

              return (
                <Link
                  key={path}
                  href={path}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-full px-3 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                    transparent
                      ? "text-white hover:bg-white/15 focus-visible:outline-white"
                      : "text-slate-700 hover:bg-slate-200/70 hover:text-slate-900 focus-visible:outline-slate-500 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white"
                  } ${
                    active
                      ? transparent
                        ? "bg-white/20 font-semibold text-white"
                        : "bg-slate-900 font-semibold text-white dark:bg-white dark:text-slate-950"
                      : ""
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop actions */}
          <div className="hidden shrink-0 items-center gap-3 md:flex">
            {hours && (
              <span
                className={`whitespace-nowrap text-xs font-semibold ${
                  transparent
                    ? "text-white"
                    : "text-slate-800 dark:text-slate-300"
                }`}
              >
                {hours}
              </span>
            )}

            <ThemeToggle transparent={transparent} />

            <Link
              href={safeCtaHref}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-slate-900 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
            >
              {cta}
              <ArrowUpRight aria-hidden="true" className="size-4" />
            </Link>
          </div>

          {/* Mobile availability */}
          {hours && (
            <span
              className={`ml-auto whitespace-nowrap text-[10px] font-semibold min-[480px]:text-xs md:hidden ${
                transparent
                  ? "text-white"
                  : "text-slate-800 dark:text-slate-300"
              }`}
            >
              {hours}
            </span>
          )}

          {/* Mobile menu toggle */}
          <button
            type="button"
            className={`inline-grid size-10 shrink-0 place-items-center rounded-lg border transition-colors md:hidden ${
              transparent
                ? "border-white/50 text-white hover:bg-white/10"
                : "border-slate-300 text-slate-900 hover:bg-slate-100 dark:border-slate-700 dark:text-white dark:hover:bg-slate-800"
            }`}
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuPath(menuOpen ? null : pathname)}
          >
            {menuOpen ? (
              <X aria-hidden="true" size={21} />
            ) : (
              <Menu aria-hidden="true" size={21} />
            )}
          </button>
        </div>
      </header>

      {/* Mobile backdrop */}
      {menuOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          className="fixed inset-0 z-30 bg-slate-950/60 backdrop-blur-sm md:hidden"
          onClick={() => setMenuPath(null)}
        />
      )}

      {/* Mobile navigation drawer */}
      {menuOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className="fixed inset-x-0 top-16 z-40 max-h-[calc(100dvh-4rem)] overflow-y-auto border-b border-slate-200 bg-stone-50/95 px-6 py-6 text-slate-900 shadow-2xl backdrop-blur-xl md:hidden dark:border-slate-800 dark:bg-slate-950/95 dark:text-white"
        >
          <div className="flex flex-col gap-2">
            {links.map(([label, path]) => {
              const active = isActive(path);

              return (
                <Link
                  key={path}
                  href={path}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setMenuPath(null)}
                  className={`flex min-h-12 items-center justify-between rounded-2xl px-4 text-base font-medium transition-colors ${
                    active
                      ? "bg-slate-900 font-semibold text-white dark:bg-white dark:text-slate-950"
                      : "hover:bg-slate-200/60 dark:hover:bg-slate-900"
                  }`}
                >
                  <span>{label}</span>
                  <ArrowUpRight aria-hidden="true" className="size-4 opacity-50" />
                </Link>
              );
            })}
          </div>

          <div className="mt-6 flex flex-col gap-4 border-t border-slate-200/80 pt-6 dark:border-slate-800">
            {hours && (
              <div className="flex items-center justify-between px-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                <span>Status</span>
                <span className="inline-flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="size-2 animate-pulse rounded-full bg-amber-400"
                  />
                  {hours}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between px-2">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Theme
              </span>
              <ThemeToggle />
            </div>

            <Link
              href={safeCtaHref}
              onClick={() => setMenuPath(null)}
              className="mt-2 flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
            >
              {cta}
              <ArrowUpRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
        </nav>
      )}
    </>
  );
}
