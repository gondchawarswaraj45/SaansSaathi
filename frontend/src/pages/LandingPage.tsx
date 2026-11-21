import React, { useState, useEffect } from 'react'
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
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  MapPin,
  Bot,
  Trophy,
  Flame,
  Sun,
  ShieldAlert,
  HelpCircle,
  ExternalLink,
  HeartPulse,
} from 'lucide-react'

interface CityPreview {
  city: string
  station: string
  aqi: number
  category: string
  color: string
  pm25: number
  pm10: number
  dominant: string
  advisory: string
}

const CITY_PREVIEWS: CityPreview[] = [
  {
    city: 'Delhi',
    station: 'Anand Vihar, Delhi',
    aqi: 342,
    category: 'Very Poor',
    color: '#D90429',
    pm25: 195.4,
    pm10: 312.0,
    dominant: 'PM2.5',
    advisory: 'Severe winter inversion trapped particulate matter. Limit outdoor cardio and seal doors.',
  },
  {
    city: 'Pune',
    station: 'Bavdhan / Pashan, Pune',
    aqi: 145,
    category: 'Moderate',
    color: '#FFB703',
    pm25: 58.2,
    pm10: 112.0,
    dominant: 'PM2.5',
    advisory: 'Sensitive individuals and children should reduce prolonged strenuous outdoor exertion.',
  },
  {
    city: 'Mumbai',
    station: 'Bandra Kurla Complex, Mumbai',
    aqi: 182,
    category: 'Moderate',
    color: '#FFB703',
    pm25: 72.8,
    pm10: 138.4,
    dominant: 'PM10',
    advisory: 'Coastal humidity with road dust. Evening workouts preferred over early morning runs.',
  },
  {
    city: 'Jaipur',
    station: 'Adarsh Nagar, Jaipur',
    aqi: 228,
    category: 'Poor',
    color: '#FB8500',
    pm25: 104.0,
    pm10: 215.2,
    dominant: 'PM2.5',
    advisory: 'Breathing discomfort on prolonged exposure. Wear N95 respirator during commute.',
  },
  {
    city: 'Bengaluru',
    station: 'BTM Layout, Bengaluru',
    aqi: 68,
    category: 'Satisfactory',
    color: '#80B918',
    pm25: 22.0,
    pm10: 55.4,
    dominant: 'PM10',
    advisory: 'Clean air quality. Safe for all outdoor activities, workouts, and natural home ventilation.',
  },
]

