# ShipOrSkip

**Founder decision intelligence for solo builders.**

ShipOrSkip helps founders evaluate startup ideas before investing months into development. Describe an idea and get a structured analysis across 8 dimensions — market demand, competition, monetization, execution difficulty, distribution, founder advantage, growth potential, and timeline fit.

## Features

### AI-Powered Idea Analysis
- **8-dimension scoring** — each metric scored 1–10 with rationale
- **Ship / Validate More / Skip** verdict with weighted aggregate score
- **Risk & opportunity breakdown** — top risks, market openings, and concrete next steps
- **Shareable reports** — one-click copy or native share

### Solo Founders Toolkit (14 free tools)

| Category | Tools |
|---|---|
| **Validation & Research** | Target Market Sizer, Discovery Questions, Trend Analyzer, Competitor Map |
| **Financial & Planning** | Revenue Projector, Burn Rate Calculator, Pricing Strategy, Startup Cost Estimator |
| **Strategy & Execution** | MVP Scope Calculator, GTM Playbook, Feature Prioritization, Idea Comparison |
| **Idea & Fit** | Idea Journal, Founder Fit Assessment |

### Engagement
- **Instant gut check** — interactive sliders with animated score ring
- **Idea spark** — random startup inspiration with one-click analysis
- **Recent analyses** — localStorage history to revisit past reports
- **Sample demo** — "Run sample analysis" button for instant walkthrough

### Home Page Sections
- AI Idea Analyzer with form input and example ideas
- 3-step "How It Works" explainer
- Featured tools grid with 6 tool cards
- Solo Founders Toolkit promo card

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, typed routes) |
| Language | TypeScript 5 |
| UI | React 19, Tailwind CSS v4 |
| Fonts | Outfit (display), Inter (body), GeistSans (fallback) |
| Icons | Lucide React |
| Analytics | PostHog (client-side, opt-out) |

## Project Structure

```
app/
├── actions.ts              # Server actions (analyzeIdea, assessTrend, etc.)
├── globals.css             # Tailwind v4 theme tokens
├── layout.tsx              # Root layout, fonts, header & footer
├── page.tsx                # Home page — analyzer + engagement sections
├── components/
│   ├── IdeaAnalyzer.tsx    # Main AI analysis form + report view
│   ├── ReportView.tsx      # Full analysis report renderer
│   ├── QuickScore.tsx      # Interactive slider widget
│   ├── IdeaSpark.tsx       # Random idea generator
│   ├── RecentReports.tsx   # localStorage history
│   ├── HowItWorks.tsx      # 3-step explainer
│   ├── FeaturedTools.tsx   # Tool grid showcase
│   ├── SoloFoundersCard.tsx# Promo card
│   └── ...                 # 14 solo founder tool components
├── lib/
│   ├── analysis.ts         # Scoring engine (8 dimensions, keyword-based)
│   ├── types.ts            # Shared TypeScript types
│   ├── solo-founders.ts    # Original 4 tool implementations
│   ├── founder-tools.ts    # 10 additional tool implementations
│   └── analytics-client.ts # PostHog wrapper
└── solo-founders/
    └── page.tsx            # Tool hub with 4 categories
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build for Production

```bash
npm run build
npm start
```

### Environment Variables

Copy `.env.example` to `.env.local`:

```env
NEXT_PUBLIC_SITE_URL=https://ship-or-skip-two.vercel.app
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

When `NEXT_PUBLIC_POSTHOG_KEY` is empty, analytics calls are safely ignored.

### Commands

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with Turbopack |
| `npm run dev:webpack` | Start dev server with webpack |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run clean` | Remove `.next` cache |

## Contributing

Contributions are welcome! Here's how to get started:

1. **Fork the repository** — click the "Fork" button on GitHub
2. **Clone your fork**

   ```bash
   git clone https://github.com/YOUR_USERNAME/ship-or-skip.git
   cd ship-or-skip
   ```

3. **Create a feature branch**

   ```bash
   git checkout -b feat/your-feature-name
   ```

4. **Make your changes** — code style should match existing conventions (Outfit/Inter fonts, Tailwind v4 `@theme` tokens, lucide icons, typed routes with `as const`)
5. **Type-check before committing**

   ```bash
   npm run typecheck && npm run build
   ```

6. **Commit and push**

   ```bash
   git commit -m "feat: describe your change"
   git push origin feat/your-feature-name
   ```

7. **Open a Pull Request** — describe what your change does and why

### What to Contribute
- New founder tool implementations in `app/lib/` + `app/components/` + `app/solo-founders/`
- Improvements to the scoring engine in `app/lib/analysis.ts`
- UI polish, accessibility, or responsive design fixes
- Additional analysis dimensions or keyword coverage
- Bug fixes and performance improvements

## License

MIT — see [LICENSE.md](./LICENSE.md).
