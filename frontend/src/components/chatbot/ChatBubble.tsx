import { Bot, User as UserIcon, ShieldAlert, Sparkles } from 'lucide-react'
import type { ChatMessage } from '@/api/chatApi'

interface Props {
  message: ChatMessage
}

export function ChatBubble({ message }: Props) {
  const isAssistant = message.role === 'ASSISTANT'

  // Format content with paragraphs, bullet points and bolding
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n')
    return lines.map((line, idx) => {
      if (line.startsWith('• ') || line.startsWith('- ')) {
        const itemText = line.substring(2)
        return (
          <li key={idx} className="ml-4 list-disc my-1">
            {formatBoldText(itemText)}
          </li>
        )
      }
      if (line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ') || line.startsWith('4. ')) {
        return (
          <div key={idx} className="my-1 font-medium">
            {formatBoldText(line)}
          </div>
        )
      }
      if (line.trim().startsWith('⚠️') || line.toLowerCase().includes('medical disclaimer')) {
        return (
          <div
            key={idx}
            className="mt-3 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-800 dark:text-amber-300 font-medium"
          >
            {line}
          </div>
        )
      }
      if (line.trim() === '') {
        return <div key={idx} className="h-2" />
      }
      return (
        <p key={idx} className="my-0.5">
          {formatBoldText(line)}
        </p>
      )
    })
  }

  const formatBoldText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g)
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-bold text-foreground">
            {part.slice(2, -2)}
          </strong>
        )
      }
      return part
    })
  }

  return (
    <div className={`flex gap-3 animate-fade-in ${isAssistant ? 'justify-start' : 'justify-end'}`}>
      {isAssistant && (
        <div className="w-8 h-8 rounded-2xl bg-gradient-to-br from-brand-green-500 to-brand-green-700 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
          <Bot className="w-4 h-4" />
        </div>
      )}

      <div className={`max-w-[85%] sm:max-w-[75%] space-y-1`}>
        <div
          className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm ${
            isAssistant
              ? 'bg-card text-foreground rounded-tl-none border border-border'
              : 'bg-brand-green-600 text-white font-medium rounded-tr-none'
          }`}
        >
          {renderFormattedContent(message.content)}
        </div>

        <div className={`text-[10px] text-muted-foreground px-1 ${isAssistant ? 'text-left' : 'text-right'}`}>
          {message.createdAt
            ? new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : 'Just now'}
        </div>
      </div>

      {!isAssistant && (
        <div className="w-8 h-8 rounded-2xl bg-muted text-foreground flex items-center justify-center shrink-0 border border-border mt-0.5">
          <UserIcon className="w-4 h-4" />
        </div>
      )}
    </div>
  )
}
