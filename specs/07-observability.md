# Spec 7 — Observability (access, errors, uptime)

Commit: `feat: add Sentry and GA4 observability`.

Know whether the production site is reachable, whether people are visiting it, and whether
the app is throwing errors — with email alerts when it is down or when Sentry sees a
high-priority issue.

Stack for this app:

| Concern                 | Tool                     | Where it lives                             |
| ----------------------- | ------------------------ | ------------------------------------------ |
| Access / traffic report | Google Analytics 4       | Client (`NEXT_PUBLIC_GA_MEASUREMENT_ID`)   |
| Runtime errors + alerts | Sentry                   | Client + server (`NEXT_PUBLIC_SENTRY_DSN`) |
| Uptime / “is it down?”  | UptimeRobot HTTP monitor | External (not in app code)                 |

No secrets or DSNs are committed. Values are set in Vercel / local `.env.local` only.

---

## Acceptance

- App builds and tests pass with observability env vars unset (local/CI default)
- When `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set, the GA4 gtag scripts load once in the root layout
- When `NEXT_PUBLIC_GA_MEASUREMENT_ID` is unset, no GA scripts are rendered
- Sentry initializes only when `NEXT_PUBLIC_SENTRY_DSN` is set
- `app/global-error.tsx` reports render errors to Sentry
- `.env.example` documents `NEXT_PUBLIC_SENTRY_DSN`, `NEXT_PUBLIC_GA_MEASUREMENT_ID`, and `SENTRY_AUTH_TOKEN` as empty placeholders
- UptimeRobot HTTP monitor exists for `https://dev-pro-weather.vercel.app` (5 min, email on down)

## Manual follow-up (GA)

1. Create a GA4 property + web data stream for this site
2. Copy the Measurement ID (`G-…`) into Vercel as `NEXT_PUBLIC_GA_MEASUREMENT_ID` (Production + Preview)
3. Redeploy

Sentry project: `wellington-oliveira/dev-pro-weather` (`NEXT_PUBLIC_SENTRY_DSN` already in Vercel).

## Eval commands

```bash
pnpm test
pnpm check
pnpm build
```

---

## Done means

- [ ] `@sentry/nextjs` installed at exact version
- [ ] `GoogleAnalytics` component with jsdom tests
- [ ] Sentry instrumentation wired (client, server, edge, global error)
- [ ] `next.config.ts` wrapped with `withSentryConfig`
- [ ] `.env.example` updated
- [ ] `pnpm check` passes with observability env unset
