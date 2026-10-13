import type { Location } from "./transport-api";

export const DUBAI_FALLBACK = [
  "Bur Dubai", "Deira", "Al Quoz", "Jebel Ali", "Discovery Gardens",
  "International City", "Al Barsha", "JLT", "Dubai Marina", "Karama",
  "Satwa", "Al Nahda", "Silicon Oasis", "Al Qusais",
];

export const ABU_DHABI_FALLBACK = [
  "Khalidiyah", "Mussafah", "City Center", "Yas Island", "Khalifa City",
  "MBZ City", "Al Reem Island", "Electra Street", "Hamdan Street", "Tourist Club Area",
];

// Area names for one city from Admin → Locations, falling back to the built-in list.
export function areasFor(locations: Location[], city: "dubai" | "abu dhabi", fallback: string[]): string[] {
  const names = locations
    .filter((location) => String((location as unknown as Record<string, unknown>).city ?? "").toLowerCase().includes(city))
    .map((location) => String((location as unknown as Record<string, unknown>).name ?? "").trim())
    .filter(Boolean);
  const unique = Array.from(new Set(names));
  return unique.length >= 3 ? unique : fallback;
}