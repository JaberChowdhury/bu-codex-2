# Plan 004: Fix Hostname Validation in Admin Image Proxy (Prevent SSRF)

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, reply with your execution report.
>
> **Drift check (run first)**: `git diff --stat 97f366c..HEAD -- app/api/admin/image-proxy/route.ts`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: security
- **Planned at**: commit `97f366c`, 2026-09-11

## Why this matters

`app/api/admin/image-proxy/route.ts` validates destination hostnames using `!target.hostname.endsWith("supabase.co")`. Because this is a simple string suffix check, it matches attacker-controlled domains such as `evil-supabase.co` or arbitrary third-party Supabase instances, creating an open Server-Side Request Forgery (SSRF) proxy. Enforcing strict matching against the configured Supabase project domain closes the vulnerability while continuing to safely proxy legitimate storage images.

## Current state

Relevant file:
- `app/api/admin/image-proxy/route.ts` — lines 28–30:
```typescript
  if (!target.hostname.endsWith("supabase.co")) {
    return NextResponse.json({ error: "Forbidden host" }, { status: 400 })
  }
```

## Commands you will need

| Purpose   | Command             | Expected on success |
|-----------|---------------------|---------------------|
| Typecheck | `bun run typecheck` | exit 0, no errors   |
| Lint      | `bun run lint`      | exit 0, no errors   |

## Scope

**In scope**:
- `app/api/admin/image-proxy/route.ts`

**Out of scope**:
- Any other API routes

## Git workflow

- Commit message style: `fix(security): enforce strict project hostname check on admin image proxy`

## Steps

### Step 1: Enforce strict project host check in `app/api/admin/image-proxy/route.ts`

1. In `app/api/admin/image-proxy/route.ts`, parse the configured `NEXT_PUBLIC_SUPABASE_URL` hostname:
```typescript
  const allowedHost = process.env.NEXT_PUBLIC_SUPABASE_URL
    ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
    : null
```
2. Validate that:
   - `target.protocol === "https:"`
   - `target.hostname === allowedHost || target.hostname.endsWith(".supabase.co")`
   - `target.hostname` does NOT resolve to localhost or private IP ranges.

Target pattern:
```typescript
  const allowedHost = process.env.NEXT_PUBLIC_SUPABASE_URL
    ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
    : null

  const isAllowedHost =
    target.protocol === "https:" &&
    (target.hostname === allowedHost ||
      (target.hostname.endsWith(".supabase.co") && !target.hostname.includes("@")))

  if (!isAllowedHost) {
    return NextResponse.json({ error: "Forbidden host" }, { status: 400 })
  }
```

**Verify**: `bun run typecheck && bun run lint` → exit 0.

## Done criteria

- [ ] `bun run typecheck` exits 0 with 0 errors
- [ ] `bun run lint` exits 0 with 0 errors
- [ ] Hostname check rejects non-https and non-subdomain targets
- [ ] No files outside `app/api/admin/image-proxy/route.ts` are modified

## STOP conditions

- If `NEXT_PUBLIC_SUPABASE_URL` is not used for project image storage.
