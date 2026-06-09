import { Coffee, Github, GitPullRequest, Star } from "lucide-react";
import { IdeaAnalyzer } from "./components/IdeaAnalyzer";

const BUY_ME_COFFEE_URL = "https://www.buymeacoffee.com/adsalihac";
const GITHUB_REPO_URL = "https://github.com/adsalihac/ship-or-skip";
const GITHUB_CONTRIBUTE_URL = `${GITHUB_REPO_URL}/fork`;

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
          <div className="flex items-center gap-2">
            <a
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-9 items-center gap-1.5 rounded-[8px] border border-gray-200 bg-white px-3 text-[13px] font-semibold text-gray-700 shadow-sm transition hover:border-gray-300 hover:bg-gray-50 hover:text-gray-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400"
              aria-label="Star ShipOrSkip on GitHub"
            >
              <Github className="size-4" aria-hidden="true" />
              <Star className="size-3.5 fill-amber-400 text-amber-500" aria-hidden="true" />
              <span className="hidden sm:inline">Star</span>
            </a>
            <a
              href={GITHUB_CONTRIBUTE_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-9 items-center gap-1.5 rounded-[8px] bg-gray-950 px-3 text-[13px] font-semibold text-white shadow-sm transition hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-500"
              aria-label="Contribute to ShipOrSkip on GitHub"
            >
              <GitPullRequest className="size-4" aria-hidden="true" />
              <span className="hidden sm:inline">Contribute</span>
            </a>
          </div>
        </nav>
      </header>
      <main className="flex-1 pb-24">
        <IdeaAnalyzer />
      </main>
      <footer className="fixed inset-x-0 bottom-0 z-30 border-t border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-2 px-4 py-3 text-[13px] text-gray-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>
            © {new Date().getFullYear()}{" "}
            <a
              href="https://github.com/adsalihac"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-gray-700 transition hover:text-gray-950"
            >
              adsalihac
            </a>
          </p>
          <a
            href={BUY_ME_COFFEE_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="Buy me a coffee"
            className="inline-flex items-center gap-2 rounded-[8px] border border-amber-300 bg-[#ffdc73] px-3.5 py-2 text-[12px] font-semibold uppercase tracking-[0.08em] text-gray-950 shadow-sm transition hover:-translate-y-0.5 hover:border-amber-400 hover:bg-[#ffd15a] hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
          >
            <span className="flex size-5 items-center justify-center rounded-full bg-white/70">
              <Coffee className="h-3.5 w-3.5" />
            </span>
            Buy Me a Coffee
          </a>
        </div>
      </footer>
    </>
  );
}
