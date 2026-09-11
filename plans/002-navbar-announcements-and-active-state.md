# Plan 002: Bring Announcements to Front of Navbar and Fix Hum Active Nav State

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, reply with your execution report.
>
> **Drift check (run first)**: `git diff --stat 97f366c..HEAD -- components/site-nav.tsx`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: bug / ux
- **Planned at**: commit `97f366c`, 2026-09-11

## Why this matters

Contestants and clients need immediate access to contest announcements and notices directly from the primary desktop navigation bar without digging into dropdown menus. Additionally, when browsing the Hum theme (`/hum`), the `--home` navigation flag never highlights as active because `isActive` compares `/hum` against `/hum/` with a strict equality check that fails. Fixing this promotes the `--notices` link to the front `mainFlags`, restores active state highlighting across themes, and adds `--organisers` to the dropdown.

## Current state

Relevant file:
- `components/site-nav.tsx` — Main navigation bar; lines 20–42:
```typescript
  const mainFlags = [
    { label: "--home", href: `${base}/` },
    { label: "--gallery", href: `${base}/gallery` },
    { label: "--register", href: `${base}/register` },
  ]

  const dropdownFlags = [
    { label: "--teams", href: `${base}/teams` },
    { label: "--rules", href: `${base}/rules` },
    { label: "--policies", href: `${base}/policies` },
    { label: "--leaderboard", href: `${base}/leaderboard` },
    { label: "--notices", href: `${base}/notices` },
  ]

  const allFlags = [...mainFlags, ...dropdownFlags]

  const isActive = (href: string) => {
    if (href === `${base}/`) return pathname === href
    return pathname === href || pathname.startsWith(`${href}/`)
  }
```

## Commands you will need

| Purpose   | Command             | Expected on success |
|-----------|---------------------|---------------------|
| Typecheck | `bun run typecheck` | exit 0, no errors   |
| Lint      | `bun run lint`      | exit 0, no errors   |

## Scope

**In scope**:
- `components/site-nav.tsx`

**Out of scope**:
- Any route pages or theme layouts

## Git workflow

- Commit message style: `feat(nav): promote announcements to main navbar and fix active state on hum theme`

## Steps

### Step 1: Promote `--notices` to `mainFlags` and add `--organisers` to `dropdownFlags`

In `components/site-nav.tsx`:
1. Move `{ label: "--notices", href: `${base}/notices` }` into `mainFlags` (e.g. right after `--home` or `--gallery`).
2. Add `{ label: "--organisers", href: `${base}/organisers` }` into `dropdownFlags`.

Target `mainFlags` and `dropdownFlags`:
```typescript
  const mainFlags = [
    { label: "--home", href: `${base}/` },
    { label: "--notices", href: `${base}/notices` },
    { label: "--gallery", href: `${base}/gallery` },
    { label: "--register", href: `${base}/register` },
  ]

  const dropdownFlags = [
    { label: "--teams", href: `${base}/teams` },
    { label: "--rules", href: `${base}/rules` },
    { label: "--policies", href: `${base}/policies` },
    { label: "--leaderboard", href: `${base}/leaderboard` },
    { label: "--organisers", href: `${base}/organisers` },
  ]
```

### Step 2: Fix `isActive` trailing slash handling

Update `isActive` to normalize trailing slashes so both `/` (terminal) and `/hum` (Hum theme) match accurately:
```typescript
  const isActive = (href: string) => {
    const cleanPath = pathname.replace(/\/$/, "") || "/"
    const cleanHref = href.replace(/\/$/, "") || "/"
    if (cleanHref === (base.replace(/\/$/, "") || "/")) {
      return cleanPath === cleanHref
    }
    return cleanPath === cleanHref || cleanPath.startsWith(`${cleanHref}/`)
  }
```

**Verify**: `bun run typecheck && bun run lint` → exit 0.

## Done criteria

- [ ] `bun run typecheck` exits 0 with 0 errors
- [ ] `bun run lint` exits 0 with 0 errors
- [ ] `--notices` is in `mainFlags` in `components/site-nav.tsx`
- [ ] `--organisers` is in `dropdownFlags` in `components/site-nav.tsx`
- [ ] `isActive` correctly matches `/hum` against `/hum/`
- [ ] No files outside `components/site-nav.tsx` are modified

## STOP conditions

- If `site-nav.tsx` has structural changes affecting mobile drawer rendering.
