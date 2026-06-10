# ShipOrSkip

ShipOrSkip is a focused founder decision intelligence MVP. It lets a visitor describe one startup idea and receive one structured build-or-skip assessment.

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment

Copy `.env.example` to `.env.local` if you want analytics or a custom canonical URL.

```bash
NEXT_PUBLIC_SITE_URL=https://https://ship-or-skip-two.vercel.app
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

When `NEXT_PUBLIC_POSTHOG_KEY` is empty, analytics calls are safely ignored.
