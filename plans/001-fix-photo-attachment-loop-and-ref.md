# Plan 001: Fix Photo Attachment Infinite Re-render Loop and Reveal Ref Forwarding

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, reply with your execution report.
>
> **Drift check (run first)**: `git diff --stat 97f366c..HEAD -- components/register/photo-field.tsx components/motion/reveal.tsx`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: bug
- **Planned at**: commit `97f366c`, 2026-09-11

## Why this matters

When a contestant selects a photo during registration, `photo-field.tsx` triggers an infinite `useEffect` loop that repeatedly creates and revokes object URLs, thrashing memory and freezing the browser tab. Additionally, `<Reveal asChild>` does not forward its `ref` to the child element, causing the `IntersectionObserver` to never observe the node, leaving animated components permanently hidden with 0 opacity. Fixing these ensures smooth, bug-free team registrations and animations.

## Current state

Relevant files:
- `components/register/photo-field.tsx` — Photo upload input component; contains the infinite `useEffect` loop on lines 25–39:
```typescript
  React.useEffect(() => {
    let objectUrl: string | null = null

    if (value) {
      objectUrl = URL.createObjectURL(value)
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPreview(objectUrl)
    } else if (preview !== null) {
      setPreview(null)
    }

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [value, preview])
```
- `components/motion/reveal.tsx` — Scroll reveal animation component; omits `ref` in `React.cloneElement` on lines 47–54:
```typescript
  if (asChild) {
    const child = React.Children.only(children) as React.ReactElement<{
      className?: string
    }>
    return React.cloneElement(child, {
      className: cn("reveal", child.props.className),
    })
  }
```

## Commands you will need

| Purpose   | Command                  | Expected on success |
|-----------|--------------------------|---------------------|
| Typecheck | `bun run typecheck`      | exit 0, no errors   |
| Lint      | `bun run lint`           | exit 0, no errors   |

## Scope

**In scope**:
- `components/register/photo-field.tsx`
- `components/motion/reveal.tsx`

**Out of scope**:
- `components/register/register-form.tsx`
- `components/register/schema.ts`

## Git workflow

- Commit message style: `fix(register): resolve photo field re-render loop and reveal ref forwarding`

## Steps

### Step 1: Fix `useEffect` in `photo-field.tsx`

1. In `components/register/photo-field.tsx`, rewrite the `useEffect` so that it depends ONLY on `[value]`.
2. When `value` changes:
   - If `value` is present, create the object URL via `URL.createObjectURL(value)` and call `setPreview(url)`.
   - If `value` is null, set `setPreview(null)`.
   - In the cleanup return function, revoke the created `objectUrl` if it exists.
3. Remove the eslint disable comment `// eslint-disable-next-line react-hooks/set-state-in-effect` if no longer needed.

Target pattern:
```typescript
  React.useEffect(() => {
    if (!value) {
      setPreview(null)
      return
    }

    const objectUrl = URL.createObjectURL(value)
    setPreview(objectUrl)

    return () => {
      URL.revokeObjectURL(objectUrl)
    }
  }, [value])
```

**Verify**: `bun run typecheck` → exit 0, no errors.

### Step 2: Forward ref in `reveal.tsx` when `asChild` is true

1. In `components/motion/reveal.tsx`, in the `if (asChild)` block, pass `ref` to `React.cloneElement`:
```typescript
  if (asChild) {
    const child = React.Children.only(children) as React.ReactElement<{
      className?: string
      ref?: React.Ref<HTMLDivElement>
    }>
    return React.cloneElement(child, {
      ref,
      className: cn("reveal", child.props.className),
    })
  }
```

**Verify**: `bun run typecheck && bun run lint` → exit 0.

## Test plan

- Verify `bun run typecheck` exits 0.
- Verify `bun run lint` exits 0.
- Inspect `photo-field.tsx` to ensure `preview` is not in the `useEffect` dependency array.

## Done criteria

- [ ] `bun run typecheck` exits 0 with 0 errors
- [ ] `bun run lint` exits 0 with 0 errors
- [ ] `useEffect` in `photo-field.tsx` depends only on `[value]`
- [ ] `reveal.tsx` forwards `ref` when `asChild` is true
- [ ] No files outside the in-scope list are modified

## STOP conditions

- If `photo-field.tsx` props interface has changed from `PhotoFieldProps`.
- If typecheck or linting fails after applying the fixes.
