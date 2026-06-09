import { IdeaAnalyzer } from "./components/IdeaAnalyzer";
import { exampleIdeas, generateReport } from "./lib/analysis";

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
  const exampleReports = exampleIdeas.map(generateReport);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/95 backdrop-blur">
        <nav className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <a href="#" className="text-[18px] font-semibold text-gray-950">
            ShipOrSkip
          </a>
          <div className="flex items-center gap-5 text-[13px] font-medium text-gray-600">
            <a href="#examples" className="transition hover:text-gray-950">
              Examples
            </a>
          </div>
        </nav>
      </header>
      <main>
        <IdeaAnalyzer exampleReports={exampleReports} />
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
