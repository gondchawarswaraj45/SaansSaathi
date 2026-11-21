import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeToggle } from './ThemeToggle'
import { useThemeStore } from '@/store/themeStore'

describe('ThemeToggle Component', () => {
  beforeEach(() => {
    useThemeStore.setState({ theme: 'light', isDark: false })
  })

  it('renders theme toggle button with accessible aria-label', () => {
    render(<ThemeToggle />)
    const button = screen.getByRole('button', { name: /toggle theme mode/i })
    expect(button).toBeInTheDocument()
  })

  it('displays text label when showLabel prop is passed', () => {
    render(<ThemeToggle showLabel={true} />)
    expect(screen.getByText(/Dark Mode/i)).toBeInTheDocument()
  })

  it('toggles theme store state when clicked', () => {
    render(<ThemeToggle showLabel={true} />)
    const button = screen.getByRole('button', { name: /toggle theme mode/i })

    fireEvent.click(button)
    expect(useThemeStore.getState().isDark).toBe(true)
    expect(screen.getByText(/Light Mode/i)).toBeInTheDocument()

    fireEvent.click(button)
    expect(useThemeStore.getState().isDark).toBe(false)
    expect(screen.getByText(/Dark Mode/i)).toBeInTheDocument()
  })
})
