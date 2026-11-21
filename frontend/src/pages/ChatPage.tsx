import { useState, useEffect, useRef } from 'react'
import { Bot, Shield, Sparkles, MessageSquare, Plus, Info, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'
import {
  chatApi,
  type ChatSession,
  type ChatMessage,
} from '@/api/chatApi'
import { ChatBubble } from '@/components/chatbot/ChatBubble'
import { ChatInput } from '@/components/chatbot/ChatInput'
import { SuggestedQuestions } from '@/components/chatbot/SuggestedQuestions'
import { ChatSidebar } from '@/components/chatbot/ChatSidebar'
import BackButton from '@/components/common/BackButton'

export default function ChatPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [activeSessionId, setActiveSessionId] = useState<number | undefined>(undefined)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)
  const [isSending, setIsSending] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Initial welcome message for brand new or empty chats
  const initialWelcomeMessage: ChatMessage = {
    id: 0,
    sessionId: 0,
    role: 'ASSISTANT',
    content:
      'Namaste! I am your SaansSaathi AI Companion.\n\nI specialize in Indian urban winter smog defense, family health protection routines, Clean Air Rooms, and inversion management.\n\nHow can I help protect your family from pollution today?',
    createdAt: new Date().toISOString(),
  }

  // Load chat sessions on mount
  useEffect(() => {
    loadSessions()
  }, [])

  const loadSessions = async () => {
    try {
      const data = await chatApi.getSessions()
      setSessions(data || [])
      if (data && data.length > 0 && !activeSessionId) {
        selectSession(data[0].id)
      } else if (!activeSessionId) {
        setMessages([initialWelcomeMessage])
      }
    } catch (err) {
      console.error('Failed to load chat sessions', err)
      setMessages([initialWelcomeMessage])
    }
  }

  const selectSession = async (sessionId: number) => {
    setActiveSessionId(sessionId)
    setIsLoadingMessages(true)
    try {
      const msgs = await chatApi.getSessionMessages(sessionId)
      if (msgs && msgs.length > 0) {
        setMessages(msgs)
      } else {
        setMessages([initialWelcomeMessage])
      }
    } catch (err) {
      console.error('Failed to load session messages', err)
      toast.error('Could not load chat history')
    } finally {
      setIsLoadingMessages(false)
    }
  }

  const handleNewChat = () => {
    setActiveSessionId(undefined)
    setMessages([initialWelcomeMessage])
  }

  const handleDeleteSession = async (id: number) => {
    try {
      await chatApi.deleteSession(id)
      setSessions((prev) => prev.filter((s) => s.id !== id))
      if (activeSessionId === id) {
        handleNewChat()
      }
      toast.success('Chat session deleted')
    } catch (err) {
      console.error('Failed to delete session', err)
      toast.error('Failed to delete session')
    }
  }

  const handleSend = async (text: string) => {
    if (!text.trim() || isSending) return

    // Optimistically add user message to UI
    const tempUserMsg: ChatMessage = {
      id: Date.now(),
      sessionId: activeSessionId || 0,
      role: 'USER',
      content: text,
      createdAt: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, tempUserMsg])
    setIsSending(true)

    try {
      const response = await chatApi.sendMessage({
        sessionId: activeSessionId,
        message: text,
        currentAqi: 285,
        city: 'Delhi NCR',
      })

      // If this was a new session, update active session and refresh list
      if (!activeSessionId && response.sessionId) {
        setActiveSessionId(response.sessionId)
        loadSessions()
      }

      setMessages((prev) => [...prev, response])
    } catch (err) {
      console.error('Failed to send message', err)
      toast.error('AI service temporarily unreachable. Using local advisory.')
      // Add local fallback message
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sessionId: activeSessionId || 0,
          role: 'ASSISTANT',
          content:
            '⚠️ Communication note: Unable to connect to the cloud AI server right now. When outdoor AQI is elevated, please seal bedroom doors, avoid burning incense, and wear an N95 mask for outdoor exposure.\n\n⚠️ Medical Disclaimer: For air quality awareness and precautionary guidance only. Not medical advice.',
          createdAt: new Date().toISOString(),
        },
      ])
    } finally {
      setIsSending(false)
    }
  }

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isSending])

  return (
    <div className="page-container max-w-6xl space-y-6 animate-fade-in pb-10">
      <BackButton />
      {/* Page Header */}
      <div className="pb-3 border-b border-border flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
            <Bot className="w-7 h-7 text-brand-green-600" />
            AI Air Quality Saathi
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Gemini-Powered Environmental Health & Family Protection Assistant • Grounded in CPCB & WHO Science
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleNewChat}
            className="sm:hidden px-3.5 py-1.5 rounded-xl bg-brand-green-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" /> New Chat
          </button>
        </div>
      </div>

      {/* Medical Safety Disclaimer Banner */}
      <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3 text-xs text-amber-900 dark:text-amber-200">
        <Shield className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Medical & Safety Guardrail:</strong> SaansSaathi AI provides environmental exposure-reduction
          protocols, inversion timing, and air purifier guidance. It does <em>not</em> provide medical diagnosis or
          prescribe medications. Always consult a pulmonologist or healthcare professional for clinical symptoms.
        </div>
      </div>

      {/* Main Chat Interface Layout: Sidebar + Message Area */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start">
        {/* Sidebar (Session History) */}
        <div className="hidden sm:block sm:col-span-4 lg:col-span-3">
          <ChatSidebar
            sessions={sessions}
            activeSessionId={activeSessionId}
            onSelectSession={selectSession}
            onNewChat={handleNewChat}
            onDeleteSession={handleDeleteSession}
          />
        </div>

        {/* Chat Window */}
        <div className="sm:col-span-8 lg:col-span-9 bg-card border border-border rounded-3xl p-4 sm:p-6 shadow-sm flex flex-col h-[680px]">
          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 sm:pr-2">
            {isLoadingMessages ? (
              <div className="h-full flex items-center justify-center text-xs text-muted-foreground gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-brand-green-600" />
                Loading conversation history...
              </div>
            ) : (
              <>
                {messages.map((msg) => (
                  <ChatBubble key={msg.id} message={msg} />
                ))}

                {isSending && (
                  <div className="flex gap-3 animate-pulse">
                    <div className="w-8 h-8 rounded-2xl bg-brand-green-600 text-white flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="p-4 rounded-2xl bg-muted/60 text-xs text-muted-foreground rounded-tl-none border border-border flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-brand-green-600 animate-ping" />
                      Analyzing telemetry and synthesizing family advice...
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Quick Suggested Inquiries */}
          <div className="pt-3 pb-2 border-t border-border/50">
            <SuggestedQuestions onSelect={handleSend} disabled={isSending} />
          </div>

          {/* Chat Input Field */}
          <div className="pt-2">
            <ChatInput onSend={handleSend} disabled={isSending} />
          </div>
        </div>
      </div>
    </div>
  )
}
