import type { MetadataRoute } from "next";
import { canonicalUrl } from "../lib/seo";
import { publicApi } from "../lib/transport-api";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = [
    "/",
    "/about",
    "/services",
    "/cars",
    "/routes",
    "/review",
    "/dubai-to-abu-dhabi-car-transport",
    "/abu-dhabi-to-dubai-car-transport",
  ];
  let services: Awaited<ReturnType<typeof publicApi.services>> = [];
  let cars: Awaited<ReturnType<typeof publicApi.cars>> = [];
  try {
    services = await publicApi.services();
  } catch (error) {
    console.error(
      "Unable to load dynamic services for sitemap.xml:",
      error instanceof Error ? error.message : String(error),
    );
  }
  try {
    cars = await publicApi.cars();
  } catch (error) {
    console.error(
      "Unable to load dynamic vehicles for sitemap.xml:",
      error instanceof Error ? error.message : String(error),
    );
  }
  return [
    ...staticPaths.map((path) => ({
      url: canonicalUrl(path),
      changeFrequency: path === "/" ? "daily" as const : "weekly" as const,
      priority: path === "/" ? 1 : 0.7,
    })),
    ...services.map((service) => ({
      url: canonicalUrl(`/services/${service.slug}`),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...cars.map((car) => ({
      url: canonicalUrl(`/cars/${car.slug}`),
      changeFrequency: "weekly" as const,
      priority: 0.5,
    })),
  ];
}
