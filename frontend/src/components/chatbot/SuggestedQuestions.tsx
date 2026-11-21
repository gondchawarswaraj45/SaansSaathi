import { Sparkles, HelpCircle } from 'lucide-react'

interface Props {
  onSelect: (question: string) => void
  disabled?: boolean
}

export function SuggestedQuestions({ onSelect, disabled }: Props) {
  const questions = [
    'Is it safe to go running outside today?',
    'Should my 8-year-old child go to school in this smog?',
    'What is the best time to open windows today?',
    'How do I create a Clean Air Room in my home?',
    'What does PM2.5 actually mean for my lungs?',
    'Does burning agarbatti or mosquito coils increase PM2.5?',
  ]

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
        <Sparkles className="w-3.5 h-3.5 text-brand-green-600" />
        <span>Quick Suggested Inquiries:</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {questions.map((q, idx) => (
          <button
            key={idx}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(q)}
            className="text-left text-xs px-3 py-1.5 rounded-xl border border-border bg-card hover:bg-brand-green-50/70 hover:border-brand-green-300 dark:hover:bg-brand-green-950/20 text-foreground/90 transition-all shadow-xs disabled:opacity-50"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  )
}
