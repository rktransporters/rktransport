import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Car, Check, Clock, Fuel, Luggage, MessageCircle, Phone, ShieldCheck, Sparkles, Users } from "lucide-react";
import { BreadcrumbStructuredData } from "../Components/structured-data";
import PageHero from "../Components/page-hero";
import { generatePageMetadata } from "../../lib/seo";
import { apiImageUrl, isImageOptimizable, publicApi, type PageCopy, type Vehicle } from "../../lib/transport-api";

export const revalidate = 60;

const WHATSAPP_NUMBER = "971561379697";

export function generateMetadata() {
  return generatePageMetadata("/cars", {
    title: "Our Fleet & Transport Vehicles | RK Transport Dubai to Abu Dhabi",
    description: "Explore our fleet of sedans, family SUVs, and executive vans for comfortable travel between Dubai and Abu Dhabi.",
  });
}

type Row = {
  key: string | number;
  href: string;
  title: string;
  description: string;
  seats: string;
  luggage?: string;
  chips: string[];
  image: string | null;
  unoptimized: boolean;
};

// Used only when no vehicles have been added in the admin yet.
const FALLBACK: Row[] = [
  { key: "sedan", href: "/cars/sedan", title: "Executive Sedan", description: "Sleek, quiet, and fuel-efficient for individual commuters and couples.", seats: "1 - 4 passengers", luggage: "2 large bags", chips: ["Dual-zone AC", "Leather seats", "USB charging"], image: null, unoptimized: false },
  { key: "suv", href: "/cars/suv", title: "Luxury Family SUV", description: "Extra legroom and premium comfort for full family trips.", seats: "Up to 7 passengers", luggage: "4 large bags", chips: ["3-row seating", "Rear AC", "Tinted windows"], image: null, unoptimized: false },
  { key: "van", href: "/cars/van", title: "Executive Commuter Van", description: "Spacious intercity minibus for corporate teams and big groups.", seats: "Up to 12 passengers", luggage: "8+ large bags", chips: ["High roof", "Reclining seats", "Big luggage bay"], image: null, unoptimized: false },
];

const STANDARDS = [
  { icon: Sparkles, title: "Sanitized before every ride", description: "Interior deep cleaning and anti-bacterial sanitization after every single route." },
  { icon: ShieldCheck, title: "Full RTA safety compliance", description: "Regular mechanical safety inspections, licensed specifically for intercity transport." },
  { icon: Fuel, title: "All-inclusive pricing", description: "Fuel, Salik tolls and highway fees are included in every quote. No surprise surcharges." },
];

