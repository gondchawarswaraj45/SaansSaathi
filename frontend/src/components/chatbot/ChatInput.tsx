import { useState, useRef, useEffect } from 'react'
import { Send, Sparkles, Loader2 } from 'lucide-react'

interface Props {
  onSend: (message: string) => void
  disabled?: boolean
}

export function ChatInput({ onSend, disabled }: Props) {
  const [text, setText] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleSubmit = () => {
    if (!text.trim() || disabled) return
    onSend(text.trim())
    setText('')
  }

  return (
    <div className="relative bg-card border border-border rounded-2xl p-2 sm:p-2.5 shadow-sm focus-within:border-brand-green-500 focus-within:ring-2 focus-within:ring-brand-green-500/20 transition-all">
      <textarea
        ref={textareaRef}
        rows={2}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder="Ask SaansSaathi about winter smog, children's outdoor safety, N95 masks, or morning running..."
        className="w-full bg-transparent resize-none text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none px-2 py-1 pr-14"
      />

      <div className="flex items-center justify-between pt-1 border-t border-border/40 mt-1">
        <span className="text-[10px] text-muted-foreground pl-2 hidden sm:inline">
          Press <kbd className="px-1 py-0.5 bg-muted rounded border border-border text-[9px]">Enter</kbd> to send, <kbd className="px-1 py-0.5 bg-muted rounded border border-border text-[9px]">Shift+Enter</kbd> for new line
        </span>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!text.trim() || disabled}
          className="ml-auto px-4 py-2 bg-brand-green-600 hover:bg-brand-green-700 disabled:opacity-50 disabled:hover:bg-brand-green-600 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
        >
          {disabled ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Thinking...
            </>
          ) : (
            <>
              Send <Send className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>
    </div>
  )
}
