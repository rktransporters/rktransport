"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";

export type ShowcaseItem = {
  id: number;
  slug: string;
  title: string;
  image: string | null;
  alt: string;
  unoptimized: boolean;
};

export default function ServiceShowcase({ items, empty }: { items: ShowcaseItem[]; empty: string }) {
  const [active, setActive] = useState(0);

  if (items.length === 0) {
    return (
      <p className="rounded-2xl bg-white p-6 text-slate-700 dark:bg-slate-900 dark:text-slate-200">{empty}</p>
    );
  }

  return (
    <div
      role="list"
      aria-label="Services"
      className="flex h-[min(64dvh,540px)] flex-col gap-3 md:h-[30rem] md:flex-row lg:h-[34rem]"
    >
      {items.map((item, i) => {
        const open = i === active;
        return (
          <Link
            key={item.id}
            role="listitem"
            href={`/services/${item.slug}`}
            aria-label={item.title}
            aria-current={open ? "true" : undefined}
            // Hover only for a real mouse (touch taps also fire fake hover events).
            onPointerEnter={(event) => {
              if (event.pointerType === "mouse") setActive(i);
            }}
            // Keyboard focus only (a tap also focuses the link).
            onFocus={(event) => {
              if (event.currentTarget.matches(":focus-visible")) setActive(i);
            }}
            // First tap on a closed panel opens it; tapping the open one follows the link.
            onClick={(event) => {
              if (!open) {
                event.preventDefault();
                setActive(i);
              }
            }}
            className={`group relative isolate min-h-0 min-w-0 overflow-hidden rounded-3xl bg-slate-900 text-white shadow-lg shadow-slate-900/15 outline-none ring-offset-2 transition-[flex-grow] duration-700 ease-[cubic-bezier(.22,1,.36,1)] focus-visible:ring-2 focus-visible:ring-slate-900 ${
              open ? "flex-[6]" : "flex-1"
            }`}
          >
            {item.image ? (
              <Image
                src={item.image}
                alt={item.alt}
                fill
                unoptimized={item.unoptimized}
                sizes="(max-width: 768px) 100vw, 60vw"
                className={`-z-20 object-cover transition-transform duration-1000 ${open ? "scale-100" : "scale-110"}`}
              />
            ) : (
              <div aria-hidden="true" className="absolute inset-0 -z-20 bg-gradient-to-br from-slate-700 to-slate-950" />
            )}

            <div
              aria-hidden="true"
              className={`absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/20 to-black/10 transition-opacity duration-700 ${open ? "opacity-100" : "opacity-0"}`}
            />
            <div
              aria-hidden="true"
              className={`absolute inset-0 -z-10 bg-slate-950/55 transition-opacity duration-700 ${open ? "opacity-0" : "opacity-100"}`}
            />

            <span
              className={`absolute left-4 top-4 grid size-10 place-items-center rounded-full text-xs font-bold backdrop-blur transition-colors duration-500 ${
                open ? "bg-amber-400 text-slate-950" : "bg-white/15 text-white"
              }`}
            >
              {String(i + 1).padStart(2, "0")}
            </span>

            <span
              aria-hidden="true"
              className={`absolute bottom-4 left-5 right-5 truncate text-base font-semibold transition-opacity duration-500 md:left-1/2 md:right-auto md:top-20 md:bottom-auto md:-translate-x-1/2 md:text-lg md:[writing-mode:vertical-rl] md:rotate-180 ${
                open ? "pointer-events-none opacity-0" : "opacity-100 delay-300"
              }`}
            >
              {item.title}
            </span>

            <div
              className={`absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 transition-all duration-700 sm:p-7 ${
                open ? "translate-y-0 opacity-100 delay-200" : "pointer-events-none translate-y-4 opacity-0"
              }`}
            >
              <div className="min-w-0">
                <span aria-hidden="true" className="mb-3 block h-1 w-12 rounded-full bg-amber-400" />
                <h3 className="truncate text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">{item.title}</h3>
                <p className="mt-2 text-sm font-semibold text-white/75">View service</p>
              </div>
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-white text-slate-950 transition duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:bg-amber-400">
                <ArrowUpRight aria-hidden="true" className="size-5" />
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}