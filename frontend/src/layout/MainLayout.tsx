import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-border py-6 bg-card/60 backdrop-blur-sm mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© 2026 SaansSaathi. Breathe Better. Live Smarter. Built for Indian Urban Families.</p>
          <div className="flex items-center gap-4">
            <span>Data: CPCB & OpenAQ</span>
            <span>•</span>
            <span>Health Guidance: WHO & NCDC</span>
            <span>•</span>
            <span>AI: Gemini</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
