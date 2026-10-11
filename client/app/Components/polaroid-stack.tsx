"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ChevronDown, ChevronUp } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";

export type PolaroidItem = {
  id: number;
  slug: string;
  title: string;
  image: string | null;
  alt: string;
  unoptimized: boolean;
};

const TILTS = [-3, 2.5, -2, 3, -2.5, 2];

function Polaroid({ item, interactive }: { item: PolaroidItem; interactive: boolean }) {
  return (
    <Link
      href={`/services/${item.slug}`}
      tabIndex={interactive ? 0 : -1}
      className="group relative flex h-full flex-col rounded-[4px] bg-white p-3 pb-0 shadow-[0_22px_50px_rgba(15,23,42,0.35)] ring-1 ring-black/5"
    >
      <span
        aria-hidden="true"
        className="absolute -top-3 left-1/2 z-10 h-6 w-20 -translate-x-1/2 -rotate-3 bg-amber-200/80 shadow-sm"
      />
      <div className="relative flex-1 overflow-hidden bg-slate-200">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.alt}
            fill
            unoptimized={item.unoptimized}
            sizes="(max-width: 768px) 80vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-950" />
        )}
      </div>
      <div className="flex h-16 items-center justify-center gap-2 px-2">
        <span className="truncate text-center text-lg font-semibold text-slate-900">{item.title}</span>
        <ArrowUpRight aria-hidden="true" className="size-4 shrink-0 text-slate-500 transition group-hover:text-slate-900" />
      </div>
    </Link>
  );
}

export default function PolaroidStack({ items, empty }: { items: PolaroidItem[]; empty: string }) {
  const count = items.length;
  const rootRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef(0);
  const [index, setIndex] = useState(0);

  const set = useCallback((next: number) => {
    indexRef.current = next;
    setIndex(next);
  }, []);

  const move = useCallback(
    (dir: 1 | -1) => {
      const next = indexRef.current + dir;
      if (next < 0 || next > count - 1) return false;
      set(next);
      return true;
    },
    [count, set],
  );

  // Let the page pager hand swipes to the stack first (mobile only).
  useEffect(() => {
    const section = rootRef.current?.closest<HTMLElement>("[data-snap-section]");
    if (!section) return;
    const isMobile = () => window.matchMedia("(max-width: 767px)").matches;
    const onStep = (event: Event) => {
      if (!isMobile()) return;
      const { dir } = (event as CustomEvent<{ dir: 1 | -1 }>).detail;
      if (move(dir)) event.preventDefault();
    };
    const onEnter = (event: Event) => {
      if (!isMobile()) return;
      const { dir } = (event as CustomEvent<{ dir: 1 | -1 }>).detail;
      set(dir > 0 ? 0 : count - 1);
    };
    section.addEventListener("pager-step", onStep);
    section.addEventListener("pager-enter", onEnter);
    return () => {
      section.removeEventListener("pager-step", onStep);
      section.removeEventListener("pager-enter", onEnter);
    };
  }, [count, move, set]);

  if (count === 0) {
    return <p className="rounded-2xl bg-white p-6 text-slate-700 dark:bg-slate-900 dark:text-slate-200">{empty}</p>;
  }

  return (
    <>
      {/* Mobile: stacked, swipe the top one away */}
      <div className="md:hidden">
        <div
          ref={rootRef}
          role="group"
          aria-roledescription="carousel"
          aria-label="Services"
          className="relative mx-auto h-[min(54dvh,440px)] w-[min(76vw,320px)]"
        >
          {items.map((item, i) => {
            const offset = i - index;
            const style: CSSProperties =
              offset < 0
                ? { transform: `translateY(-135%) rotate(${i % 2 ? 10 : -10}deg)`, opacity: 0, pointerEvents: "none", zIndex: count - i }
                : {
                    transform: `translateY(${offset * 16}px) scale(${1 - offset * 0.05}) rotate(${offset === 0 ? TILTS[i % TILTS.length] / 2 : TILTS[i % TILTS.length]}deg)`,
                    opacity: offset > 3 ? 0 : 1,
                    zIndex: count - i,
                  };
            return (
              <div
                key={item.id}
                aria-hidden={offset !== 0}
                className="absolute inset-0 transition-[transform,opacity] duration-700 ease-[cubic-bezier(.22,1,.36,1)] will-change-transform"
                style={style}
              >
                <Polaroid item={item} interactive={offset === 0} />
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => move(-1)}
            disabled={index === 0}
            aria-label="Previous service"
            className="grid size-11 place-items-center rounded-full border border-slate-300 bg-white transition disabled:opacity-30 dark:border-slate-700 dark:bg-slate-900"
          >
            <ChevronUp aria-hidden="true" className="size-5" />
          </button>
          <p className="min-w-16 text-center text-sm font-bold tabular-nums">
            {String(index + 1).padStart(2, "0")}
            <span className="text-slate-400"> / {String(count).padStart(2, "0")}</span>
          </p>
          <button
            type="button"
            onClick={() => move(1)}
            disabled={index === count - 1}
            aria-label="Next service"
            className="grid size-11 place-items-center rounded-full border border-slate-300 bg-white transition disabled:opacity-30 dark:border-slate-700 dark:bg-slate-900"
          >
            <ChevronDown aria-hidden="true" className="size-5" />
          </button>
        </div>
        <p className="mt-3 text-center text-xs text-slate-500 dark:text-slate-400">
          {index < count - 1 ? "Swipe up for the next service" : "Swipe up to continue"}
        </p>
      </div>

      {/* Desktop: side by side */}
      <div className="hidden justify-items-center gap-10 px-2 pt-4 md:grid md:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => (
          <div
            key={item.id}
            style={{ "--tilt": `${TILTS[i % TILTS.length]}deg` } as CSSProperties}
            className="aspect-[4/5] w-full max-w-sm rotate-[var(--tilt)] transition duration-500 ease-out hover:z-10 hover:-translate-y-3 hover:rotate-0 hover:scale-105"
          >
            <Polaroid item={item} interactive />
          </div>
        ))}
      </div>
    </>
  );
}