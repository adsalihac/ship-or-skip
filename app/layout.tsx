import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { Coffee, Github, GitPullRequest, Star, Compass } from "lucide-react";
import Link from "next/link";
import "./globals.css";
import { PostHogProvider } from "./components/PostHogProvider";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://shiporskip.com";
const GITHUB_REPO_URL = "https://github.com/adsalihac/ship-or-skip";
const GITHUB_CONTRIBUTE_URL = `${GITHUB_REPO_URL}/fork`;
const BUY_ME_COFFEE_URL = "https://www.buymeacoffee.com/adsalihac";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ShipOrSkip - Founder Decision Intelligence",
    template: "%s | ShipOrSkip"
  },
  description:
    "Evaluate startup ideas before building. Analyze market demand, competition, monetization, execution difficulty, and growth potential in seconds.",
  applicationName: "ShipOrSkip",
  icons: {
    icon: [
      {
        url: "/favicon.svg",
        type: "image/svg+xml"
      }
    ],
    shortcut: "/favicon.svg",
    apple: "/logo-mark.svg"
  },
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "ShipOrSkip - Founder Decision Intelligence",
    description:
      "Evaluate startup ideas before building. Analyze market demand, competition, monetization, execution difficulty, and growth potential in seconds.",
    url: siteUrl,
    siteName: "ShipOrSkip",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "ShipOrSkip founder decision intelligence report preview"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "ShipOrSkip - Founder Decision Intelligence",
    description:
      "Evaluate startup ideas before building. Analyze market demand, competition, monetization, execution difficulty, and growth potential in seconds.",
    images: ["/opengraph-image"]
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${GeistSans.className} flex min-h-screen flex-col`}>
        <PostHogProvider>
          <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/95 backdrop-blur">
            <nav className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-6">
                <Link href="/" className="inline-flex items-center" aria-label="ShipOrSkip home">
                  <img src="/logo.svg" alt="ShipOrSkip" className="h-8 w-auto" />
                </Link>
                <Link
                  href="/solo-founders"
                  className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-gray-500 transition hover:text-gray-950"
                >
                  <Compass className="size-4" aria-hidden="true" />
                  Solo Founders
                </Link>
              </div>
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
          {children}
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
        </PostHogProvider>
      </body>
    </html>
  );
}
