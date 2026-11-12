import SeoLandingPage from "../Components/seo-landing-page";
import { generatePageMetadata } from "../../lib/seo";

export function generateMetadata() {
  return generatePageMetadata("/abu-dhabi-to-dubai-car-transport", {
    title: "Affordable Abu Dhabi to Dubai Transport | Shared & Private",
    description: "Book a shared or private Abu Dhabi to Dubai ride. Ask about affordable fares, air-conditioned comfort, pickup areas and travel times.",
  }, "seo.abu-dhabi-to-dubai");
}

export default function AbuDhabiToDubaiPage() {
  return <SeoLandingPage
    title="Abu Dhabi to Dubai Passenger Transport"
    path="/abu-dhabi-to-dubai-car-transport"
    intro="Need transport from Abu Dhabi to Dubai? RK Transport offers shared rides and private car journeys for commuters and travelers. Contact us with your pickup area, destination and preferred time to ask about availability and fares."
    sections={[
      { heading: "Shared and private travel options", text: "Choose a shared ride for an affordable trip or ask about a private car for a more flexible journey. Our air-conditioned vehicles provide comfortable travel between Abu Dhabi and Dubai." },
      { heading: "Arrange your Abu Dhabi pickup", text: "Send us your pickup and drop-off areas, passenger count and preferred travel time. We will confirm the available ride, fare and pickup details before your trip." },
    ]}
    faqs={[
      { question: "Can I book a ride from Abu Dhabi to Dubai?", answer: "Yes. Contact RK Transport with your pickup and destination areas, passenger count and preferred time. Our team will discuss ride availability and confirm the fare." },
      { question: "Are shared rides available from Abu Dhabi to Dubai?", answer: "Ask our team about shared ride availability for your route and preferred time. Private rides may also be available." },
      { question: "Are the rides air-conditioned?", answer: "Yes, our passenger rides provide air-conditioned comfort for travel between Abu Dhabi and Dubai." },
    ]}
    links={[
      { href: "/dubai-to-abu-dhabi-car-transport", label: "Dubai to Abu Dhabi rides" },
      { href: "/services", label: "Transport services" },
    ]}
  />;
}
