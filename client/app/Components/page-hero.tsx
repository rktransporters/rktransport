import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import StillBackground from "./still-background";

export type HeroHighlight = { icon: ReactNode; label: string; value: string };

type Props = {
  crumb: string;
  title: string;
  subtitle?: string | null;
  imageUrl?: string | null;
  highlights?: HeroHighlight[];
  children?: ReactNode; // buttons
};

export default function PageHero({ crumb, title, subtitle, imageUrl, highlights = [], children }: Props) {
  const items = highlights.filter((item) => item.value);

  return (
    <section className="relative isolate flex min-h-[560px] items-end overflow-hidden bg-slate-950 text-white [clip-path:inset(0)] sm:min-h-[620px] lg:min-h-[680px]">
      <style>{`
        @keyframes ph-rise { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
        .ph-rise > * { opacity: 0; animation: ph-rise .7s ease-out forwards; }
        .ph-rise > *:nth-child(2) { animation-delay: .08s; }
        .ph-rise > *:nth-child(3) { animation-delay: .16s; }
        .ph-rise > *:nth-child(4) { animation-delay: .24s; }
        @media (prefers-reduced-motion: reduce) { .ph-rise > * { animation: none !important; opacity: 1 !important; } }
      `}</style>

      {/* Still photo (fixed to the screen, clipped to the hero) */}
      <StillBackground src={imageUrl} dim="bg-slate-950/10" />

      {/* Fallback glow, always behind everything */}
      <div aria-hidden="true" className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_top_right,rgba(148,163,184,0.25),transparent_55%)]" />
      <div aria-hidden="true" className="absolute -left-24 bottom-0 -z-10 size-96 rounded-full bg-amber-400/10 blur-3xl" />

      {/* Readability: dark at the bottom and behind the text, bright elsewhere */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-slate-950/20" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 hidden bg-gradient-to-r from-slate-950/70 via-slate-950/20 to-transparent lg:block" />

      <div className="mx-auto w-full max-w-7xl px-4 pb-8 pt-24 sm:px-6 sm:pb-10">
        <div className="ph-rise flex max-w-3xl flex-col items-start">
          <nav aria-label="Breadcrumb" className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm backdrop-blur-md">
            <Link href="/" className="text-white/75 transition hover:text-white">Home</Link>
            <ChevronRight aria-hidden="true" className="size-4 text-white/50" />
            <span className="font-semibold">{crumb}</span>
          </nav>

          <h1 className="mt-6 text-balance text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            {title}
            <span aria-hidden="true" className="mt-5 block h-1.5 w-20 rounded-full bg-amber-400" />
          </h1>

          {subtitle ? (
            <p className="mt-5 max-w-xl text-lg leading-8 text-white/85 sm:text-xl">{subtitle}</p>
          ) : <span />}

          {children ? <div className="mt-7 flex flex-wrap gap-3">{children}</div> : <span />}
        </div>

        {items.length > 0 && (
          <ul className="mt-10 grid divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/15 bg-slate-950/45 backdrop-blur-md sm:grid-flow-col sm:auto-cols-fr sm:divide-x sm:divide-y-0">
            {items.map((item) => (
              <li key={item.label} className="flex items-center gap-3 p-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-amber-400 text-slate-950">{item.icon}</span>
                <span className="min-w-0">
                  <span className="block text-xs uppercase tracking-wider text-white/60">{item.label}</span>
                  <span className="block truncate font-semibold">{item.value}</span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}