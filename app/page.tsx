import { IdeaAnalyzer } from "./components/IdeaAnalyzer";
import { HowItWorks } from "./components/HowItWorks";
import { FeaturedTools } from "./components/FeaturedTools";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "ShipOrSkip",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "Founder decision intelligence platform for evaluating startup ideas before building.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD"
  }
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main className="flex-1">
        <IdeaAnalyzer />
        <HowItWorks />
        <FeaturedTools />
      </main>
    </>
  );
}
