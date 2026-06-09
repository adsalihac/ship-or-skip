import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { PostHogProvider } from "./components/PostHogProvider";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://shiporskip.com";

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
      <body className={GeistSans.className}>
        <PostHogProvider>{children}</PostHogProvider>
      </body>
    </html>
  );
}
