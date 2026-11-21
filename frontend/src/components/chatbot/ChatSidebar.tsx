import { MessageSquare, Plus, Trash2, Calendar } from 'lucide-react'
import type { ChatSession } from '@/api/chatApi'

interface Props {
  sessions: ChatSession[]
  activeSessionId?: number
  onSelectSession: (id: number) => void
  onNewChat: () => void
  onDeleteSession: (id: number) => void
}

export function ChatSidebar({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
}: Props) {
  return (
    <div className="w-full sm:w-64 bg-card border border-border rounded-3xl p-4 flex flex-col h-full max-h-[700px] shadow-sm space-y-4">
      {/* New Chat Button */}
      <button
        type="button"
        onClick={onNewChat}
        className="w-full py-2.5 px-4 rounded-2xl bg-brand-green-600 hover:bg-brand-green-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
      >
        <Plus className="w-4 h-4" /> New Consultation
      </button>

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-2 block mb-2">
          Past Consultations ({sessions.length})
        </span>

        {sessions.length === 0 ? (
          <div className="p-4 text-center text-xs text-muted-foreground">
            No past chats yet. Start a new consultation above!
          </div>
        ) : (
          sessions.map((s) => {
            const isActive = s.id === activeSessionId
            return (
              <div
                key={s.id}
                onClick={() => onSelectSession(s.id)}
                className={`group flex items-center justify-between p-2.5 rounded-xl cursor-pointer text-xs transition-all ${
                  isActive
                    ? 'bg-brand-green-50 text-brand-green-800 font-bold border border-brand-green-200 dark:bg-brand-green-950/40 dark:text-brand-green-300 dark:border-brand-green-800'
                    : 'text-foreground hover:bg-muted/60'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-brand-green-600' : 'text-muted-foreground'}`} />
                  <span className="truncate">{s.title || 'Untitled Session'}</span>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDeleteSession(s.id)
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-600 transition-opacity"
                  title="Delete Session"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
