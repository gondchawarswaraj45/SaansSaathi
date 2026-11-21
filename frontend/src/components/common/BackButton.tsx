import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

interface BackButtonProps {
  label?: string
  className?: string
  variant?: 'ghost' | 'outline' | 'pill'
}

/**
 * Universal Back Button that always navigates to the previous page in history
 * using `navigate(-1)` rather than any fixed or hardcoded path.
 */
export default function BackButton({
  label = 'Back',
  className = '',
  variant = 'ghost',
}: BackButtonProps) {
  const navigate = useNavigate()

  const handleBack = () => {
    // If there is browser history, navigate(-1) goes to previous page
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      // Fallback only if directly opened in a new tab with no previous history
      navigate(-1)
    }
  }

  const baseStyles =
    'inline-flex items-center gap-1.5 text-xs font-semibold transition-colors cursor-pointer select-none group'

  const variants = {
    ghost:
      'text-muted-foreground hover:text-foreground py-1 px-1.5 -ml-1.5 rounded-lg hover:bg-muted/50',
    outline:
      'px-3 py-1.5 rounded-xl border border-border bg-card/80 hover:bg-muted text-foreground shadow-xs',
    pill:
      'px-3 py-1 rounded-full bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground',
  }

  return (
    <button
      type="button"
      onClick={handleBack}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      aria-label="Back to previous page"
      title="Back to previous page"
    >
      <ArrowLeft className="w-4 h-4 shrink-0 transition-transform group-hover:-translate-x-0.5" />
      <span>{label}</span>
    </button>
  )
}
