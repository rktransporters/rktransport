import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import StillBackground from "./still-background";

export type HeroFact = { label: string; value: string; href?: string; icon?: ReactNode };
export type HeroHighlight = HeroFact;

type Props = {
  crumb: string;
  parent?: { label: string; href: string };
  watermark?: string;
  title: string;
  subtitle?: string | null;
  imageUrl?: string | null;
  highlights?: HeroFact[];
};

export default function PageHero({ crumb, parent, watermark, title, subtitle, imageUrl, highlights = [] }: Props) {
  const items = highlights.filter((item) => item.value);

  // The last word of the title is drawn in amber.
  const words = title.trim().split(/\s+/);
  const last = words.length > 1 ? words.pop() : null;
  const lead = words.join(" ");

  return (
    <section className="relative isolate flex min-h-[620px] flex-col justify-end overflow-hidden bg-slate-950 text-white [clip-path:inset(0)] lg:min-h-[720px]">
      <style>{`
        @keyframes ph-rise { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes ph-line { from { transform: translateY(-120%); } to { transform: translateY(320%); } }
        .ph-rise > * { opacity: 0; animation: ph-rise .7s ease-out forwards; }
        .ph-rise > *:nth-child(2) { animation-delay: .1s; }
        .ph-rise > *:nth-child(3) { animation-delay: .2s; }
        .ph-line { animation: ph-line 2.2s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .ph-rise > * { animation: none !important; opacity: 1 !important; }
          .ph-line { animation: none !important; }
        }
      `}</style>

      {/* Still photo (fixed to the screen, clipped to the hero) */}
      <StillBackground src={imageUrl} dim="bg-slate-950/25" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(245,158,11,0.14),transparent_50%)]" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-slate-950 via-slate-950/55 to-slate-950/10" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 hidden bg-gradient-to-r from-slate-950/80 via-slate-950/30 to-transparent lg:block" />

      {/* Giant outlined watermark */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-[-1%] top-[16%] z-0 hidden select-none whitespace-nowrap text-[22vw] font-black uppercase leading-none tracking-tighter text-transparent [-webkit-text-stroke:1.5px_rgba(255,255,255,0.14)] sm:block lg:text-[16vw]"
      >
        {watermark || crumb}
      </span>

      {/* Scroll cue (decorative) */}
      <div aria-hidden="true" className="absolute right-6 top-1/2 z-10 hidden -translate-y-1/2 flex-col items-center gap-3 xl:flex">
        <span className="text-[10px] font-semibold uppercase tracking-[.3em] text-white/60 [writing-mode:vertical-rl]">Scroll</span>
        <span className="relative h-16 w-px overflow-hidden bg-white/25">
          <span className="ph-line absolute inset-x-0 top-0 h-6 bg-amber-400" />
        </span>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-8 pt-32 sm:px-6 sm:pb-10">
        <div className="ph-rise max-w-4xl">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[.22em] text-white/65">
            <span aria-hidden="true" className="h-px w-8 bg-amber-400" />
            <Link href="/" className="transition hover:text-white">Home</Link>
            <span aria-hidden="true">/</span>
            {parent && (
              <>
                <Link href={parent.href} className="transition hover:text-white">{parent.label}</Link>
                <span aria-hidden="true">/</span>
              </>
            )}
            <span aria-current="page" className="text-white">{crumb}</span>
          </nav>

          <h1 className="mt-6 text-balance text-5xl font-black leading-[0.95] tracking-tighter sm:text-7xl lg:text-8xl">
            {lead}
            {last && <> <span className="text-amber-400">{last}</span></>}
          </h1>

          {subtitle && (
            <p className="mt-6 max-w-xl border-l-2 border-amber-400 pl-4 text-lg leading-8 text-white/80 sm:text-xl">{subtitle}</p>
          )}
        </div>

        {items.length > 0 && (
          <dl
            style={{ "--n": items.length } as CSSProperties}
            className="mt-12 grid sm:border-t sm:border-white/20 sm:[grid-template-columns:repeat(var(--n),minmax(0,1fr))]"
          >
            {items.map((item) => (
              <div
                key={item.label}
                className="border-t border-white/20 py-4 sm:border-l sm:border-t-0 sm:px-6 sm:first:border-l-0 sm:first:pl-0"
              >
                <dt className="text-[11px] font-semibold uppercase tracking-[.2em] text-amber-400">{item.label}</dt>
                <dd className="mt-1 truncate text-lg font-semibold sm:text-xl">
                  {item.href ? (
                    <a href={item.href} className="transition hover:text-amber-400">{item.value}</a>
                  ) : (
                    item.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  );
}