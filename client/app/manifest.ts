import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "RK Transport",
    short_name: "RK Transport",
    description: "Car transport, recovery, and storage services across the UAE.",
    start_url: "/",
    display: "standalone",
    background_color: "#fafaf9",
    theme_color: "#102d25",
    icons: [
      { src: "/favicon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/favicon-v2.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
  };
}
