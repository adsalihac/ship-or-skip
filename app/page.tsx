import { IdeaAnalyzer } from "./components/IdeaAnalyzer";

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
      <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/95 backdrop-blur">
        <nav className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <a href="#" className="inline-flex items-center" aria-label="ShipOrSkip home">
            <img src="/logo.svg" alt="ShipOrSkip" className="h-8 w-auto" />
          </a>
        </nav>
      </header>
      <main>
        <IdeaAnalyzer />
      </main>
      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-2 px-4 py-8 text-[13px] text-gray-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>ShipOrSkip - Startup Due Diligence for Builders</p>
          <p>Know whether an idea deserves your time before you build it.</p>
        </div>
      </footer>
    </>
  );
}
