export type Theme = "terminal" | "hum"

/** URL prefix for each theme's route group. terminal owns the bare paths. */
export const THEME_ROOT: Record<Theme, string> = {
  terminal: "",
  hum: "/hum",
}

/** Derive the active theme from a pathname. Routes encode the theme. */
export function themeFromPathname(pathname: string): Theme {
  if (pathname === "/hum" || pathname.startsWith("/hum/")) return "hum"
  return "terminal"
}

/**
 * Inline script for the pre-hydration theme paint. Runs before first paint in
 * the root layout so the correct theme tokens apply with zero flash. Built from
 * the same route→theme mapping so it can never drift from `themeFromPathname`.
 */
export function buildThemeScript(): string {
  const checks = (Object.keys(THEME_ROOT) as Theme[])
    .filter((theme) => THEME_ROOT[theme] !== "")
    .map(
      (theme) =>
        `if(p==="${THEME_ROOT[theme]}"||p.indexOf("${THEME_ROOT[theme]}/")===0){t="${theme}"}`
    )
    .join("")

  return `(function(){try{var p=window.location.pathname;var t="terminal";${checks}var d=document.documentElement;d.dataset.theme=t;d.classList.toggle("dark",t==="terminal");}catch(e){}})();`
}
