import SeoLandingPage from "../Components/seo-landing-page";
import { generatePageMetadata } from "../../lib/seo";

export function generateMetadata() {
  return generatePageMetadata("/abu-dhabi-to-dubai-car-transport", {
    title: "Abu Dhabi to Dubai Car Transport Cost & Booking | RK",
    description: "Get a quote for safe, door-to-door car transport from Abu Dhabi to Dubai. Same-day and 24/7 vehicle transfer available.",
  }, "seo.abu-dhabi-to-dubai");
}

export default function AbuDhabiToDubaiPage() {
  return <SeoLandingPage
    title="Abu Dhabi to Dubai Car Transport"
    path="/abu-dhabi-to-dubai-car-transport"
    intro="Moving a car from Abu Dhabi to Dubai? RK Transport can arrange vehicle transport between the emirates. Send us your pickup and destination details, vehicle information, and preferred timing to start planning the move."
    sections={[
      { heading: "Plan your route-specific move", text: "Every move has different pickup access, delivery requirements, and vehicle needs. Share both addresses or areas and the vehicle condition when contacting us, and our team will discuss the arrangements with you." },
      { heading: "Coordinate the handover", text: "Before transport is arranged, make sure someone can provide access to the vehicle at pickup and receive it at delivery. Share gate, parking, or contact instructions so they can be considered during planning." },
    ]}
    faqs={[
      { question: "Can I arrange transport from Abu Dhabi to Dubai?", answer: "Yes. Contact RK Transport with your vehicle details, pickup and delivery areas, and preferred date. Our team will discuss the available arrangement with you." },
      { question: "Can you collect from a home or workplace?", answer: "Share the pickup location and any access restrictions when you contact us. We will review the collection details with you." },
    ]}
    links={[
      { href: "/dubai-to-abu-dhabi-car-transport", label: "Dubai to Abu Dhabi car transport" },
      { href: "/services", label: "All vehicle services" },
    ]}
  />;
}
