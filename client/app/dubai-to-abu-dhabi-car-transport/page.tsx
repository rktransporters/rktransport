import SeoLandingPage from "../Components/seo-landing-page";
import { generatePageMetadata } from "../../lib/seo";

export function generateMetadata() {
  return generatePageMetadata("/dubai-to-abu-dhabi-car-transport", {
    title: "Affordable Dubai to Abu Dhabi Transport | Shared & Private",
    description: "Book a shared or private Dubai to Abu Dhabi ride. Ask about affordable fares, air-conditioned comfort, pickup areas and travel times.",
  }, "seo.dubai-to-abu-dhabi");
}

export default function DubaiToAbuDhabiPage() {
  return <SeoLandingPage
    title="Dubai to Abu Dhabi Passenger Transport"
    path="/dubai-to-abu-dhabi-car-transport"
    intro="Looking for affordable transport from Dubai to Abu Dhabi? RK Transport offers shared rides and private car journeys for commuters and travelers. Contact us with your pickup area, destination and preferred time to ask about availability and fares."
    sections={[
      { heading: "Shared and private travel options", text: "Choose a shared ride for an affordable trip or ask about a private car for a more flexible journey. Our air-conditioned vehicles provide comfortable travel between Dubai and Abu Dhabi." },
      { heading: "Arrange your Dubai pickup", text: "Send us your pickup and drop-off areas, passenger count and preferred travel time. We will confirm the available ride, fare and pickup details before your trip." },
    ]}
    faqs={[
      { question: "How do I book a ride from Dubai to Abu Dhabi?", answer: "Contact RK Transport with your pickup and destination areas, passenger count and preferred time. We will discuss ride availability and confirm the fare." },
      { question: "Are shared rides available from Dubai to Abu Dhabi?", answer: "Ask our team about shared ride availability for your route and preferred time. Private rides may also be available." },
      { question: "Are the rides air-conditioned?", answer: "Yes, our passenger rides provide air-conditioned comfort for travel between Dubai and Abu Dhabi." },
    ]}
    links={[
      { href: "/abu-dhabi-to-dubai-car-transport", label: "Abu Dhabi to Dubai rides" },
      { href: "/services", label: "Transport services" },
    ]}
  />;
}
