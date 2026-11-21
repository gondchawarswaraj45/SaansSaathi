import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import BackButton from './BackButton'

// Mock react-router-dom useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}))

describe('BackButton Component', () => {
  it('renders default label "Back"', () => {
    render(<BackButton />)
    expect(screen.getByText('Back')).toBeInTheDocument()
  })

  it('renders custom label when provided', () => {
    render(<BackButton label="Go Back to Previous Page" />)
    expect(screen.getByText('Go Back to Previous Page')).toBeInTheDocument()
  })

  it('navigates to previous page using navigate(-1) without any hardcoded path', () => {
    render(<BackButton />)
    const button = screen.getByRole('button', { name: /back to previous page/i })
    fireEvent.click(button)
    // Must call navigate with -1
    expect(mockNavigate).toHaveBeenCalledWith(-1)
  })
})
