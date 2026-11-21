import { create } from 'zustand'

export type Theme = 'light' | 'dark' | 'system'

interface ThemeState {
  theme: Theme
  isDark: boolean
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const getSystemPrefersDark = () =>
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-color-scheme: dark)').matches

const applyThemeToDOM = (theme: Theme): boolean => {
  if (typeof document === 'undefined') return false
  const root = document.documentElement
  const isDark = theme === 'dark' || (theme === 'system' && getSystemPrefersDark())

  if (isDark) {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
  return isDark
}

// Initial theme from localStorage or fallback to system
const initialTheme: Theme =
  (typeof localStorage !== 'undefined' && (localStorage.getItem('saanssaathi_theme') as Theme)) ||
  'system'

const initialIsDark = applyThemeToDOM(initialTheme)

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: initialTheme,
  isDark: initialIsDark,

  setTheme: (theme: Theme) => {
    localStorage.setItem('saanssaathi_theme', theme)
    const isDark = applyThemeToDOM(theme)
    set({ theme, isDark })
  },

  toggleTheme: () => {
    const current = get().theme
    const next: Theme = current === 'dark' ? 'light' : 'dark'
    get().setTheme(next)
  },
}))

// Listen for system preference changes when on system mode
if (typeof window !== 'undefined' && window.matchMedia) {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    const state = useThemeStore.getState()
    if (state.theme === 'system') {
      const isDark = applyThemeToDOM('system')
      useThemeStore.setState({ isDark })
    }
  })
}
