"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  ArrowUp,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Route,
} from "lucide-react";
import { apiRequest, type SiteSettings } from "../../lib/transport-api";

const FALLBACK_WHATSAPP = "971561379697";
const FACEBOOK_URL = "https://www.facebook.com/profile.php?id=61550895523073";
const INSTAGRAM_URL = "https://www.instagram.com/liftuaecar";
const QUOTE_MESSAGE =
  "Hello RK Transport, I would like a quote for car transport between Dubai and Abu Dhabi. Please contact me with details.";

const DUBAI_POINTS = [
  "Bur Dubai",
  "Deira",
  "Al Quoz",
  "Jebel Ali",
  "Discovery Gardens",
  "International City",
  "Al Barsha",
  "JLT",
  "Dubai Marina",
  "Karama",
  "Satwa",
  "Al Nahda",
  "Silicon Oasis",
  "Al Qusais",
];

const ABU_DHABI_POINTS = [
  "Khalidiyah",
  "Mussafah",
  "City Center",
  "Yas Island",
  "Khalifa City",
  "MBZ City",
  "Al Reem Island",
  "Electra Street",
  "Hamdan Street",
  "Tourist Club Area",
];

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Cars", href: "/cars" },
  { label: "Routes", href: "/routes" },
  { label: "About us", href: "/about" },
  { label: "Reviews", href: "/reviews" },
];

