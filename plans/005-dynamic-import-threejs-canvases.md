# Plan 005: Dynamically Import Three.js Canvases and Prune Orphaned 3D Assets

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, reply with your execution report.
>
> **Drift check (run first)**: `git diff --stat 97f366c..HEAD -- components/gallery/gallery-grid.tsx components/pages/organisers/page.tsx components/motion/not-found-scene.tsx components/gallery/gallery-data.ts`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: performance
- **Planned at**: commit `97f366c`, 2026-09-11

## Why this matters

Statically importing Three.js (`three`, `@react-three/fiber`, `@react-three/drei`) bundles ~700KB of heavy WebGL code into the critical initial render chunk of the gallery and organizers pages. Loading canvases dynamically with `next/dynamic` and `ssr: false` speeds up First Contentful Paint and guarantees WebGL APIs are never executed on the Node.js SSR runtime. In addition, removing orphaned 3D scene code and dead data files reduces repository bloat.

## Current state

Relevant files:
- `components/gallery/gallery-grid.tsx` — statically imports `AmbientCanvas` at line 5:
```typescript
import { AmbientCanvas } from "./three-bg"
```
- `components/pages/organisers/page.tsx` — statically imports `AmbientCanvas` at line 11:
```typescript
import { AmbientCanvas } from "@/components/gallery/three-bg"
```
- `components/motion/not-found-scene.tsx` — 114 lines of orphaned 3D scene code, unused anywhere in the project.
- `components/gallery/gallery-data.ts` — 98 lines of static legacy data, unused since migrating to Supabase.

## Commands you will need

| Purpose   | Command             | Expected on success |
|-----------|---------------------|---------------------|
| Typecheck | `bun run typecheck` | exit 0, no errors   |
| Lint      | `bun run lint`      | exit 0, no errors   |

## Scope

**In scope**:
- `components/gallery/gallery-grid.tsx`
- `components/pages/organisers/page.tsx`
- `components/motion/not-found-scene.tsx` (delete)
- `components/gallery/gallery-data.ts` (delete)

**Out of scope**:
- `components/gallery/three-bg.tsx` (remains as the canvas implementation)

## Git workflow

- Commit message style: `perf(gallery): dynamically import Three.js canvases and prune dead 3D assets`

## Steps

### Step 1: Dynamically import `AmbientCanvas` in `gallery-grid.tsx`

1. In `components/gallery/gallery-grid.tsx`, replace the static import of `AmbientCanvas` with:
```typescript
import dynamic from "next/dynamic"

const AmbientCanvas = dynamic(
  () => import("./three-bg").then((mod) => mod.AmbientCanvas),
  { ssr: false }
)
```

### Step 2: Dynamically import `AmbientCanvas` in `organisers/page.tsx`

1. In `components/pages/organisers/page.tsx`, replace the static import with:
```typescript
import dynamic from "next/dynamic"

const AmbientCanvas = dynamic(
  () => import("@/components/gallery/three-bg").then((mod) => mod.AmbientCanvas),
  { ssr: false }
)
```

### Step 3: Remove orphaned dead files

1. Delete `components/motion/not-found-scene.tsx`.
2. Delete `components/gallery/gallery-data.ts`.

**Verify**: `bun run typecheck && bun run lint` → exit 0.

## Done criteria

- [ ] `bun run typecheck` exits 0 with 0 errors
- [ ] `bun run lint` exits 0 with 0 errors
- [ ] `AmbientCanvas` is loaded via `dynamic(..., { ssr: false })` in gallery and organisers pages
- [ ] `components/motion/not-found-scene.tsx` is deleted
- [ ] `components/gallery/gallery-data.ts` is deleted
- [ ] No files outside the in-scope list are modified

## STOP conditions

- If `not-found-scene.tsx` is referenced in any other file (`git grep not-found-scene`).
