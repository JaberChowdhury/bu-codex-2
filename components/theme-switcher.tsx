"use client"

import { usePathname, useRouter } from "next/navigation"
import { IconMoon, IconSun } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import type { Theme } from "@/components/theme"
import { THEME_ROOT, themeFromPathname } from "@/components/theme"
import { cn } from "@/lib/utils"

/** Map a page in one theme to its equivalent in another theme, preserving the
 * section (e.g. /hum/register → /register, never the theme root). */
function crossThemeHref(currentPathname: string, nextTheme: Theme): string {
  const currentTheme = themeFromPathname(currentPathname)
  const suffix = currentPathname.slice(THEME_ROOT[currentTheme].length) || "/"
  return `${THEME_ROOT[nextTheme]}${suffix}` || "/"
}

function ThemeSwitcher({
  theme,
  className,
}: {
  theme: Theme
  className?: string
}) {
  const router = useRouter()
  const pathname = usePathname()

  const toggleTheme = () => {
    const nextTheme: Theme = theme === "terminal" ? "hum" : "terminal"
    router.push(crossThemeHref(pathname, nextTheme))
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className={cn("h-8 w-8 text-muted-foreground hover:text-foreground bg-transparent border-border", className)}
      aria-label="Toggle theme"
    >
      {theme === "terminal" ? (
        <IconMoon className="size-4" />
      ) : (
        <IconSun className="size-4" />
      )}
    </Button>
  )
}

export { ThemeSwitcher }
