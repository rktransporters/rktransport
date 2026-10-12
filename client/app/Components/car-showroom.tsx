"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Car, Users } from "lucide-react";
import { useState } from "react";

export type CarCard = {
  id: string | number;
  href: string;
  title: string;
  description: string;
  seats: string;
  chips: string[];
  image: string | null;
  unoptimized: boolean;
};

export default function CarShowroom({ items, empty }: { items: CarCard[]; empty: string }) {
  const [active, setActive] = useState(0);

  if (items.length === 0) {
    return <p className="rounded-2xl bg-stone-100 p-6 text-slate-700 dark:bg-slate-900 dark:text-slate-200">{empty}</p>;
  }

  const current = items[active] ?? items[0];

  return (
    <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
      {/* Stage */}
      <Link
        href={current.href}
        className="group relative isolate block h-[320px] overflow-hidden rounded-3xl bg-slate-900 text-white shadow-xl shadow-slate-900/15 sm:h-[420px] lg:h-[32rem]"
      >
        {items.map((item, i) => (
          <div key={item.id} aria-hidden={i !== active} className={`absolute inset-0 -z-20 transition-opacity duration-700 ${i === active ? "opacity-100" : "opacity-0"}`}>
            {item.image ? (
              <Image
                src={item.image}
                alt={i === active ? item.title : ""}
                fill
                unoptimized={item.unoptimized}
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover transition-transform duration-[1500ms] group-hover:scale-105"
              />
            ) : (
              <div className="grid h-full w-full place-items-center bg-gradient-to-br from-slate-700 to-slate-950">
                <Car aria-hidden="true" className="size-24 text-white/20" />
              </div>
            )}
          </div>
        ))}
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/15 to-black/10" />

        <span className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-white/90 px-3.5 py-1.5 text-xs font-bold text-slate-900 backdrop-blur">
          <Users aria-hidden="true" className="size-3.5" />
          {current.seats}
        </span>
        <span className="absolute right-5 top-5 text-sm font-bold tabular-nums text-white/80">
          {String(active + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
        </span>

        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
          <span aria-hidden="true" className="mb-3 block h-1 w-12 rounded-full bg-amber-400" />
          <h3 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">{current.title}</h3>
          <p className="mt-2 line-clamp-2 max-w-xl text-white/80">{current.description}</p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {current.chips.slice(0, 4).map((chip) => (
              <span key={chip} className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur">{chip}</span>
            ))}
            <span className="ml-auto inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-slate-950 transition group-hover:bg-amber-400">
              View details <ArrowUpRight aria-hidden="true" className="size-4" />
            </span>
          </div>
        </div>
      </Link>

      {/* Selector */}
      <ul role="tablist" aria-label="Choose a vehicle" className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0 [&::-webkit-scrollbar]:hidden">
        {items.map((item, i) => {
          const on = i === active;
          return (
            <li key={item.id} className="w-[72%] shrink-0 snap-start sm:w-[45%] lg:w-auto lg:flex-1">
              <button
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => setActive(i)}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                className={`relative flex h-full w-full items-center gap-4 overflow-hidden rounded-2xl border p-3 text-left transition duration-300 ${
                  on
                    ? "border-slate-950 bg-slate-950 text-white shadow-lg dark:border-white dark:bg-white dark:text-slate-950"
                    : "border-slate-200 bg-white hover:border-slate-400 dark:border-slate-800 dark:bg-slate-900"
                }`}
              >
                <span className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-slate-200 dark:bg-slate-800 sm:size-20">
                  {item.image ? (
                    <Image src={item.image} alt="" fill unoptimized={item.unoptimized} sizes="80px" className="object-cover" />
                  ) : (
                    <Car aria-hidden="true" className="absolute inset-0 m-auto size-7 text-slate-400" />
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className={`block text-xs font-bold tabular-nums ${on ? "text-amber-400 dark:text-amber-600" : "text-slate-400"}`}>{String(i + 1).padStart(2, "0")}</span>
                  <span className="block truncate text-base font-bold sm:text-lg">{item.title}</span>
                  <span className={`block truncate text-xs ${on ? "text-white/70 dark:text-slate-600" : "text-slate-500 dark:text-slate-400"}`}>{item.seats}</span>
                </span>
                <span aria-hidden="true" className={`absolute inset-y-0 left-0 w-1 bg-amber-400 transition-transform duration-300 ${on ? "scale-y-100" : "scale-y-0"}`} />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}