export default async function CarsPage() {
  const [settingsResult, carsResult, copyResult] = await Promise.allSettled([
    publicApi.settings(),
    publicApi.cars(),
    publicApi.pageCopy(),
  ]);
  const settings = settingsResult.status === "fulfilled" ? settingsResult.value : null;
  const cars: Vehicle[] = carsResult.status === "fulfilled" ? carsResult.value : [];
  const copy: PageCopy[] = copyResult.status === "fulfilled" ? copyResult.value : [];

  const rawBannerUrl =
    copy.find((item) => item.key === "cars_banner_url")?.value ||
    cars.find((car) => car.banner_image_url)?.banner_image_url;
  const bannerUrl = rawBannerUrl ? apiImageUrl(rawBannerUrl) || rawBannerUrl : undefined;

  const whatsappDigits = settings?.whatsapp?.replace(/\D/g, "") || WHATSAPP_NUMBER;
  const hours = settings?.available_24_7 ? settings.hours_label : "";

  const rows: Row[] = cars.length
    ? cars.map((car) => ({
        key: car.id,
        href: `/cars/${car.id}`,
        title: car.title,
        description: car.description,
        seats: car.seats,
        chips: car.chips ?? [],
        image: car.image_url ? apiImageUrl(car.image_url) || car.image_url : null,
        unoptimized: car.image_url ? !isImageOptimizable(car.image_url) : false,
      }))
    : FALLBACK;

  return (
    <>
      <BreadcrumbStructuredData items={[{ name: "Home", path: "/" }, { name: "Our Fleet", path: "/cars" }]} />

      <main className="bg-stone-50 dark:bg-slate-950">
        {/* Hero with still background */}
        <PageHero
          crumb="Vehicles"
          title={copy.find((item) => item.key === "cars.heading")?.value || "Our transport fleet"}
          subtitle={
            copy.find((item) => item.key === "cars.subheading")?.value ||
            "Comfortable, clean and well-maintained vehicles for travel between Dubai and Abu Dhabi."
          }
          imageUrl={bannerUrl}
          highlights={[
            { icon: <Car aria-hidden="true" className="size-5" />, label: "Our fleet", value: `${rows.length} ${rows.length === 1 ? "vehicle" : "vehicles"}` },
            { icon: <Clock aria-hidden="true" className="size-5" />, label: "Availability", value: hours || "Call us anytime" },
            { icon: <Phone aria-hidden="true" className="size-5" />, label: "Call us", value: settings?.phone_primary || "" },
          ]}
        >
          <a
            href={`https://wa.me/${whatsappDigits}?text=${encodeURIComponent("Hello RK Transport, I would like to ask about your vehicles.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-6 font-semibold text-slate-950 transition hover:bg-amber-400"
          >
            <MessageCircle aria-hidden="true" className="size-5" />
            Ask about the fleet
            <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" />
          </a>
          <Link href="/routes" className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 font-semibold backdrop-blur-md transition hover:bg-white/20">
            View our routes
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </Link>
        </PageHero>

        {/* Content slides over the still image */}
        <div className="relative z-10 rounded-t-[2.5rem] bg-white text-slate-900 shadow-[0_-25px_50px_rgba(0,0,0,0.3)] dark:bg-slate-950 dark:text-white">
          <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-[.2em] text-slate-500 dark:text-slate-400">The garage</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Pick the right vehicle for your trip</h2>
            </div>

            <div className="mt-12 space-y-16 lg:space-y-24">
              {rows.map((row, index) => {
                const flip = index % 2 === 1;
                return (
                  <article key={row.key} className="group grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
                    <Link
                      href={row.href}
                      className={`relative block aspect-[16/10] overflow-hidden rounded-3xl bg-slate-200 shadow-xl shadow-slate-900/10 dark:bg-slate-800 ${flip ? "lg:order-2" : ""}`}
                    >
                      {row.image ? (
                        <Image
                          src={row.image}
                          alt={row.title}
                          fill
                          priority={index === 0}
                          unoptimized={row.unoptimized}
                          sizes="(max-width: 1024px) 100vw, 50vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="grid h-full w-full place-items-center bg-gradient-to-br from-slate-700 to-slate-950">
                          <Car aria-hidden="true" className="size-24 text-white/20" />
                        </div>
                      )}
                      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                      <span className="absolute left-5 top-5 grid size-12 place-items-center rounded-full bg-amber-400 text-sm font-bold text-slate-950">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </Link>

                    <div>
                      <h3 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">{row.title}</h3>
                      <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-300">{row.description}</p>

                      <dl className="mt-6 flex flex-wrap gap-3">
                        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-stone-50 px-4 py-2 text-sm font-semibold dark:border-slate-800 dark:bg-slate-900">
                          <Users aria-hidden="true" className="size-4 text-amber-500" />
                          <dt className="sr-only">Capacity</dt>
                          <dd>{row.seats}</dd>
                        </div>
                        {row.luggage && (
                          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-stone-50 px-4 py-2 text-sm font-semibold dark:border-slate-800 dark:bg-slate-900">
                            <Luggage aria-hidden="true" className="size-4 text-amber-500" />
                            <dt className="sr-only">Luggage</dt>
                            <dd>{row.luggage}</dd>
                          </div>
                        )}
                      </dl>

                      {row.chips.length > 0 && (
                        <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                          {row.chips.map((chip) => (
                            <li key={chip} className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                              <span className="grid size-5 shrink-0 place-items-center rounded-full bg-slate-950 text-white dark:bg-white dark:text-slate-950">
                                <Check aria-hidden="true" className="size-3" />
                              </span>
                              {chip}
                            </li>
                          ))}
                        </ul>
                      )}

                      <div className="mt-8 flex flex-wrap gap-3">
                        <Link href={row.href} className="group/btn inline-flex min-h-12 items-center gap-2 rounded-full bg-slate-950 px-6 font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200">
                          View details
                          <ArrowUpRight aria-hidden="true" className="size-4 transition-transform group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
                        </Link>
                        <a
                          href={`https://wa.me/${whatsappDigits}?text=${encodeURIComponent(`Hello RK Transport, I want to book the ${row.title}`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-h-12 items-center gap-2 rounded-full border border-slate-300 px-6 font-semibold transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
                        >
                          <MessageCircle aria-hidden="true" className="size-4" />
                          Book on WhatsApp
                        </a>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          {/* Standards */}
          <section className="px-4 pb-16 sm:px-6 lg:pb-24">
            <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-slate-950 p-8 text-white sm:p-12">
              <div aria-hidden="true" className="absolute -right-24 -top-24 size-80 rounded-full bg-amber-400/10 blur-3xl" />
              <p className="relative text-sm font-bold uppercase tracking-[.2em] text-amber-400">Fleet standards</p>
              <h2 className="relative mt-2 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">What makes our vehicles special</h2>
              <div className="relative mt-10 grid gap-px overflow-hidden rounded-2xl bg-white/10 md:grid-cols-3">
                {STANDARDS.map((item) => (
                  <div key={item.title} className="bg-slate-950 p-6 transition hover:bg-slate-900">
                    <item.icon aria-hidden="true" className="size-8 text-amber-400" />
                    <h3 className="mt-4 text-lg font-bold">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-300">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}