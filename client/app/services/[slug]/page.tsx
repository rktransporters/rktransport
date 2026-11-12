import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowRight, Check, MessageCircle, Phone } from "lucide-react";
import { apiImageUrl, apiRequest, ApiError, isImageOptimizable, publicApi, type Service } from "../../../lib/transport-api";
import { BreadcrumbStructuredData, StructuredData } from "../../Components/structured-data";
import PageHero from "../../Components/page-hero";
import SimpleRichText from "../../Components/simple-rich-text";
import { canonicalUrl, generatePageMetadata } from "../../../lib/seo";
import { createWhatsappUrl } from "../../../lib/whatsapp";

async function findService(slug: string): Promise<Service> {
  return apiRequest<Service>(`/services/slug/${encodeURIComponent(slug)}`);
}

export async function generateStaticParams() {
  try {
    const services = await publicApi.services();
    return services.map(({ slug }) => ({ slug }));
  } catch {
    return [{ slug: "car-transport" }];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const service = await findService(slug);
    return generatePageMetadata(`/services/${service.slug}`, {
      title: service.seo_title || `${service.title} | RK Transport UAE`,
      description: service.seo_description || service.short_description || service.detailed_description || `${service.title} from RK Transport between Dubai and Abu Dhabi.`,
    }, `seo.service.${service.slug}`);
  } catch (reason) {
    if (reason instanceof ApiError && reason.status === 404) {
      return generatePageMetadata(`/services/${slug}`, {
        title: "Passenger Transport Service | RK Transport UAE",
        description: "Explore shared and private passenger transport services between Dubai and Abu Dhabi.",
      }, `seo.service.${slug}`);
    }
    return generatePageMetadata(`/services/${slug}`, {
      title: "RK Transport Service",
      description: "Explore passenger transport services from RK Transport in the UAE.",
    }, `seo.service.${slug}`);
  }
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let service: Service;
  try {
    service = await findService(slug);
  } catch {
    notFound();
  }
  if (!service) {
    notFound();
  }

  const [settingsResult, copyResult] = await Promise.allSettled([publicApi.settings(), publicApi.pageCopy()]);
  const settings = settingsResult.status === "fulfilled" ? settingsResult.value : null;
  const copy = copyResult.status === "fulfilled" ? copyResult.value : [];
  const cta = copy.find((item: { key: string }) => item.key === "services.detail.cta")?.value || "Request this service";
  const hours = settings?.available_24_7 ? settings.hours_label : "";
  const whatsappDigits = settings?.whatsapp?.replace(/\D/g, "") || "971561379697";
  const requestMessage = `Hello RK Transport, I would like to request this service: ${service.title}. Please contact me with details.`;
  const requestWhatsappUrl = createWhatsappUrl(whatsappDigits, requestMessage);
  const gallery = service.gallery ?? [];

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    ...(service.short_description || service.detailed_description
      ? { description: service.short_description || service.detailed_description }
      : {}),
    url: canonicalUrl(`/services/${service.slug}`),
    areaServed: ["Dubai", "Abu Dhabi", "United Arab Emirates"],
    provider: {
      "@type": "LocalBusiness",
      name: settings?.brand_name || "RK Transport",
      url: canonicalUrl("/"),
      ...(settings?.phone_primary ? { telephone: settings.phone_primary } : {}),
    },
  };

  return (
    <>
      <BreadcrumbStructuredData items={[
        { name: "Home", path: "/" },
        { name: "Services", path: "/services" },
        { name: service.title, path: `/services/${service.slug}` },
      ]} />
      <StructuredData data={serviceSchema} />

      <main className="bg-white dark:bg-slate-950">
        <PageHero
          parent={{ label: "Services", href: "/services" }}
          crumb={service.title}
          watermark="Services"
          title={service.title}
          subtitle={service.short_description}
          imageUrl={service.image_url}
          highlights={[
            { label: "Availability", value: hours || "Call us anytime" },
            { label: "Price", value: service.starting_price_note || "Free quote" },
          ]}
        />

        {/* Content that scrolls over the still banner */}
        <div className="relative z-10 bg-white dark:bg-slate-950 rounded-t-[2.5rem] shadow-[0_-25px_50px_rgba(0,0,0,0.3)]">
          <section className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_380px] lg:py-20">
            <div>
              {service.detailed_description && (
                <SimpleRichText value={service.detailed_description} className="max-w-3xl text-lg leading-8 text-slate-700 dark:text-slate-200" />
              )}

              {service.features?.length ? (
                <div className="mt-10">
                  <h2 className="text-2xl font-bold tracking-tight">What is included</h2>
                  <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-stone-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                        <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-slate-950 text-white dark:bg-white dark:text-slate-950">
                          <Check aria-hidden="true" className="size-3.5" />
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {gallery.length > 0 && (
                <div className="mt-12">
                  <h2 className="text-2xl font-bold tracking-tight">Gallery</h2>
                  <div className="mt-5 grid auto-rows-[200px] gap-3 sm:grid-cols-2 sm:auto-rows-[240px]">
                    {gallery.map((image, index) => (
                      <div key={`${image.url}-${index}`} className={`group relative overflow-hidden rounded-2xl bg-slate-200 dark:bg-slate-800 ${index % 5 === 0 ? "sm:row-span-2" : ""}`}>
                        <Image
                          src={apiImageUrl(image.url) || image.url}
                          alt={image.alt || ""}
                          fill
                          unoptimized={!isImageOptimizable(image.url)}
                          sizes="(max-width: 640px) 100vw, 50vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sticky booking card */}
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900">
                <p className="text-sm font-bold uppercase tracking-[.2em] text-slate-500 dark:text-slate-400">Book this service</p>
                {service.starting_price_note ? (
                  <p className="mt-3 text-3xl font-bold tracking-tight">{service.starting_price_note}</p>
                ) : (
                  <p className="mt-3 text-2xl font-bold tracking-tight">Get a free quote</p>
                )}
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">Tell us the pickup and drop-off and we will confirm the price and timing with you.</p>

                <a
                  href={requestWhatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-6 font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
                >
                  <MessageCircle aria-hidden="true" className="size-5" />
                  {cta}
                  <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" />
                </a>

                <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  <Link href="/routes" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-slate-300 px-4 font-semibold transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800">
                    <ArrowRight aria-hidden="true" className="size-5" />
                    Plan route
                  </Link>
                  {settings?.phone_primary && (
                    <a href={`tel:${settings.phone_primary}`} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-slate-300 px-4 font-semibold transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800">
                      <Phone aria-hidden="true" className="size-5" />
                      Call
                    </a>
                  )}
                </div>
              </div>
            </aside>
          </section>
        </div>
      </main>
    </>
  );
}