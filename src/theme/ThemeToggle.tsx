import { SegmentedControl } from '../components/ui/SegmentedControl'
import { useTheme, type ResolvedTheme } from './theme-context'

const OPTIONS = [
  { value: 'light', label: 'Day' },
  { value: 'dark', label: 'Night' },
] satisfies { value: ResolvedTheme; label: string }[]

/** "Day / Night" gallery lighting. The reveal starts from the button that was pressed. */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme()
  return (
    <SegmentedControl
      label="Gallery lighting"
      options={OPTIONS}
      value={theme}
      onValueChange={(next, from) => setTheme(next, from)}
      className={className}
    />
  )
}
