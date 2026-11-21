import { Outlet, Link } from 'react-router-dom'
import Navbar from './Navbar'
import { Wind, Shield, Activity, Heart, ExternalLink } from 'lucide-react'
import { FloatingChatButton } from '@/components/chatbot/FloatingChatButton'

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-200">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Floating AI Air Copilot Button */}
      <FloatingChatButton />

      {/* Persistent Global Footer */}
      <footer className="border-t border-border bg-card/60 backdrop-blur-md mt-16 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-border/60">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-green-700 to-brand-green-500 flex items-center justify-center text-white shadow-xs">
                <Wind className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-sm tracking-tight text-brand-green-800 dark:text-brand-green-400">
                  Saans<span className="text-brand-sky-500">Saathi</span>
                </span>
                <p className="text-[10px] text-muted-foreground">Breathe Better • Live Smarter</p>
              </div>
            </div>

            <div className="flex items-center gap-6 text-xs font-medium text-muted-foreground flex-wrap justify-center">
              <Link to="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
              <Link to="/family" className="hover:text-foreground transition-colors">Family</Link>
              <Link to="/indoor" className="hover:text-foreground transition-colors">Indoor Hacks</Link>
              <Link to="/planner" className="hover:text-foreground transition-colors">Routine</Link>
              <Link to="/map" className="hover:text-foreground transition-colors">Pollution Map</Link>
              <Link to="/challenges" className="hover:text-foreground transition-colors">Challenges</Link>
              <Link to="/about" className="hover:text-foreground transition-colors">About</Link>
              <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
              <Link to="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] text-muted-foreground font-medium">CPCB Telemetry Live</span>
            </div>
          </div>

          {/* Medical Disclaimer Banner */}
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-700 dark:text-amber-300 flex items-start gap-2.5">
            <span className="font-bold uppercase tracking-wider text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-800 dark:text-amber-200 shrink-0">Health Disclaimer</span>
            <p className="leading-relaxed">
              SaansSaathi provides air quality telemetry and behavioral guidance for awareness only. It does not provide medical diagnosis, treatment plans, or pharmaceutical recommendations. Individuals with asthma, COPD, cardiovascular conditions, or pregnancy should consult a qualified physician for personalized care.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-muted-foreground">
            <p>© {new Date().getFullYear()} SaansSaathi. Open Source MIT License. Engineered for Indian Urban Environments.</p>
            <div className="flex items-center gap-4 flex-wrap justify-center">
              <span>Data: <a href="https://cpcb.nic.in" target="_blank" rel="noopener noreferrer" className="hover:underline">CPCB</a> & <a href="https://openaq.org" target="_blank" rel="noopener noreferrer" className="hover:underline">OpenAQ</a></span>
              <span>•</span>
              <span>Weather: <a href="https://open-meteo.com" target="_blank" rel="noopener noreferrer" className="hover:underline">Open-Meteo</a></span>
              <span>•</span>
              <span>Maps: <a href="https://www.openstreetmap.org" target="_blank" rel="noopener noreferrer" className="hover:underline">OpenStreetMap</a></span>
              <span>•</span>
              <span>AI Copilot: Google Gemini</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
