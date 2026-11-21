import { Shield, Activity, Database, CheckCircle } from 'lucide-react'

export default function AdminPage() {
  return (
    <div className="page-container space-y-6 animate-fade-in">
      <div className="pb-2 border-b border-border">
        <h1 className="text-2xl font-bold tracking-tight">Admin & Telemetry Operations</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          API health, OpenAQ polling jobs, and system diagnostics.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-card border border-border shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase">OpenAQ API</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold">Connected</div>
          <p className="text-xs text-muted-foreground">Rate limit: 52/60 req/min remaining</p>
        </div>

        <div className="p-6 rounded-2xl bg-card border border-border shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase">Open-Meteo Weather</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold">Operational</div>
          <p className="text-xs text-muted-foreground">Latency: 140ms</p>
        </div>

        <div className="p-6 rounded-2xl bg-card border border-border shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase">Gemini 1.5 Flash</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold">Active</div>
          <p className="text-xs text-muted-foreground">Safety guardrails engaged</p>
        </div>
      </div>
    </div>
  )
}