export default function SiteFooter() {
  const { data: settings } = useQuery({
    queryKey: ["site-settings"],
    queryFn: () => apiRequest<SiteSettings>("/settings"),
  });

  const brand = settings?.brand_name || "RK Transport";
  const phone = settings?.phone_primary;
  const whatsappDigits = settings?.whatsapp?.replace(/\D/g, "") || FALLBACK_WHATSAPP;
  const quoteUrl = `https://wa.me/${whatsappDigits}?text=${encodeURIComponent(QUOTE_MESSAGE)}`;
  const hours = settings
    ? settings.available_24_7
      ? settings.hours_label || "Available 24/7"
      : settings.hours_label
    : "Available 24/7";

  // The supplied business pages are used as fallbacks when social URLs are not configured in settings.
  const socials = [
    { label: "Facebook", href: settings?.facebook_url || FACEBOOK_URL, icon: <FacebookIcon /> },
    { label: "Instagram", href: settings?.instagram_url || INSTAGRAM_URL, icon: <InstagramIcon /> },
    ...(settings?.tiktok_url
      ? [{ label: "TikTok", href: settings.tiktok_url, icon: <TikTokIcon /> }]
      : []),
  ];

  return (
    <footer
      data-snap-section
      data-label="Footer"
      className="relative overflow-hidden bg-slate-950 text-slate-300"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[60rem] -translate-x-1/2 rounded-full bg-sky-400/[0.07] blur-3xl"
      />

      <div className="relative py-8 sm:py-10">
        {/* Full-width CTA */}
        <div className="w-full px-5 pt-8 sm:px-8 sm:pt-10 lg:px-12 2xl:px-16">
          <div className="flex flex-col items-start justify-between gap-5 rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.09] to-white/[0.025] p-6 shadow-2xl shadow-black/10 backdrop-blur sm:p-8 lg:flex-row lg:items-center">
            <div className="max-w-3xl">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-sky-300">
                Reliable intercity car transport
              </p>
              <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl lg:text-3xl">
                Need your car moved between Dubai and Abu Dhabi?
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-400 sm:text-base">
                Get a quick quote on WhatsApp. Available 24/7.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3">
              <a
                href={quoteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-sky-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
              >
                <MessageCircle aria-hidden="true" className="size-4" />
                Get a quote
                <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" />
              </a>
              {phone && (
                <a
                  href={`tel:${phone}`}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 px-5 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                >
                  <Phone aria-hidden="true" className="size-4" />
                  Call us
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Main footer columns use the available viewport width */}
        <div className="grid w-full grid-cols-1 gap-8 px-5 py-8 sm:grid-cols-2 sm:px-8 lg:grid-cols-[1.35fr_0.8fr_1fr_1fr] lg:gap-10 lg:px-12 2xl:px-16">
          <div>
            <Link href="/" className="inline-flex text-xl font-bold tracking-tight text-white transition hover:text-sky-300">
              {brand}
            </Link>
            <p className="mt-3 max-w-lg text-sm leading-6 text-slate-400">
              {settings?.footer_blurb ||
                "RK Transport moves cars between Dubai and Abu Dhabi, recovers vehicles around the clock, and stores them securely."}
            </p>
            {hours && (
              <p className="mt-4 inline-flex min-h-9 items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.07] px-3.5 text-xs font-semibold text-emerald-200">
                <span aria-hidden="true" className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-50" />
                  <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
                </span>
                {hours}
              </p>
            )}
            <div className="mt-5">
              <p className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                Follow RK Transport
              </p>
              <ul className="flex gap-2.5">
                {socials.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Visit RK Transport on ${item.label}`}
                      title={item.label}
                      className="grid size-10 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 transition hover:-translate-y-0.5 hover:border-sky-300/40 hover:bg-sky-300/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                    >
                      {item.icon}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <nav aria-label="Footer navigation">
            <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-white">Quick links</h3>
            <ul className="mt-4 space-y-1">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex min-h-9 items-center text-sm text-slate-400 transition hover:translate-x-1 hover:text-sky-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-white">Contact</h3>
            <ul className="mt-4 space-y-3 text-sm">
              {phone && (
                <li>
                  <a href={`tel:${phone}`} className="flex items-start gap-3 text-slate-400 transition hover:text-white">
                    <Phone aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-sky-300" />
                    <span>{phone}</span>
                  </a>
                </li>
              )}
              {settings?.email && (
                <li>
                  <a href={`mailto:${settings.email}`} className="flex items-start gap-3 break-all text-slate-400 transition hover:text-white">
                    <Mail aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-sky-300" />
                    <span>{settings.email}</span>
                  </a>
                </li>
              )}
              {settings?.address_line && (
                <li className="flex items-start gap-3 text-slate-400">
                  <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-sky-300" />
                  <span className="leading-6">{settings.address_line}</span>
                </li>
              )}
              {hours && (
                <li className="flex items-start gap-3 text-slate-400">
                  <Clock aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-sky-300" />
                  <span>{hours}</span>
                </li>
              )}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-white">We cover</h3>
            <div className="mt-4 rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.025] p-5 transition hover:border-sky-300/25">
              <div className="grid size-10 place-items-center rounded-xl border border-sky-300/20 bg-sky-300/10 text-sky-200">
                <Route aria-hidden="true" className="size-5" />
              </div>
              <p className="mt-3 font-semibold text-white">
                {settings?.core_route_label || "Dubai ⇄ Abu Dhabi"}
              </p>
              <p className="mt-1.5 text-sm leading-5 text-slate-400">
                Safe, reliable car transport between the two cities.
              </p>
              <a href={quoteUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-sky-200 transition hover:text-white">
                Request transport <ArrowRight aria-hidden="true" className="size-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Compact coverage directory */}
        <section aria-labelledby="footer-coverage-heading" className="w-full px-5 pb-7 sm:px-8 lg:px-12 2xl:px-16">
          <div className="border-t border-white/[0.08] pt-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-10">
              <div className="shrink-0 lg:w-48">
                <h3 id="footer-coverage-heading" className="text-sm font-semibold text-white">Popular areas</h3>
                <p className="mt-1 text-xs leading-5 text-slate-500">Dubai and Abu Dhabi coverage</p>
              </div>
              <div className="grid min-w-0 flex-1 gap-5 sm:grid-cols-2 sm:gap-8">
                <div>
                  <p className="mb-2 text-xs font-semibold text-slate-300">Dubai <span className="ml-1 font-normal text-slate-500">{DUBAI_POINTS.length} areas</span></p>
                  <ul className="flex flex-wrap gap-x-3 gap-y-2">
                    {DUBAI_POINTS.map((point) => (
                      <li key={point} className="text-xs text-slate-500">{point}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="mb-2 text-xs font-semibold text-slate-300">Abu Dhabi <span className="ml-1 font-normal text-slate-500">{ABU_DHABI_POINTS.length} areas</span></p>
                  <ul className="flex flex-wrap gap-x-3 gap-y-2">
                    {ABU_DHABI_POINTS.map((point) => (
                      <li key={point} className="text-xs text-slate-500">{point}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Full-width bottom bar */}
      <div className="relative border-t border-white/10 bg-slate-950/80">
        <div className="flex w-full flex-col items-center justify-between gap-3 px-5 py-4 text-xs text-slate-500 sm:flex-row sm:px-8 lg:px-12 2xl:px-16">
          <p>© {new Date().getFullYear()} {brand}. All rights reserved.</p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="group inline-flex min-h-9 items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 text-xs font-medium text-slate-300 transition hover:border-white/20 hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
          >
            Back to top
            <ArrowUp aria-hidden="true" className="size-3 text-slate-400 transition-transform group-hover:-translate-y-0.5 group-hover:text-white" />
          </button>
        </div>
      </div>
    </footer>
  );
}

function CoverageCity({
  name,
  subtitle,
  points,
  accent,
}: {
  name: string;
  subtitle: string;
  points: string[];
  accent: "sky" | "violet";
}) {
  const accentClasses = accent === "sky"
    ? "border-sky-300/20 bg-sky-300/10 text-sky-200"
    : "border-violet-300/20 bg-violet-300/10 text-violet-200";

  return (
    <div className="bg-slate-950/35 p-5 sm:p-7">
      <div className="flex items-center gap-3">
        <div className={`grid size-10 shrink-0 place-items-center rounded-xl border ${accentClasses}`}>
          <MapPin aria-hidden="true" className="size-5" />
        </div>
        <div>
          <h4 className="font-bold text-white">{name} areas</h4>
          <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>
        </div>
        <span className="ml-auto rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs font-semibold tabular-nums text-slate-300">
          {points.length}
        </span>
      </div>
      <ul className="mt-5 flex flex-wrap gap-2">
        {points.map((point) => (
          <li key={point}>
            <span className="inline-flex min-h-8 items-center rounded-lg border border-white/[0.09] bg-white/[0.035] px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white">
              {point}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FacebookIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="size-[18px]">
      <path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H8v3h2.4V21h3.1Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-[18px]">
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="size-[18px]">
      <path d="M16.6 3c.3 2.2 1.6 3.6 3.9 3.8v2.9c-1.4.1-2.6-.3-3.8-1.1v5.3c0 3.4-2.4 5.6-5.4 5.6-3 0-5.3-2.3-5.3-5.2 0-3.2 2.7-5.5 6-5v3c-1.7-.4-3 .6-3 2 0 1.2.9 2.1 2.1 2.1 1.3 0 2.2-.8 2.2-2.5V3h2.3Z" />
    </svg>
  );
}
