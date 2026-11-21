import { useState } from 'react'
import { Bot, Send, Sparkles, AlertCircle, Shield } from 'lucide-react'

interface Message {
  id: number
  role: 'user' | 'assistant'
  content: string
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'assistant',
      content:
        'Namaste! I am SaansSaathi AI. I can answer questions about winter smog, safe exercise hours, school commute safety, and indoor air purification. How can I assist your family today?',
    },
  ])
  const [input, setInput] = useState('')

  const handleSend = (textToSend?: string) => {
    const text = textToSend || input
    if (!text.trim()) return

    const userMsg: Message = { id: Date.now(), role: 'user', content: text }
    setMessages((prev) => [...prev, userMsg])
    if (!textToSend) setInput('')

    // AI response simulation with safety guardrails
    setTimeout(() => {
      let reply = ''
      if (text.toLowerCase().includes('cricket') || text.toLowerCase().includes('child')) {
        reply =
          'Your location currently registers an AQI of 285 (Poor category). For an 8-year-old child, outdoor sports like cricket are NOT recommended today due to high alveolar particulate penetration during strenuous breathing. Prefer indoor sports like table tennis, badminton, or indoor drills until afternoon ventilation improves.'
      } else if (text.toLowerCase().includes('window') || text.toLowerCase().includes('ventilate')) {
        reply =
          'Keep windows closed during early morning hours (06:00 AM – 10:00 AM) due to thermal inversion trapping smog. The best time to briefly cross-ventilate your home is between 01:00 PM and 03:00 PM when solar warming dilutes ground-level concentrations.'
      } else {
        reply =
          'At current AQI levels (~285), fine particulates (PM2.5) are the dominant concern. Ensure family members wear properly fitted N95 masks for outdoor commutes, run kitchen exhausts while cooking, and avoid burning incense indoors.'
      }

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: 'assistant', content: reply },
      ])
    }, 600)
  }

  const quickPrompts = [
    'Can my 8-year-old child play cricket outside today?',
    'When should I open my windows today?',
    'Is an N95 mask useful for my office bike commute?',
    'How does cooking smoke affect indoor AQI?',
  ]

  return (
    <div className="page-container max-w-4xl space-y-6 animate-fade-in">
      <div className="pb-2 border-b border-border flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AI Air Quality Saathi</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Powered by Gemini • Real-time telemetry context • Follows CPCB & WHO guidelines
          </p>
        </div>
      </div>

      {/* Medical Disclaimer Banner */}
      <div className="p-3 rounded-2xl bg-muted/60 border border-border flex items-center gap-2.5 text-xs text-muted-foreground">
        <Shield className="w-4 h-4 text-brand-green-600 shrink-0" />
        <span>
          <strong>Disclaimer:</strong> SaansSaathi provides exposure-reduction guidance based on
          air quality data. It does not provide medical diagnosis or prescribe medications.
        </span>
      </div>

      {/* Chat Messages Log */}
      <div className="p-6 rounded-3xl bg-card border border-border shadow-sm min-h-[400px] max-h-[500px] overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-xl bg-brand-green-600 text-white flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5" />
              </div>
            )}
            <div
              className={`p-4 rounded-2xl text-sm leading-relaxed max-w-[80%] ${
                msg.role === 'user'
                  ? 'bg-brand-green-600 text-white font-medium rounded-tr-none'
                  : 'bg-muted/60 text-foreground rounded-tl-none border border-border'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      {/* Suggested Quick Prompts */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          Suggested Inquiries:
        </span>
        <div className="flex flex-wrap gap-2">
          {quickPrompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleSend(prompt)}
              className="text-xs px-3 py-1.5 rounded-full border border-border bg-card hover:bg-muted text-foreground transition-all"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input Field */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSend()
        }}
        className="flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask SaansSaathi about today's air quality, family safety, or indoor hacks…"
          className="flex-1 px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-brand-green-600 focus:outline-none text-sm"
        />
        <button
          type="submit"
          className="px-5 py-3 rounded-xl bg-brand-green-600 text-white font-bold hover:bg-brand-green-700 shadow-md transition-all flex items-center gap-1.5"
        >
          <Send className="w-4 h-4" /> Send
        </button>
      </form>
    </div>
  )
}
