import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Wind,
  LayoutDashboard,
  Users,
  Home,
  Calendar,
  MapPin,
  Bot,
  Trophy,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import NotificationBell from '@/components/common/NotificationBell'

export default function Navbar() {
  const location = useLocation()
  const { user, logout } = useAuthStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Family Protection', path: '/family', icon: Users },
    { label: 'Indoor Hacks', path: '/indoor', icon: Home },
    { label: 'Routine Planner', path: '/planner', icon: Calendar },
    { label: 'Pollution Map', path: '/map', icon: MapPin },
    { label: 'AI Saathi', path: '/chat', icon: Bot },
    { label: 'Challenges', path: '/challenges', icon: Trophy },
  ]

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-border transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-green-700 to-brand-green-500 flex items-center justify-center text-white shadow-md shadow-brand-green-700/20 group-hover:scale-105 transition-transform">
              <Wind className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="font-bold text-xl tracking-tight text-brand-green-800 dark:text-brand-green-400">
                Saans<span className="text-brand-sky-500">Saathi</span>
              </span>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider hidden sm:block">
                Breathe Better • Live Smarter
              </p>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-brand-green-50 text-brand-green-700 dark:bg-brand-green-950/50 dark:text-brand-green-300 font-semibold shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-brand-green-600' : ''}`} />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* User Controls & Notifications */}
          <div className="flex items-center gap-2.5">
            <NotificationBell />

            <Link
              to="/settings"
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </Link>

            {/* Profile Avatar / Logout */}
            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-border">
              <div className="w-8 h-8 rounded-full bg-brand-green-100 dark:bg-brand-green-900 text-brand-green-800 dark:text-brand-green-200 flex items-center justify-center font-bold text-xs">
                {user?.fullName?.charAt(0) || 'U'}
              </div>
              <button
                onClick={logout}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-muted-foreground hover:bg-muted"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-border bg-card px-4 pt-2 pb-4 space-y-1 animate-slide-in-bottom">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-green-50 text-brand-green-700 dark:bg-brand-green-950 font-semibold'
                    : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            )
          })}
          <div className="pt-3 border-t border-border flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium">
              Signed in as <strong className="text-foreground">{user?.fullName}</strong>
            </span>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 text-xs text-destructive font-medium px-2.5 py-1.5 rounded hover:bg-destructive/10"
            >
              <LogOut className="w-3.5 h-3.5" /> Log out
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
