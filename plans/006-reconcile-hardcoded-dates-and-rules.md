# Plan 006: Reconcile Hardcoded Dates, Rule Discrepancies, and Constants

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, reply with your execution report.
>
> **Drift check (run first)**: `git diff --stat 97f366c..HEAD -- app/layout.tsx components/pages/rules/page.tsx components/home/terminal-boot.tsx`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: tech-debt / config
- **Planned at**: commit `97f366c`, 2026-09-11

## Why this matters

Layout metadata states "Sep 12, 2026", the rules page hardcodes "3-4 hours" and "8-12 problems", while `lib/constants.ts` specifies Registration closes Sep 25, Contest duration 5 hours, and 11 problems. These discrepancies cause confusion for participating contestants and organizers. Centralizing and synchronizing these values with `EVENT_DETAILS` ensures single-source-of-truth accuracy across the site.

## Current state

Relevant files:
- `lib/constants.ts` — contains `EVENT_DETAILS`:
```typescript
export const EVENT_DETAILS = {
  REGISTRATION_OPENS: "AUG 02",
  REGISTRATION_CLOSES: "SEP 25",
  PRELIMS_DATE: "OCT 02",
  ONSITE_FINAL_DATE: "OCT 03",
  DURATION_TEXT: "5h 00m",
  DURATION_HOURS: 5,
  PROBLEMS_COUNT: 11,
  // ...
}
```
- `app/layout.tsx:53` — metadata description specifies "Sep 12, 2026".
- `components/pages/rules/page.tsx:34, 58` — specifies "3-4 hours" and "8-12 problems".
- `components/home/terminal-boot.tsx:9-10` — hardcodes problem and team counts as raw strings.

## Commands you will need

| Purpose   | Command             | Expected on success |
|-----------|---------------------|---------------------|
| Typecheck | `bun run typecheck` | exit 0, no errors   |
| Lint      | `bun run lint`      | exit 0, no errors   |

## Scope

**In scope**:
- `app/layout.tsx`
- `components/pages/rules/page.tsx`
- `components/home/terminal-boot.tsx`

**Out of scope**:
- `lib/constants.ts` (source of truth)

## Git workflow

- Commit message style: `docs(rules): synchronize contest dates, problem count, and duration with constants`

## Steps

### Step 1: Update metadata description in `app/layout.tsx`

1. In `app/layout.tsx`, update the description to reference the official round dates ("Oct 02–03, 2026") instead of "Sep 12".

### Step 2: Synchronize rules in `components/pages/rules/page.tsx`

1. Import `EVENT_DETAILS` from `@/lib/constants`.
2. Update contest duration to `{EVENT_DETAILS.DURATION_HOURS} hours` (or 5 hours) and problem count to `{EVENT_DETAILS.PROBLEMS_COUNT} problems` (11 problems).

### Step 3: Align `components/home/terminal-boot.tsx`

1. Reference `EVENT_DETAILS.PROBLEMS_COUNT` and `EVENT_DETAILS.TEAM_SLOTS` in the boot sequence output lines.

**Verify**: `bun run typecheck && bun run lint` → exit 0.

## Done criteria

- [ ] `bun run typecheck` exits 0 with 0 errors
- [ ] `bun run lint` exits 0 with 0 errors
- [ ] Metadata description in `app/layout.tsx` reflects current contest dates
- [ ] `components/pages/rules/page.tsx` references `EVENT_DETAILS` for duration and problem counts
- [ ] No files outside the in-scope list are modified

## STOP conditions

- If `EVENT_DETAILS` is missing any required property.
