import Image from "next/image";
import { notFound } from "next/navigation";
import { Car, Check, Luggage, MessageCircle, Phone, ShieldCheck, Users } from "lucide-react";
import { BreadcrumbStructuredData } from "../../Components/structured-data";
import PageHero from "../../Components/page-hero";
import { generatePageMetadata } from "../../../lib/seo";
import { apiImageUrl, isImageOptimizable, publicApi, type PageCopy, type Vehicle } from "../../../lib/transport-api";
import { createWhatsappUrl } from "../../../lib/whatsapp";

const WHATSAPP_NUMBER = "971561379697";
const PHONE_NUMBER = "+971561379697";

type Detail = {
  title: string;
  category: string;
  seats: string;
  luggage?: string;
  tagline: string;
  description: string;
  priceNote: string;
  features: string[];
  image: string | null;
  banner: string | null;
};

const STATIC: Record<string, Detail> = {
  sedan: {
    title: "Executive Sedan", category: "Standard & comfort commute", seats: "1 - 4 passengers", luggage: "2 large bags",
    tagline: "Sleek, quiet, and fuel-efficient for individual commuters and couples.",
    description: "Our executive sedans offer a smooth and private ride between Dubai and Abu Dhabi, with climate control and maximum comfort.",
    priceNote: "Competitive intercity rates",
    features: ["Dual-zone climate control AC", "Leather seating comfort", "USB fast charging ports", "Sanitized interior before every trip"],
    image: null, banner: null,
  },
  suv: {
    title: "Luxury Family SUV", category: "Family & group travel", seats: "Up to 7 passengers", luggage: "4 large bags",
    tagline: "Extra legroom and premium comfort for full family trips.",
    description: "Generous headroom, luggage capacity and a smooth suspension that glides across Sheikh Zayed Road between Dubai and Abu Dhabi.",
    priceNote: "Best value for families and small groups",
    features: ["Plush 3-row seating", "Rear air conditioning vents", "Tinted UV-protection windows", "Ample luggage storage"],
    image: null, banner: null,
  },
  van: {
    title: "Executive Commuter Van", category: "Group & business transportation", seats: "Up to 12 passengers", luggage: "8+ large bags",
    tagline: "Spacious intercity minibus for corporate teams and big groups.",
    description: "High-capacity seating with extensive baggage room so everyone travels together seamlessly.",
    priceNote: "Economical per-passenger group rates",
    features: ["High-roof standing headroom", "Reclining passenger seats", "Large rear luggage compartment", "Experienced intercity driver"],
    image: null, banner: null,
  },
};

async function getDetail(slug: string): Promise<Detail | null> {
  try {
    const cars: Vehicle[] = await publicApi.cars();
    const car = cars.find(
      (item) => (item as Vehicle & { slug?: string }).slug === slug || String(item.id) === slug,
    );
    if (car) {
      return {
        title: car.title,
        category: "Our fleet",
        seats: car.seats,
        tagline: car.description,
        description: car.description,
        priceNote: "Contact us for a fixed quote",
        features: car.chips ?? [],
        image: car.image_url ? apiImageUrl(car.image_url) || car.image_url : null,
        banner: car.banner_image_url ? apiImageUrl(car.banner_image_url) || car.banner_image_url : null,
      };
    }
  } catch {
    // fall through to the static fallback
  }
  return STATIC[slug] ?? null;
}

type PageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  let cars: Vehicle[] = [];
  try {
    cars = await publicApi.cars();
  } catch {
    // Static fallback routes can still be generated without a reachable API.
  }
  const slugs = new Set<string>(Object.keys(STATIC));
  for (const car of cars) {
    const slug = (car as Vehicle & { slug?: string }).slug;
    if (slug) slugs.add(slug);
    slugs.add(String(car.id));
  }
  return Array.from(slugs, (slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const vehicle = await getDetail(slug);
  if (!vehicle) {
    return generatePageMetadata(`/cars/${slug}`, {
      title: "Vehicle Not Found | RK Transport",
      description: "The requested vehicle details could not be found.",
    });
  }
  return generatePageMetadata(`/cars/${slug}`, {
    title: `${vehicle.title} | Car Transport Dubai to Abu Dhabi`,
    description: vehicle.tagline.slice(0, 155),
  });
}

export default async function CarDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const vehicle = await getDetail(slug);
  if (!vehicle) notFound();

  const [settingsResult, copyResult] = await Promise.allSettled([publicApi.settings(), publicApi.pageCopy()]);
  const settings = settingsResult.status === "fulfilled" ? settingsResult.value : null;
  const copy: PageCopy[] = copyResult.status === "fulfilled" ? copyResult.value : [];

  const phone = settings?.phone_primary || PHONE_NUMBER;
  const whatsappDigits = settings?.whatsapp?.replace(/\D/g, "") || WHATSAPP_NUMBER;
  const bookingUrl = createWhatsappUrl(whatsappDigits, `Hello RK Transport, I would like to book the ${vehicle.title}.`);

  const pageBanner = copy.find((item) => item.key === "cars_banner_url")?.value;
  const heroImage = vehicle.banner || vehicle.image || (pageBanner ? apiImageUrl(pageBanner) || pageBanner : undefined);
  const heroSubtitle = vehicle.tagline.length > 140 ? `${vehicle.tagline.slice(0, 137)}...` : vehicle.tagline;

  return (
    <>
      <BreadcrumbStructuredData items={[
        { name: "Home", path: "/" },
        { name: "Our Fleet", path: "/cars" },
        { name: vehicle.title, path: `/cars/${slug}` },
      ]} />

      <main className="bg-white dark:bg-slate-950">
        <PageHero
          parent={{ label: "Vehicles", href: "/cars" }}
          crumb={vehicle.title}
          watermark="Vehicles"
          title={vehicle.title}
          subtitle={heroSubtitle}
          imageUrl={heroImage}
          highlights={[
            { label: "Capacity", value: vehicle.seats },
            ...(vehicle.luggage ? [{ label: "Luggage", value: vehicle.luggage }] : []),
            { label: "Call us", value: phone, href: `tel:${phone}` },
          ]}
        />

        <div className="relative z-10 rounded-t-[2.5rem] bg-white text-slate-900 shadow-[0_-25px_50px_rgba(0,0,0,0.3)] dark:bg-slate-950 dark:text-white">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-start lg:py-20">
            <div>
              <div className="relative aspect-[16/10] overflow-hidden rounded-3xl bg-slate-200 shadow-xl shadow-slate-900/10 dark:bg-slate-800">
                {vehicle.image ? (
                  <Image
                    src={vehicle.image}
                    alt={vehicle.title}
                    fill
                    priority
                    unoptimized={!isImageOptimizable(vehicle.image)}
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="grid h-full w-full place-items-center bg-gradient-to-br from-slate-700 to-slate-950">
                    <Car aria-hidden="true" className="size-24 text-white/20" />
                  </div>
                )}
              </div>

              <p className="mt-8 text-lg leading-8 text-slate-600 dark:text-slate-300">{vehicle.description}</p>

              <div className="mt-8 flex flex-wrap gap-4">
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <Users aria-hidden="true" className="size-5 text-amber-500" />
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Capacity</p>
                    <p className="font-bold">{vehicle.seats}</p>
                  </div>
                </div>
                {vehicle.luggage && (
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <Luggage aria-hidden="true" className="size-5 text-amber-500" />
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Luggage space</p>
                      <p className="font-bold">{vehicle.luggage}</p>
                    </div>
                  </div>
                )}
              </div>

              {vehicle.features.length > 0 && (
                <div className="mt-10">
                  <h2 className="text-xl font-bold">Specifications &amp; features</h2>
                  <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                    {vehicle.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-stone-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
                        <span className="grid size-6 shrink-0 place-items-center rounded-full bg-slate-950 text-white dark:bg-white dark:text-slate-950">
                          <Check aria-hidden="true" className="size-4" />
                        </span>
                        <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <aside className="rounded-3xl bg-slate-950 p-8 text-white shadow-2xl lg:sticky lg:top-28">
              <p className="text-xs font-bold uppercase tracking-[.2em] text-amber-400">Instant reservation</p>
              <h2 className="mt-2 text-2xl font-bold">Book {vehicle.title}</h2>
              <p className="mt-2 text-sm text-slate-300">
                {vehicle.priceNote}. Contact us via WhatsApp or phone for immediate dispatch or scheduling.
              </p>
              <div className="mt-8 space-y-4">
                <a href={bookingUrl} target="_blank" rel="noopener noreferrer" className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-amber-400 font-semibold text-slate-950 transition hover:bg-amber-300">
                  <MessageCircle aria-hidden="true" className="size-4" /> Book via WhatsApp
                </a>
                <a href={`tel:${phone}`} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 font-semibold text-white transition hover:bg-white/10">
                  <Phone aria-hidden="true" className="size-4" /> Call {phone}
                </a>
              </div>
              <div className="mt-8 border-t border-white/10 pt-6">
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <ShieldCheck aria-hidden="true" className="size-5 shrink-0 text-amber-400" />
                  <span>Includes fuel, Salik toll gates, and a professional licensed driver.</span>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}