export default function LandingPage() {
  const [selectedCityIndex, setSelectedCityIndex] = useState(0)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0)

  const currentPreview = CITY_PREVIEWS[selectedCityIndex]

  const faqs = [
    {
      q: 'Why is winter smog in Indian cities so much more dangerous than summer pollution?',
      a: 'During winter, radiative cooling creates atmospheric temperature inversion: a cold air layer near the ground is trapped under warm air, preventing vertical dispersion. Emissions from vehicles, road dust, and biomass burning accumulate at breathing height, causing severe particulate spikes between 6:00 AM and 10:00 AM.',
    },
    {
      q: 'How does SaansSaathi calculate the Air Quality Index (AQI)?',
      a: 'We strictly follow the official Central Pollution Control Board (CPCB) sub-index piecewise linear interpolation standard across 6 pollutants (PM2.5, PM10, NO2, SO2, CO, and O3). The overall AQI corresponds to the highest sub-index with its dominant pollutant clearly identified.',
    },
    {
      q: 'How does family personalization work?',
      a: 'Different family members have distinct physiological vulnerability thresholds. SaansSaathi tailors risk alerts specifically for school-aged children (higher respiratory rates), senior citizens (cardiopulmonary sensitivity), and individuals with asthma or COPD, rather than generic broad advisories.',
    },
    {
      q: 'Can I really build an effective DIY air cleaner for under ₹1,500?',
      a: 'Yes! Tested extensively by the US EPA and aerosol scientists (Corsi-Rosenthal Box principle), a standard domestic 230V box fan or exhaust tightly sealed to a MERV-13 or true HEPA filter removes over 85–90% of airborne PM2.5 particles at a fraction of the cost of commercial purifiers.',
    },
    {
      q: 'When is the safest time to ventilate the home in winter?',
      a: 'Between 1:00 PM and 3:30 PM. Solar heating breaks the night-time inversion boundary layer, accelerating atmospheric mixing and dropping ground PM2.5 to its daily minimum before evening traffic and cooling set in.',
    },
    {
      q: 'Do surgical or cloth masks protect against severe winter smog?',
      a: 'No. Fine PM2.5 particles measure less than 2.5 microns and easily pass through porous cloth and loose-fitting surgical masks. Only certified, well-fitted N95, N99, or FFP2 respirators effectively filter sub-micron particles.',
    },
    {
      q: 'Does the AI Saathi chatbot give medical prescriptions?',
      a: 'Never. SaansSaathi has hardcoded medical safety guardrails. It provides preventive lifestyle, commuting, and indoor exposure reduction guidance based on CPCB and WHO guidelines. It immediately directs users exhibiting acute respiratory distress to emergency medical care.',
    },
    {
      q: 'Is SaansSaathi free and open source?',
      a: 'Yes! SaansSaathi is completely open-source under the MIT license, utilizing open public data from CPCB, OpenAQ, and Open-Meteo.',
    },
  ]

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-brand-green-500 selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-green-700 to-brand-green-500 flex items-center justify-center text-white shadow-md shadow-brand-green-700/20">
              <Wind className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="font-bold text-xl tracking-tight text-brand-green-800 dark:text-brand-green-400">
                Saans<span className="text-brand-sky-500">Saathi</span>
              </span>
              <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider hidden sm:block">
                Breathe Better • Live Smarter
              </p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-muted-foreground">
            <a href="#preview" className="hover:text-foreground transition-colors">Live AQI</a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#smog-inversion" className="hover:text-foreground transition-colors">Winter Smog</a>
            <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
            <Link to="/about" className="hover:text-foreground transition-colors">About</Link>
          </nav>

          <div className="flex items-center gap-2.5">
            <Link
              to="/login"
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-brand-green-700 dark:text-brand-green-400 hover:bg-brand-green-50 dark:hover:bg-brand-green-950 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-green-600 hover:bg-brand-green-700 text-white shadow-md shadow-brand-green-600/20 transition-all hover:scale-105"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-green-50/50 via-transparent to-transparent dark:from-brand-green-950/20 -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-green-100/80 dark:bg-brand-green-950 text-brand-green-800 dark:text-brand-green-300 text-xs font-bold uppercase tracking-wider shadow-xs animate-in fade-in">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            AI-Powered Urban Air Quality & Family Health Platform
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.15]">
            Breathe Better.{' '}
            <span className="bg-gradient-to-r from-brand-green-700 via-brand-green-500 to-brand-sky-500 bg-clip-text text-transparent">
              Protect Your Family
            </span>{' '}
            from Severe Winter Smog.
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Standard AQI apps only show numbers. <strong>SaansSaathi</strong> translates real-time Indian urban pollution into personalized family protection, diurnal inversion routines, and affordable indoor clean air hacks.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/dashboard"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm bg-brand-green-600 hover:bg-brand-green-700 text-white shadow-lg shadow-brand-green-600/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
            >
              Explore Live Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm border border-border bg-card hover:bg-muted text-foreground transition-all"
            >
              Create Family Profile
            </Link>
          </div>

          {/* Live Preview Widget */}
          <div id="preview" className="pt-12 max-w-3xl mx-auto text-left">
            <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-brand-green-600" />
                  <div>
                    <h3 className="font-bold text-base text-foreground">Live Ambient Air Telemetry</h3>
                    <p className="text-xs text-muted-foreground">Select a city to preview CPCB sub-index calculations</p>
                  </div>
                </div>

                {/* City Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  {CITY_PREVIEWS.map((item, idx) => (
                    <button
                      key={item.city}
                      onClick={() => setSelectedCityIndex(idx)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                        selectedCityIndex === idx
                          ? 'bg-brand-green-600 text-white shadow-xs'
                          : 'bg-muted text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {item.city}
                    </button>
                  ))}
                </div>
              </div>

              {/* Station AQI Display */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 items-center">
                <div className="flex items-center gap-4">
                  <div
                    className="w-20 h-20 rounded-2xl flex flex-col items-center justify-center text-white shadow-lg shrink-0 font-extrabold"
                    style={{ backgroundColor: currentPreview.color }}
                  >
                    <span className="text-2xl leading-none">{currentPreview.aqi}</span>
                    <span className="text-[10px] tracking-wider uppercase mt-1 opacity-90">AQI</span>
                  </div>
                  <div>
                    <span
                      className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider inline-block text-white"
                      style={{ backgroundColor: currentPreview.color }}
                    >
                      {currentPreview.category}
                    </span>
                    <h4 className="font-bold text-sm text-foreground mt-1.5 leading-snug">
                      {currentPreview.station}
                    </h4>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-muted/40 border border-border space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">PM2.5 (Fine Soot):</span>
                    <span className="font-bold text-foreground">{currentPreview.pm25} µg/m³</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">PM10 (Inhalable Dust):</span>
                    <span className="font-bold text-foreground">{currentPreview.pm10} µg/m³</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Dominant Pollutant:</span>
                    <span className="font-bold text-brand-green-600 dark:text-brand-green-400">
                      {currentPreview.dominant}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-1">
                  <span className="font-bold text-amber-900 dark:text-amber-200 block">
                    Immediate Health Action:
                  </span>
                  <p className="text-muted-foreground leading-relaxed text-[11px]">
                    {currentPreview.advisory}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works (The 3 Pillars) */}
      <section id="how-it-works" className="py-20 bg-muted/20 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-green-600 bg-brand-green-50 dark:bg-brand-green-950 px-3 py-1 rounded-full border border-brand-green-200 dark:border-brand-green-900">
              The Three Pillars
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight">How SaansSaathi Protects Your Family</h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Moving beyond passive statistics to active daily prevention.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-card border border-border shadow-sm space-y-4 relative">
              <span className="text-5xl font-black text-brand-green-600/15 absolute top-6 right-6">01</span>
              <div className="w-12 h-12 rounded-2xl bg-brand-green-100 dark:bg-brand-green-950 text-brand-green-700 flex items-center justify-center font-bold">
                <Wind className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground">1. Monitor</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Continuous telemetry from OpenAQ & CPCB monitoring networks. Calculates official Indian National AQI using piecewise sub-index linear interpolation for all 6 key pollutants.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-card border border-border shadow-sm space-y-4 relative">
              <span className="text-5xl font-black text-amber-500/15 absolute top-6 right-6">02</span>
              <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center font-bold">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground">2. Protect</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Tailored health risk calculations based on family member age groups (infants, school children, adults, seniors) and underlying respiratory or cardiovascular health profiles.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-card border border-border shadow-sm space-y-4 relative">
              <span className="text-5xl font-black text-sky-500/15 absolute top-6 right-6">03</span>
              <div className="w-12 h-12 rounded-2xl bg-sky-100 dark:bg-sky-950 text-sky-600 flex items-center justify-center font-bold">
                <Home className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground">3. Improve</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Actionable low-cost indoor interventions: Clean Air Room blueprints, DIY ₹1,500 HEPA purifiers, and community habit challenges to reduce city-wide emissions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-green-600">Feature Matrix</span>
          <h2 className="text-3xl font-extrabold tracking-tight">Everything You Need to Beat Winter Smog</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-card border border-border shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-green-100 dark:bg-brand-green-950 text-brand-green-700 flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base">CPCB Linear Interpolation</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Calculates precise sub-indices according to Central Pollution Control Board guidelines with dominant pollutant identification.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-card border border-border shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base">Family Risk Profiling</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Custom advisories for children, pregnant women, asthmatics, and seniors. Protects against permanent lung capacity reduction.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-card border border-border shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
              <Home className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base">Clean Air Room Blueprint</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Convert an interior bedroom into a safe refuge with negative pressure seals and affordable DIY box-fan filtration.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-card border border-border shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600 flex items-center justify-center">
              <Sun className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base">Diurnal Routine Planner</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Shifts morning outdoor cardio indoors and highlights the 1:00 PM – 3:30 PM optimal solar ventilation window.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-card border border-border shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base">AI Saathi (Gemini Copilot)</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Enriched with live station AQI, family profiles, and residential survey data, backed by strict medical safety boundaries.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-card border border-border shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center">
              <Trophy className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base">Community Challenges</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              10 structured low-emission challenges: No-Idling, Damp Mopping, and Smoke-Free Sanctuary to unlock badges and earn points.
            </p>
          </div>
        </div>
      </section>

      {/* Atmospheric Inversion Explanation */}
      <section id="smog-inversion" className="py-20 bg-gradient-to-r from-slate-900 to-brand-green-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Scientific Context</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Why 6:00 AM Jogging During Winter Smog Causes Severe Lung Damage
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              In summer, solar radiation heats the ground, causing air to rise and disperse pollutants. In Indian winter, rapid overnight radiational cooling creates a cold ground layer trapped beneath a warmer ceiling.
            </p>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              This atmospheric inversion traps exhaust fumes, construction dust, and burning biomass within the bottom 100 meters. Exercising during this window forces 40–60 liters of toxic air per minute deep into bronchioles.
            </p>
            <div className="pt-2">
              <Link
                to="/planner"
                className="inline-flex items-center gap-2 text-xs font-bold text-brand-green-300 hover:text-white underline"
              >
                Learn how SaansSaathi re-schedules routines <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="font-bold text-sm text-amber-300">Daily Diurnal Smog Cycle</span>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Indian Urban Winter</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex justify-between items-center">
                <div>
                  <span className="font-bold text-rose-300 block">6:00 AM – 10:00 AM (Peak Hazard)</span>
                  <span className="text-[11px] text-slate-300">Surface inversion cap active. Zero outdoor cardio.</span>
                </div>
                <span className="font-extrabold text-rose-400">AQI 350+</span>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex justify-between items-center">
                <div>
                  <span className="font-bold text-emerald-300 block">1:00 PM – 3:30 PM (Golden Window)</span>
                  <span className="text-[11px] text-slate-300">Solar mixing breaks inversion. Open home windows.</span>
                </div>
                <span className="font-extrabold text-emerald-400">Optimal Air</span>
              </div>

              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex justify-between items-center">
                <div>
                  <span className="font-bold text-amber-300 block">6:00 PM – 11:00 PM (Night Re-inversion)</span>
                  <span className="text-[11px] text-slate-300">Traffic emissions accumulate as temperatures drop.</span>
                </div>
                <span className="font-extrabold text-amber-400">AQI 280+</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section id="faq" className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-green-600">Got Questions?</span>
          <h2 className="text-3xl font-extrabold tracking-tight">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-border bg-card overflow-hidden transition-colors"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full p-5 text-left font-bold text-sm text-foreground flex items-center justify-between gap-4"
              >
                <span>{faq.q}</span>
                {openFaqIndex === idx ? (
                  <ChevronUp className="w-4 h-4 text-brand-green-600 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                )}
              </button>
              {openFaqIndex === idx && (
                <div className="px-5 pb-5 pt-1 text-xs text-muted-foreground leading-relaxed border-t border-border/50">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-16 bg-brand-green-600 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Start Protecting Your Family's Health Today
          </h2>
          <p className="text-sm sm:text-base text-brand-green-100 max-w-xl mx-auto">
            Free forever for Indian families. Real-time telemetry, personalized schedules, and affordable clean air hacks.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm bg-white text-brand-green-800 hover:bg-brand-green-50 shadow-lg transition-all"
            >
              Get Started Now (No Card Required)
            </Link>
            <Link
              to="/dashboard"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm border border-white/30 text-white hover:bg-white/10 transition-all"
            >
              View Public Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12 text-xs text-muted-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="space-y-3 col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-brand-green-600 flex items-center justify-center text-white">
                <Wind className="w-4 h-4" />
              </div>
              <span className="font-bold text-base text-foreground">SaansSaathi</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              AI-Powered Urban Air Quality & Family Health Protection Platform.
            </p>
            <p className="text-[10px] text-muted-foreground">
              © {new Date().getFullYear()} SaansSaathi. MIT Open Source.
            </p>
          </div>

          <div className="space-y-2">
            <span className="font-bold text-foreground block">Modules</span>
            <ul className="space-y-1.5 text-[11px]">
              <li><Link to="/dashboard" className="hover:text-foreground">Air Quality Dashboard</Link></li>
              <li><Link to="/family" className="hover:text-foreground">Family Protection</Link></li>
              <li><Link to="/indoor" className="hover:text-foreground">Indoor Air Hacks</Link></li>
              <li><Link to="/planner" className="hover:text-foreground">Routine Planner</Link></li>
              <li><Link to="/map" className="hover:text-foreground">Pollution Map</Link></li>
            </ul>
          </div>

          <div className="space-y-2">
            <span className="font-bold text-foreground block">Resources</span>
            <ul className="space-y-1.5 text-[11px]">
              <li><Link to="/chat" className="hover:text-foreground">AI Saathi Copilot</Link></li>
              <li><Link to="/challenges" className="hover:text-foreground">Clean Air Challenges</Link></li>
              <li><Link to="/notifications" className="hover:text-foreground">Alerts & Notifications</Link></li>
              <li><Link to="/about" className="hover:text-foreground">About the Project</Link></li>
            </ul>
          </div>

          <div className="space-y-2">
            <span className="font-bold text-foreground block">Legal & Data</span>
            <ul className="space-y-1.5 text-[11px]">
              <li><Link to="/privacy" className="hover:text-foreground">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-foreground">Terms of Service</Link></li>
              <li>
                <a
                  href="https://github.com/gondchawarswaraj45/SaansSaathi"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 hover:text-foreground"
                >
                  GitHub Source <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <span className="text-[10px] text-muted-foreground/80 block mt-1">
                  CPCB / OpenAQ / Open-Meteo Data
                </span>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  )
}
