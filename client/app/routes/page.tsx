import { ArrowUpRight, Clock3, MapPin, MessageCircle, ShieldCheck } from "lucide-react";
import { BreadcrumbStructuredData } from "../Components/structured-data";
import RoutePlanner from "../Components/route-planner";
import StillBackground from "../Components/still-background";
import { generatePageMetadata } from "../../lib/seo";
import { apiImageUrl, publicApi, type Location, type PageCopy } from "../../lib/transport-api";

export const revalidate = 60;

const WHATSAPP_NUMBER = "971561379697";
const PHONE_NUMBER = "+971561379697";

const DUBAI_FALLBACK = [
  "Bur Dubai", "Deira", "Al Quoz", "Jebel Ali", "Discovery Gardens",
  "International City", "Al Barsha", "JLT", "Dubai Marina", "Karama",
  "Satwa", "Al Nahda", "Silicon Oasis", "Al Qusais",
];

const ABU_DHABI_FALLBACK = [
  "Khalidiyah", "Mussafah", "City Center", "Yas Island", "Khalifa City",
  "MBZ City", "Al Reem Island", "Electra Street", "Hamdan Street", "Tourist Club Area",
];

export function generateMetadata() {
  return generatePageMetadata("/routes", {
    title: "Dubai to Abu Dhabi Routes & Pickup Points | RK Transport",
    description: "Choose your pickup and drop-off area between Dubai and Abu Dhabi and request your route on WhatsApp.",
  });
}

// Reads area names for one city from the admin Locations list, falling back to the built-in list.
function areasFor(locations: Location[], city: "dubai" | "abu dhabi", fallback: string[]): string[] {
  const names = locations
    .filter((location) => String((location as unknown as Record<string, unknown>).city ?? "").toLowerCase().includes(city))
    .map((location) => String((location as unknown as Record<string, unknown>).name ?? "").trim())
    .filter(Boolean);
  const unique = Array.from(new Set(names));
  return unique.length >= 3 ? unique : fallback;
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
  const rawBannerUrl =
    copy.find((item) => item.key === "locations_banner_url")?.value ||
    locations.find((location) => location.banner_image_url)?.banner_image_url;
  const bannerUrl = rawBannerUrl ? apiImageUrl(rawBannerUrl) || rawBannerUrl : undefined;

  const dubai = areasFor(locations, "dubai", DUBAI_FALLBACK);
  const abuDhabi = areasFor(locations, "abu dhabi", ABU_DHABI_FALLBACK);

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
                href={`https://wa.me/${whatsappDigits}?text=${encodeURIComponent("Hello RK Transport, I would like to ask about your routes.")}`}
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
          <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
            {/* Planner */}
            <section aria-labelledby="planner-heading">
              <div className="mx-auto max-w-2xl text-center">
                <p className="text-sm font-bold uppercase tracking-[.2em] text-amber-600 dark:text-amber-400">Plan your trip</p>
                <h2 id="planner-heading" className="mt-2 text-balance text-3xl font-extrabold tracking-tight sm:text-5xl">
                  Where are we picking you up?
                </h2>
                <p className="mt-4 leading-7 text-slate-600 dark:text-slate-300">
                  Choose your pickup and drop-off areas, then send the request on WhatsApp. We confirm the price and timing with you.
                </p>
              </div>

              <div className="mt-10">
                <RoutePlanner dubai={dubai} abuDhabi={abuDhabi} whatsappDigits={whatsappDigits} phone={phone} />
              </div>
            </section>

            {/* Slim info row */}
            <section aria-label="Service highlights" className="mt-14 grid gap-px overflow-hidden rounded-3xl bg-slate-200 dark:bg-slate-800 sm:mt-20 md:grid-cols-3">
              {[
                { icon: Clock3, title: "Open 24/7", text: "Day or night, our team is ready for your schedule." },
                { icon: MapPin, title: "Door to door", text: "Pickup and drop-off exactly where you need them." },
                { icon: ShieldCheck, title: "Fixed quotes", text: "You know the price before your trip starts." },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-4 bg-white p-6 dark:bg-slate-900 sm:p-8">
                  <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-amber-400 text-slate-950">
                    <item.icon aria-hidden="true" className="size-6" />
                  </span>
                  <div>
                    <h3 className="text-lg font-bold">{item.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.text}</p>
                  </div>
                </div>
              ))}
            </section>

            {/* Call to action */}
            <section className="mt-14 flex flex-col items-start gap-6 rounded-[2rem] bg-stone-100 p-8 dark:bg-slate-900/60 sm:mt-20 sm:p-12 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Different route in mind?</h2>
                <p className="mt-2 leading-7 text-slate-600 dark:text-slate-300">
                  Tell us your pickup point and destination and we will check the available options for you.
                </p>
              </div>
              <a
                href={`https://wa.me/${whatsappDigits}?text=${encodeURIComponent("Hello RK Transport, I have a custom pickup or drop-off location. Can you confirm availability?")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex min-h-12 shrink-0 items-center gap-2 rounded-full bg-slate-950 px-6 font-bold text-white transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
              >
                <MessageCircle aria-hidden="true" className="size-5" />
                Check my location
                <ArrowUpRight aria-hidden="true" className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}