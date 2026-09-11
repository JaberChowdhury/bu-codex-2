# Plan 003: Purge Invasive Cookie Scraping and Hardcoded Credentials from Telemetry

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, reply with your execution report.
>
> **Drift check (run first)**: `git diff --stat 97f366c..HEAD -- lib/data_watcher.ts app/api/telemetry/route.ts components/TelemetryProvider.tsx`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: security / privacy
- **Planned at**: commit `97f366c`, 2026-09-11

## Why this matters

The custom telemetry data watcher silently scrapes `document.cookie` and `localStorage` keys on every route navigation, pushing them to an external Supabase table with fallback database credentials hardcoded directly into the route file. This introduces severe privacy compliance risks, browser performance overhead, and credential exposure. Purging cookie scraping, removing hardcoded database keys, and streamlining telemetry keeps the site fast and compliant while leaving Umami analytics intact.

## Current state

Relevant files:
- `lib/data_watcher.ts` — Scrapes cookies and storage at lines 182–186:
```typescript
      storage: {
        localStorage: Object.keys(window.localStorage || {}),
        sessionStorage: Object.keys(window.sessionStorage || {}),
        cookies: document.cookie,
      },
```
- `app/api/telemetry/route.ts` — Contains hardcoded database fallback credentials at lines 4–10 and persists cookies/storage into DB columns at lines 64–68.
- `components/TelemetryProvider.tsx` — Executes data collection on every route change.

## Commands you will need

| Purpose   | Command             | Expected on success |
|-----------|---------------------|---------------------|
| Typecheck | `bun run typecheck` | exit 0, no errors   |
| Lint      | `bun run lint`      | exit 0, no errors   |

## Scope

**In scope**:
- `lib/data_watcher.ts`
- `app/api/telemetry/route.ts`
- `components/TelemetryProvider.tsx`

**Out of scope**:
- `app/layout.tsx` (Umami script stays intact)

## Git workflow

- Commit message style: `fix(telemetry): remove invasive cookie scraping and purge hardcoded db credentials`

## Steps

### Step 1: Remove cookie and storage harvesting in `lib/data_watcher.ts`

1. In `lib/data_watcher.ts`, remove `cookies`, `localStorage`, and `sessionStorage` collection from the `UltimateUserData` interface and payload construction.
2. Replace the `storage` object with an empty/clean structure or remove it.
3. In `getGPUInfo()`, properly dispose the temporary WebGL context by calling `gl.getExtension('WEBGL_lose_context')?.loseContext()`.

### Step 2: Remove hardcoded fallback credentials in `app/api/telemetry/route.ts`

1. In `app/api/telemetry/route.ts`, remove hardcoded fallback URLs and keys. If `NEXT_PUBLIC_SUPABASE_URL_Telemetry` or `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY_Telemetry` is missing, gracefully return a 200 OK `{ success: true, note: "Telemetry disabled" }` without throwing or connecting to a default database.
2. Remove `cookies`, `local_storage`, `session_storage` insertions from the Supabase insert payload.

### Step 3: Optimize `components/TelemetryProvider.tsx`

1. Ensure `TelemetryProvider` runs only once per session or does not trigger expensive WebGL recalculations on every route parameter change.

**Verify**: `bun run typecheck && bun run lint` → exit 0.

## Done criteria

- [ ] `bun run typecheck` exits 0 with 0 errors
- [ ] `bun run lint` exits 0 with 0 errors
- [ ] `document.cookie` is not read anywhere in `lib/data_watcher.ts`
- [ ] No hardcoded database credentials or keys exist in `app/api/telemetry/route.ts`
- [ ] No files outside the in-scope list are modified

## STOP conditions

- If `TelemetryProvider` removal causes errors in `app/layout.tsx`.
