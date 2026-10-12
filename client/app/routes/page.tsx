import { MapPin, MessageCircle, Phone, Route, ArrowUpRight, Clock3, ShieldCheck } from "lucide-react";
import { BreadcrumbStructuredData } from "../Components/structured-data";
import StillBackground from "../Components/still-background";
import { generatePageMetadata } from "../../lib/seo";
import { apiImageUrl, publicApi, type Location, type PageCopy } from "../../lib/transport-api";

export const revalidate = 60;

const WHATSAPP_NUMBER = "971561379697";
const PHONE_NUMBER = "+971561379697";

const DUBAI_PICKUPS = [
  "Bur Dubai", "Deira", "Al Quoz", "Jebel Ali", "Discovery Gardens",
  "International City", "Al Barsha", "JLT", "Dubai Marina", "Karama",
  "Satwa", "Al Nahda", "Silicon Oasis", "Al Qusais",
];

const ABU_DHABI_DROPS = [
  "Khalidiyah", "Mussafah", "City Center", "Yas Island", "Khalifa City",
  "MBZ City", "Al Reem Island", "Electra Street", "Hamdan Street", "Tourist Club Area",
];

export function generateMetadata() {
  return generatePageMetadata("/routes", {
    title: "Dubai to Abu Dhabi Routes & Pickup Points | RK Transport",
    description: "Explore our daily car lift and transport routes covering all major neighborhoods across Dubai and Abu Dhabi.",
  });
}

