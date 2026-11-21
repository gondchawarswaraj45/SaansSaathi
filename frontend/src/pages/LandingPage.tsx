import { Link } from 'react-router-dom'
import {
  Wind,
  ShieldCheck,
  Home,
  Users,
  Compass,
  Sparkles,
  ArrowRight,
  CheckCircle,
} from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-green-50/70 via-background to-background text-foreground">
      {/* Header */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-green-700 to-brand-green-500 flex items-center justify-center text-white shadow-md">
            <Wind className="w-6 h-6" />
          </div>
          <span className="font-bold text-2xl tracking-tight text-brand-green-800 dark:text-brand-green-400">
            Saans<span className="text-brand-sky-500">Saathi</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="px-4 py-2 rounded-lg text-sm font-semibold text-brand-green-700 hover:bg-brand-green-100/60 transition-colors"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 rounded-lg text-sm font-semibold bg-brand-green-600 text-white hover:bg-brand-green-700 shadow-md shadow-brand-green-600/20 transition-all"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-green-100/70 text-brand-green-800 text-xs font-semibold uppercase tracking-wider mb-6 animate-fade-in">
          <Sparkles className="w-4 h-4 text-brand-amber-500" />
          Beat Winter Smog & Everyday Pollution
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight sm:leading-tight">
          Your Family's Intelligent Companion for{' '}
          <span className="bg-gradient-to-r from-brand-green-700 via-brand-green-500 to-brand-sky-500 bg-clip-text text-transparent">
            Cleaner Air & Healthier Living.
          </span>
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
          More than just an AQI monitor. SaansSaathi translates real-time urban pollution data into
          personalized family protection, smart commuting routines, and low-cost indoor air hacks.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/dashboard"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-base font-bold bg-brand-green-600 text-white hover:bg-brand-green-700 shadow-lg shadow-brand-green-600/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
          >
            Open Live Dashboard <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            to="/register"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-base font-semibold border border-border bg-card hover:bg-muted text-foreground transition-all"
          >
            Set Up Family Profile
          </Link>
        </div>

        {/* Feature Highlights Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="p-6 rounded-2xl bg-card border border-border shadow-sm card-hover">
            <div className="w-12 h-12 rounded-xl bg-brand-green-100 text-brand-green-700 flex items-center justify-center mb-4">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold">Personalized Family Profiles</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Different air quality precautions for your 8-year-old school child, working spouse,
              and 70-year-old grandparent.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-card border border-border shadow-sm card-hover">
            <div className="w-12 h-12 rounded-xl bg-brand-sky-100 text-brand-sky-600 flex items-center justify-center mb-4">
              <Home className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold">Affordable Indoor Air Hacks</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Target cooking smoke, incense, and infiltration. Step-by-step Clean Air Room guides and
              EPA-evaluated DIY air cleaners.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-card border border-border shadow-sm card-hover">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold">Smart Daily Planner</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Adjusts outdoor workouts, school commutes, and errands according to diurnal pollution
              peaks and weather inversion conditions.
            </p>
          </div>
        </div>

        {/* Three Pillars Section */}
        <div className="mt-20 py-12 px-6 rounded-3xl bg-brand-green-900 text-white text-center">
          <span className="text-xs uppercase tracking-widest text-brand-green-300 font-bold">
            The Three Pillars of SaansSaathi
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold mt-2 text-white">
            1. Monitor • 2. Protect • 3. Improve
          </h2>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto text-sm text-brand-green-100">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-brand-sky-300 shrink-0" />
              <span>Real-time CPCB & OpenAQ telemetry</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-brand-sky-300 shrink-0" />
              <span>WHO & NCDC evidence-based advice</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-brand-sky-300 shrink-0" />
              <span>Gemini AI conversational guidance</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
