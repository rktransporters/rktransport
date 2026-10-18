const collections = ["about", "banners", "services", "cars", "locations", "faqs", "testimonials"];

export function generateStaticParams() {
  return collections.map((collection) => ({ collection }));
}

export default function AdminCollectionLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
