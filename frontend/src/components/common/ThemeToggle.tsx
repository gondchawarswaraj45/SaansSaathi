import React from 'react'
import { Sun, Moon } from 'lucide-react'
import { useThemeStore } from '@/store/themeStore'

interface ThemeToggleProps {
  className?: string
  showLabel?: boolean
}

export function ThemeToggle({ className = '', showLabel = false }: ThemeToggleProps) {
  const { isDark, toggleTheme, theme } = useThemeStore()

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all flex items-center gap-2 focus:outline-none focus:ring-1 focus:ring-brand-green-500 ${className}`}
      title={`Current: ${theme} theme. Click to toggle ${isDark ? 'light' : 'dark'} mode`}
      aria-label="Toggle theme mode"
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        {isDark ? (
          <Sun className="w-4 h-4 text-amber-400 rotate-0 transition-transform duration-300 hover:rotate-45" />
        ) : (
          <Moon className="w-4 h-4 text-slate-700 dark:text-slate-300 -rotate-12 transition-transform duration-300 hover:rotate-0" />
        )}
      </div>
      {showLabel && (
        <span className="text-xs font-semibold capitalize">
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </span>
      )}
    </button>
  )
}

export default ThemeToggle
