import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Providers } from "./providers";
import ConditionalLayout from "./Components/ConditionalLayout";
import { StructuredData } from "./Components/structured-data";
import { businessJsonLd, generatePageMetadata, getSiteSettings } from "../lib/seo";

const geist = Geist({ subsets: ["latin"], display: "swap", variable: "--font-geist" });

export async function generateMetadata(): Promise<Metadata> {
  const [metadata, settings] = await Promise.all([
    generatePageMetadata("/", {
      title: "Car Transport UAE | Recovery & Vehicle Storage | RK Transport",
      description: "Professional car transport, vehicle recovery, roadside assistance and car storage across Dubai, Abu Dhabi and the UAE. Available 24/7.",
    }),
    getSiteSettings(),
  ]);

  return {
    ...metadata,
    applicationName: settings?.brand_name || "RK Transport",
    icons: {
      icon: [
        { url: "/favicon.ico?v=3", sizes: "16x16 32x32" },
        { url: "/favicon-16x16.png?v=3", type: "image/png", sizes: "16x16" },
        { url: "/favicon-32x32.png?v=3", type: "image/png", sizes: "32x32" },
        { url: "/android-chrome-512x512.png?v=3", type: "image/png", sizes: "512x512" },
        { url: "/favicon.png?v=3", type: "image/png", sizes: "512x512" },
      ],
      shortcut: "/favicon.ico?v=3",
      apple: [{ url: "/apple-touch-icon.png?v=3", sizes: "180x180", type: "image/png" }],
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#102d25",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const settings = await getSiteSettings();
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <body className={`${geist.variable} min-h-dvh bg-stone-50 font-sans text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-100`}>
        <StructuredData data={businessJsonLd(settings)} />
        <Providers>
          <ConditionalLayout>{children}</ConditionalLayout>
        </Providers>
        {measurementId && /^G-[A-Z0-9]+$/.test(measurementId) && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} strategy="afterInteractive" />
            <Script id="google-analytics" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || []; function gtag(){window.dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${measurementId}');`}
            </Script>
          </>
        )}
      </body>
    </html>
  );  
}