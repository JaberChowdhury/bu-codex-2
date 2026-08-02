import "@/themes/terminal.css"
import { ThemeRoot } from "@/components/theme-root"

/* Initial paint theming is handled by the beforeInteractive script in the root
 * layout (URL → theme). ThemeRoot covers client-side navigation between themes.
 */
export default function TerminalLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <ThemeRoot theme="terminal" />
      {children}
    </>
  )
}
