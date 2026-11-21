import { Bot, Sparkles } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

export function FloatingChatButton() {
  const location = useLocation()

  // Don't render on the full ChatPage itself
  if (location.pathname === '/chat') {
    return null
  }

  return (
    <Link
      to="/chat"
      className="fixed bottom-6 right-6 z-40 p-3.5 bg-gradient-to-r from-brand-green-600 to-brand-green-700 hover:from-brand-green-700 hover:to-brand-green-800 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 group animate-bounce-subtle"
      title="Ask SaansSaathi AI"
    >
      <Bot className="w-5 h-5" />
      <span className="text-xs font-bold hidden sm:inline-block max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap">
        Ask Air AI
      </span>
      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 absolute top-1 right-1 animate-pulse border-2 border-white" />
    </Link>
  )
}
