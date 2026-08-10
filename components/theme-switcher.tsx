"use client"

import { usePathname, useRouter } from "next/navigation"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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

  return (
    <Select
      value={theme}
      onValueChange={(value) => {
        const next = value as Theme
        router.push(crossThemeHref(pathname, next))
      }}
    >
      <SelectTrigger
        size="sm"
        aria-label="theme"
        className={cn(
          "font-mono text-xs text-muted-foreground uppercase",
          className
        )}
      >
        <SelectValue suppressHydrationWarning>--{theme}</SelectValue>
      </SelectTrigger>
      <SelectContent align="end">
        <SelectGroup>
          <SelectLabel className="font-mono text-xs uppercase">
            theme
          </SelectLabel>
          {(["terminal", "hum"] as const).map((value) => (
            <SelectItem key={value} value={value} className="font-mono text-xs">
              --{value}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export { ThemeSwitcher }
