import { GalleryGrid } from "@/components/gallery/gallery-grid"

export default function GalleryPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-16">
      <header className="flex flex-col gap-3">
        <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          &gt; ls gallery/
        </p>
        <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground">
          GALLERY // ROUND_02
        </h1>
        <p className="text-sm text-muted-foreground">
          Stills from Round 01. Fresh frames from Round 02 land after Sep 12.
        </p>
        <p className="tnum font-mono text-xs text-muted-foreground">
          <span className="text-accent">09</span> frames indexed · 03 categories
        </p>
      </header>

      <GalleryGrid />

      <footer className="border-t border-border pt-6 font-mono text-xs text-muted-foreground">
        archive: more frames → after round_02 · photos: bu cse club
      </footer>
    </div>
  )
}