export default async function RoutesPage() {
  const [settingsResult, locationsResult, copyResult] = await Promise.allSettled([
    publicApi.settings(),
    publicApi.locations(),
    publicApi.pageCopy(),
  ]);
  const settings = settingsResult.status === "fulfilled" ? settingsResult.value : null;
  const locations: Location[] = locationsResult.status === "fulfilled" ? locationsResult.value : [];
  const copy: PageCopy[] = copyResult.status === "fulfilled" ? copyResult.value : [];

  const phone = settings?.phone_primary || PHONE_NUMBER;
  const whatsappDigits = settings?.whatsapp?.replace(/\D/g, "") || WHATSAPP_NUMBER;
  const routeLabel = settings?.core_route_label || "Dubai ⇄ Abu Dhabi";
  const whatsappBase = `https://wa.me/${whatsappDigits}`;
  const rawBannerUrl =
    copy.find((item) => item.key === "locations_banner_url")?.value ||
    locations.find((location) => location.banner_image_url)?.banner_image_url;
  const bannerUrl = rawBannerUrl ? apiImageUrl(rawBannerUrl) || rawBannerUrl : undefined;

  return (
    <>
      <BreadcrumbStructuredData
        items={[
          { name: "Home", path: "/" },
          { name: "Routes & Coverage", path: "/routes" },
        ]}
      />

      <main className="bg-stone-50 text-slate-900 dark:bg-slate-950 dark:text-white">
        {/* Hero banner intentionally kept unchanged */}
        <section className="relative isolate overflow-hidden bg-slate-950 text-white [clip-path:inset(0)]">
          <StillBackground src={bannerUrl} />

          <div className="mx-auto w-full max-w-7xl px-4 pb-20 pt-32 sm:px-6 sm:pb-24 lg:min-h-[600px] lg:flex lg:flex-col lg:justify-end">
            <p className="text-sm font-bold uppercase tracking-[.2em] text-amber-400">Routes & Coverage</p>
            <h1 className="mt-3 text-balance text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
              Intercity Routes & Coverage Areas
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-white/85 sm:text-xl">
              {`We provide reliable, door-to-door car transport and daily car lift services across the core corridor between ${routeLabel}.`}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href={`${whatsappBase}?text=${encodeURIComponent("Hello RK Transport, I would like to ask about your routes.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-6 font-semibold text-slate-950 transition hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                <MessageCircle aria-hidden="true" className="size-5" />
                Ask about a route
              </a>
            </div>
          </div>
        </section>

        <div className="relative z-10 -mt-1 rounded-t-[2.5rem] bg-white shadow-[0_-25px_50px_rgba(0,0,0,0.18)] dark:bg-slate-950">
          <div className="mx-auto w-full max-w-[1500px] px-4 py-12 sm:px-6 sm:py-16 lg:px-10 lg:py-20">
            {/* Route overview */}
            <section aria-labelledby="primary-route-heading" className="relative overflow-hidden rounded-[2rem] bg-slate-950 text-white shadow-xl ring-1 ring-white/10">
              <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-28 size-80 rounded-full bg-amber-400/10 blur-3xl" />
              <div className="relative grid gap-8 p-6 sm:p-9 lg:grid-cols-[1.35fr_0.85fr] lg:items-center lg:p-12">
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-3.5 py-2 text-xs font-bold uppercase tracking-[.14em] text-slate-200">
                    <Route aria-hidden="true" className="size-4 text-amber-400" />
                    Primary service corridor
                  </span>
                  <h2 id="primary-route-heading" className="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                    {routeLabel}
                  </h2>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base sm:leading-8">
                    Travel between Dubai and Abu Dhabi with convenient pickup and drop-off options. Whether you are commuting for work, attending a meeting, or visiting family, contact our team to arrange a route that fits your schedule.
                  </p>
                  <div className="mt-7 flex flex-wrap gap-3">
                    <a
                      href={`${whatsappBase}?text=${encodeURIComponent("Hello RK Transport, I would like to book a ride between Dubai and Abu Dhabi.")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-amber-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                    >
                      <MessageCircle aria-hidden="true" className="size-4" />
                      Book this route
                      <ArrowUpRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                    <a
                      href={`tel:${phone}`}
                      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    >
                      <Phone aria-hidden="true" className="size-4" />
                      Call dispatch
                    </a>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
                  <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.06] p-5 sm:p-6">
                    <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-amber-400/15 text-amber-300">
                      <MapPin aria-hidden="true" className="size-6" />
                    </span>
                    <div>
                      <p className="text-2xl font-extrabold text-white">{DUBAI_PICKUPS.length}</p>
                      <p className="mt-1 text-sm text-slate-300">Dubai pickup areas listed</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.06] p-5 sm:p-6">
                    <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-emerald-400/15 text-emerald-300">
                      <ShieldCheck aria-hidden="true" className="size-6" />
                    </span>
                    <div>
                      <p className="text-2xl font-extrabold text-white">{ABU_DHABI_DROPS.length}</p>
                      <p className="mt-1 text-sm text-slate-300">Abu Dhabi drop-off areas listed</p>
                    </div>
                  </div>
                  <div className="hidden items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm text-slate-300 lg:flex">
                    <Clock3 aria-hidden="true" className="size-5 shrink-0 text-amber-300" />
                    Ask us about availability and timing for your preferred route.
                  </div>
                </div>
              </div>
            </section>

            {/* Pickup and drop-off areas */}
            <section aria-labelledby="coverage-heading" className="mt-14 sm:mt-20">
              <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[.2em] text-amber-600 dark:text-amber-400">Coverage directory</p>
                  <h2 id="coverage-heading" className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
                    Find your pickup or drop-off area
                  </h2>
                </div>
                <p className="max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-400">
                  Choose an area below, then message our team to confirm availability for your exact location.
                </p>
              </div>

              <div className="grid gap-5 xl:grid-cols-2">
                <CoverageCard
                  city="Dubai"
                  label="Pickup locations"
                  description="Popular neighborhoods for starting your journey."
                  points={DUBAI_PICKUPS}
                  accent="amber"
                />
                <CoverageCard
                  city="Abu Dhabi"
                  label="Drop-off locations"
                  description="Common destinations across the capital."
                  points={ABU_DHABI_DROPS}
                  accent="emerald"
                />
              </div>
            </section>

            {/* Custom route CTA */}
            <section className="mt-14 overflow-hidden rounded-[2rem] border border-slate-200 bg-gradient-to-br from-stone-100 to-white p-6 dark:border-slate-800 dark:from-slate-900 dark:to-slate-900/60 sm:mt-20 sm:p-10 lg:p-12">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-3xl">
                  <p className="text-xs font-bold uppercase tracking-[.2em] text-amber-700 dark:text-amber-400">Need a custom route?</p>
                  <h2 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
                    Don&apos;t see your exact pickup or drop-off area?
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
                    From JLT to Abu Dhabi, Deira to Mussafah, or Discovery Gardens to Khalifa City, contact RK Transport with your pickup point and destination. We&apos;ll help you check the available options.
                  </p>
                </div>
                <a
                  href={`${whatsappBase}?text=${encodeURIComponent("Hello RK Transport, I have a custom pickup or drop-off location. Can you confirm availability?")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-bold text-white transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
                >
                  <MessageCircle aria-hidden="true" className="size-4" />
                  Check my location
                  <ArrowUpRight aria-hidden="true" className="size-4" />
                </a>
              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}

function CoverageCard({
  city,
  label,
  description,
  points,
  accent,
}: {
  city: string;
  label: string;
  description: string;
  points: string[];
  accent: "amber" | "emerald";
}) {
  const accentClasses =
    accent === "amber"
      ? "bg-amber-500/10 text-amber-700 ring-amber-500/20 dark:text-amber-300"
      : "bg-emerald-500/10 text-emerald-700 ring-emerald-500/20 dark:text-emerald-300";

  return (
    <article className="group rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 sm:p-7">
      <div className="flex items-start gap-4">
        <span className={`grid size-12 shrink-0 place-items-center rounded-2xl ring-1 ${accentClasses}`}>
          <MapPin aria-hidden="true" className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-xl font-extrabold tracking-tight sm:text-2xl">{city}</h3>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {points.length} areas
            </span>
          </div>
          <p className="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</p>
          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{description}</p>
        </div>
      </div>

      <div className="my-5 h-px bg-slate-100 dark:bg-slate-800" />

      <ul className="flex flex-wrap gap-2" aria-label={`${city} ${label.toLowerCase()}`}>
        {points.map((point) => (
          <li
            key={point}
            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-amber-400/60 hover:bg-amber-50 hover:text-slate-950 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-200 dark:hover:border-amber-400/50 dark:hover:bg-amber-400/10 dark:hover:text-white"
          >
            {point}
          </li>
        ))}
      </ul>
    </article>
  );
}
