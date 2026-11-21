import React, { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ThemeToggle from '@/components/common/ThemeToggle'
import WindAnimation from '@/components/common/WindAnimation'
import { axiosClient } from '@/api/axiosClient'
import { useAuthStore } from '@/store/authStore'
import {
  Wind,
  Shield,
  ShieldAlert,
  Users,
  Home,
  Calendar,
  MapPin,
  Bot,
  Bell,
  Lock,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Info,
  Sun,
  Activity,
  Layers,
  Thermometer,
  Droplets,
  X,
  Navigation,
  Crosshair,
  ExternalLink,
  LogOut,
  LayoutDashboard,
} from 'lucide-react'

interface CityData {
  city: string
  stationName: string
  aqi: number
  category: string
  color: string
  dominantPollutant: string
  pm25: number
  pm10: number
  temp: number
  humidity: number
  lat: number
  lng: number
  advisory: string
}

const DEFAULT_CITIES: CityData[] = [
  {
    city: 'Delhi NCR',
    stationName: 'Anand Vihar, Delhi',
    aqi: 342,
    category: 'Very Poor',
    color: '#D90429',
    dominantPollutant: 'PM2.5',
    pm25: 195.4,
    pm10: 312.0,
    temp: 18.5,
    humidity: 68,
    lat: 28.6469,
    lng: 77.3164,
    advisory: 'Dense inversion layer trapping combustion exhaust. Restrict morning outdoor exertion; run indoor filtration.',
  },
  {
    city: 'Pune',
    stationName: 'Bavdhan / Pashan, Pune',
    aqi: 145,
    category: 'Moderate',
    color: '#FFB703',
    dominantPollutant: 'PM2.5',
    pm25: 58.2,
    pm10: 112.0,
    temp: 24.0,
    humidity: 48,
    lat: 18.535,
    lng: 73.792,
    advisory: 'Breathing discomfort to sensitive groups (asthmatics, seniors). Safe for normal indoor routines.',
  },
  {
    city: 'Mumbai',
    stationName: 'Bandra Kurla Complex, Mumbai',
    aqi: 182,
    category: 'Moderate',
    color: '#FFB703',
    dominantPollutant: 'PM10',
    pm25: 72.8,
    pm10: 138.4,
    temp: 28.2,
    humidity: 72,
    lat: 19.0688,
    lng: 72.8703,
    advisory: 'High coastal moisture paired with road dust. Evening workouts preferred over early morning runs.',
  },
  {
    city: 'Jaipur',
    stationName: 'Adarsh Nagar, Jaipur',
    aqi: 228,
    category: 'Poor',
    color: '#FB8500',
    dominantPollutant: 'PM2.5',
    pm25: 104.0,
    pm10: 215.2,
    temp: 20.1,
    humidity: 52,
    lat: 26.9015,
    lng: 75.8267,
    advisory: 'Prolonged outdoor exposure may cause coughing and airway irritation. Wear certified N95 for commutes.',
  },
  {
    city: 'Bengaluru',
    stationName: 'BTM Layout, Bengaluru',
    aqi: 68,
    category: 'Satisfactory',
    color: '#80B918',
    dominantPollutant: 'PM10',
    pm25: 22.0,
    pm10: 55.4,
    temp: 23.5,
    humidity: 61,
    lat: 12.9166,
    lng: 77.6101,
    advisory: 'Satisfactory ambient air. Safe for outdoor exercise, school sports, and open-window cross ventilation.',
  },
  {
    city: 'Kolkata',
    stationName: 'Victoria Memorial, Kolkata',
    aqi: 265,
    category: 'Poor',
    color: '#FB8500',
    dominantPollutant: 'PM2.5',
    pm25: 118.5,
    pm10: 230.0,
    temp: 22.8,
    humidity: 65,
    lat: 22.5448,
    lng: 88.3426,
    advisory: 'Winter river mist traps urban particulates. Asthmatic individuals should keep inhalers immediately accessible.',
  },
  {
    city: 'Lucknow',
    stationName: 'Lalbagh, Lucknow',
    aqi: 310,
    category: 'Very Poor',
    color: '#D90429',
    dominantPollutant: 'PM2.5',
    pm25: 172.0,
    pm10: 290.0,
    temp: 17.6,
    humidity: 70,
    lat: 26.8500,
    lng: 80.9333,
    advisory: 'Severe particulate concentration. Keep residential doors and windows sealed until early afternoon.',
  },
]

export default function LandingPage() {
  const navigate = useNavigate()
  const { isAuthenticated, user, logout } = useAuthStore()

  const [selectedCity, setSelectedCity] = useState<CityData>(DEFAULT_CITIES[0])
  const [loadingCity, setLoadingCity] = useState(false)
  const [lockedModalFeature, setLockedModalFeature] = useState<string | null>(null)
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  // Location detection states
  const [locationStatus, setLocationStatus] = useState<
    'PROMPT' | 'LOCATING' | 'GRANTED' | 'DENIED' | 'UNSUPPORTED'
  >('PROMPT')
  const [detectedCoords, setDetectedCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [showLocationBanner, setShowLocationBanner] = useState(true)

  // Find closest city from coordinates
  const findNearestCity = useCallback((lat: number, lng: number): CityData => {
    let nearest = DEFAULT_CITIES[0]
    let minD = Infinity
    for (const c of DEFAULT_CITIES) {
      const d = Math.hypot(c.lat - lat, c.lng - lng)
      if (d < minD) {
        minD = d
        nearest = c
      }
    }
    return nearest
  }, [])

  // Geolocation request handler
  const requestLocation = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setLocationStatus('UNSUPPORTED')
      return
    }

    setLocationStatus('LOCATING')
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        setDetectedCoords({ lat: latitude, lng: longitude })
        setLocationStatus('GRANTED')

        const nearest = findNearestCity(latitude, longitude)
        setSelectedCity((prev) => ({
          ...nearest,
          stationName: `Local Station (Near ${nearest.city})`,
        }))

        // Call backend with exact coordinates for hyper-local reading
        setLoadingCity(true)
        try {
          const res = await axiosClient.get('/air-quality/current', {
            params: { lat: latitude, lng: longitude, city: nearest.city },
          })
          if (res.data?.success && res.data?.data) {
            const d = res.data.data
            setSelectedCity((prev) => ({
              ...prev,
              aqi: d.aqi ?? prev.aqi,
              category: d.category ? d.category.replace('_', ' ') : prev.category,
              dominantPollutant: d.dominantPollutant ?? prev.dominantPollutant,
              stationName: d.stationName ?? prev.stationName,
              temp: d.weather?.temperature ?? prev.temp,
              humidity: d.weather?.humidity ?? prev.humidity,
            }))
          }
        } catch {
          // Keep baseline
        } finally {
          setLoadingCity(false)
        }
      },
      (error) => {
        console.warn('Geolocation access denied or timed out:', error.message)
        setLocationStatus('DENIED')
      },
      { timeout: 10000, maximumAge: 300000, enableHighAccuracy: true }
    )
  }, [findNearestCity])

  // Fetch real-time live telemetry when city changes manually
  useEffect(() => {
    let isMounted = true
    async function fetchLiveCity() {
      setLoadingCity(true)
      try {
        const response = await axiosClient.get(`/air-quality/current`, {
          params: { city: selectedCity.city },
        })
        if (response.data?.success && response.data?.data && isMounted) {
          const d = response.data.data
          setSelectedCity((prev) => ({
            ...prev,
            aqi: d.aqi ?? prev.aqi,
            category: d.category ? d.category.replace('_', ' ') : prev.category,
            dominantPollutant: d.dominantPollutant ?? prev.dominantPollutant,
            stationName: d.stationName ?? prev.stationName,
            temp: d.weather?.temperature ?? prev.temp,
            humidity: d.weather?.humidity ?? prev.humidity,
          }))
        }
      } catch {
        // Gracefully keep preset data
      } finally {
        if (isMounted) setLoadingCity(false)
      }
    }

    if (locationStatus !== 'GRANTED') {
      fetchLiveCity()
    }
    return () => {
      isMounted = false
    }
  }, [selectedCity.city, locationStatus])

  const faqs = [
    {
      q: 'Why is winter smog in Indian cities significantly more dangerous than summer pollution?',
      a: 'During winter, nocturnal radiative cooling creates atmospheric temperature inversion: a cold, dense air layer near the ground is trapped under warm air aloft. This forms an atmospheric lid under 150 meters that prevents vertical dispersion. Emissions from vehicles, dust, and biomass accumulate directly at breathing height, peaking between 6:00 AM and 10:00 AM.',
    },
    {
      q: 'How does SaansSaathi calculate the Air Quality Index (AQI)?',
      a: 'We strictly follow the official Central Pollution Control Board (CPCB) National Air Quality Index (NAQI) formula using piecewise sub-index linear interpolation across 8 criteria pollutants (PM2.5, PM10, NO2, SO2, CO, O3, NH3, and Pb). The final reported AQI represents the highest individual sub-index.',
    },
    {
      q: 'How does family vulnerability profiling work when I log in?',
      a: 'Children breathe 50% more air per kilogram of body weight than adults, while seniors and asthmatics suffer acute cardiovascular and airway constriction. When you log in and register family members, SaansSaathi calculates customized risk thresholds and medication reminders instead of one-size-fits-all generic warnings.',
    },
    {
      q: 'Can I really build an effective DIY air purifier for under ₹1,500?',
      a: 'Yes. Based on the proven Corsi-Rosenthal scientific principle validated by the US EPA, a standard 230V domestic box fan or exhaust tightly taped to a genuine MERV-13 or HEPA filter removes over 85–90% of airborne PM2.5 particulates in a 150 sq.ft room within 45 minutes.',
    },
    {
      q: 'When is the safest time to ventilate the home in winter?',
      a: 'Between 1:00 PM and 3:30 PM. Solar heating breaks the night-time surface inversion boundary layer, accelerating atmospheric mixing and lowering ground PM2.5 concentrations to their daily minimum before evening cooling sets in.',
    },
    {
      q: 'Do surgical or cloth masks protect against severe winter smog?',
      a: 'No. Fine PM2.5 particulates measure less than 2.5 microns—roughly 30 times smaller than a strand of human hair. They easily bypass porous cloth and loose-fitting surgical masks. Only certified, securely fitted N95, N99, or FFP2 respirators provide adequate filtration.',
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans antialiased selection:bg-emerald-600 selection:text-white relative">
      {/* Clean Navbar */}
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-xs">
              <Wind className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">
                Saans<span className="text-emerald-600 dark:text-emerald-400">Saathi</span>
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 hidden sm:inline ml-2 border-l border-slate-300 dark:border-slate-700 pl-2">
                Urban Air Quality & Family Health
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-600 dark:text-slate-300">
            <a href="#live-aqi" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              Check AQI
            </a>
            <a href="#inversion-science" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              How Smog Works
            </a>
            <a href="#clean-air-refuge" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              Indoor Refuge Guide
            </a>
            <a href="#member-features" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              Personalized Protection
            </a>
            <a href="#faq" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-2.5">
            <ThemeToggle />
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/dashboard"
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs flex items-center gap-1.5 transition-colors"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" /> Go to Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
                >
                  Get Free Access
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section with Soothing Air Wind Animation */}
      <section className="relative overflow-hidden pt-12 pb-14 sm:pt-18 sm:pb-22 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        {/* Air Wind Streamlines Animation Background */}
        <WindAnimation className="opacity-60 dark:opacity-40" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-medium backdrop-blur-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Official CPCB Standard • Real-Time Winter Smog Intelligence
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-3xl mx-auto leading-tight">
            Clear air intelligence for your family, without the panic.
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Most air quality apps just show an alarming red number. <strong>SaansSaathi</strong> translates complex atmospheric pollution into practical, scientific guidance: when it is safe to open windows, how morning inversion traps smog, and how to protect children and elderly family members.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <a
              href="#live-aqi"
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs flex items-center justify-center gap-2 transition-colors"
            >
              Check City Air Quality Below <ArrowRight className="w-3.5 h-3.5" />
            </a>
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="w-full sm:w-auto px-6 py-2.5 rounded-lg text-xs font-semibold border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
              >
                Open Family Dashboard
              </Link>
            ) : (
              <Link
                to="/login"
                className="w-full sm:w-auto px-6 py-2.5 rounded-lg text-xs font-semibold border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
              >
                Sign In for Personalized Family Routines
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* LOCATION ACCESS PROMPT BANNER */}
      {showLocationBanner && (
        <div className="bg-emerald-50 dark:bg-emerald-950/40 border-b border-emerald-200 dark:border-emerald-800/60 px-4 py-3">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 text-emerald-900 dark:text-emerald-200">
              <Navigation className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>Hyper-Local Air Quality:</strong> Enable device location access to detect your exact neighborhood monitoring station and get hyper-local CPCB readings.
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {locationStatus === 'GRANTED' ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-600 text-white font-semibold text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Location Enabled
                </span>
              ) : (
                <button
                  type="button"
                  onClick={requestLocation}
                  disabled={locationStatus === 'LOCATING'}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Crosshair className={`w-3.5 h-3.5 ${locationStatus === 'LOCATING' ? 'animate-spin' : ''}`} />
                  {locationStatus === 'LOCATING' ? 'Detecting Location…' : 'Enable My Location'}
                </button>
              )}

              <button
                type="button"
                onClick={() => setShowLocationBanner(false)}
                className="p-1 rounded-md text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/40"
                title="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PART 1: LIMITED BASIC APPLICATION ACCESS (Unauthenticated Live AQI Checker) */}
      <section id="live-aqi" className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-1">
              <Activity className="w-4 h-4" />
              Public Telemetry Access
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Live Air Quality Checker for Indian Cities
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Instant ambient telemetry calculated with CPCB sub-index linear interpolation formula.
            </p>
          </div>

          {/* Location status badge & City Selection Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 max-w-full">
            {/* Quick Location Trigger Button */}
            <button
              onClick={requestLocation}
              disabled={locationStatus === 'LOCATING'}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                locationStatus === 'GRANTED'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
              title="Use current GPS location"
            >
              <Navigation className={`w-3.5 h-3.5 text-emerald-600 ${locationStatus === 'LOCATING' ? 'animate-spin' : ''}`} />
              {locationStatus === 'GRANTED' ? 'Using GPS' : 'Current GPS'}
            </button>

            {DEFAULT_CITIES.map((c) => (
              <button
                key={c.city}
                onClick={() => {
                  setLocationStatus('PROMPT')
                  setSelectedCity(c)
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                  selectedCity.city === c.city && locationStatus !== 'GRANTED'
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {c.city}
              </button>
            ))}
          </div>
        </div>

        {/* Live Telemetry Display Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Primary Gauge */}
            <div className="lg:col-span-4 flex items-center gap-5">
              <div
                className="w-24 h-24 rounded-2xl flex flex-col items-center justify-center text-white shrink-0 font-mono shadow-xs"
                style={{ backgroundColor: selectedCity.color }}
              >
                <span className="text-3xl font-extrabold leading-none">{selectedCity.aqi}</span>
                <span className="text-[10px] tracking-wider uppercase mt-1 font-sans opacity-90">CPCB AQI</span>
              </div>
              <div className="space-y-1">
                <span
                  className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider text-white inline-block"
                  style={{ backgroundColor: selectedCity.color }}
                >
                  {selectedCity.category}
                </span>
                <h3 className="font-bold text-base text-slate-900 dark:text-white leading-snug">
                  {selectedCity.city}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  {selectedCity.stationName}
                </p>
                {loadingCity && (
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 animate-pulse">
                    Syncing live station telemetry...
                  </span>
                )}
              </div>
            </div>

            {/* Pollutants & Weather Sub-Indices */}
            <div className="lg:col-span-4 grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-0.5">
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">PM2.5 (Fine Soot)</span>
                <div className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                  {selectedCity.pm25} <span className="text-[10px] font-normal text-slate-500">µg/m³</span>
                </div>
                <span className="text-[10px] text-slate-400">Safe Limit: 60 µg/m³</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-0.5">
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">PM10 (Coarse Dust)</span>
                <div className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                  {selectedCity.pm10} <span className="text-[10px] font-normal text-slate-500">µg/m³</span>
                </div>
                <span className="text-[10px] text-slate-400">Safe Limit: 100 µg/m³</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-0.5">
                <span className="text-slate-500 dark:text-slate-400 text-[11px] flex items-center gap-1">
                  <Thermometer className="w-3 h-3" /> Temperature
                </span>
                <div className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                  {selectedCity.temp} °C
                </div>
                <span className="text-[10px] text-slate-400">Surface Air</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-0.5">
                <span className="text-slate-500 dark:text-slate-400 text-[11px] flex items-center gap-1">
                  <Droplets className="w-3 h-3" /> Humidity
                </span>
                <div className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                  {selectedCity.humidity} %
                </div>
                <span className="text-[10px] text-slate-400">Fog condensation</span>
              </div>
            </div>

            {/* General Health Action */}
            <div className="lg:col-span-4 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-200">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                General Public Guidance
              </div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-[11px]">
                {selectedCity.advisory}
              </p>
              <div className="pt-1 border-t border-amber-200/60 dark:border-amber-900/40 flex items-center justify-between text-[10px] text-amber-800 dark:text-amber-300">
                <span>Dominant: <strong>{selectedCity.dominantPollutant}</strong></span>
                <span>Sub-index: <strong>{selectedCity.aqi}</strong></span>
              </div>
            </div>
          </div>

          {/* Limited Access Notice Bar */}
          <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <Info className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>Limited public preview.</strong> Sign in to view granular station maps, historical 24-hr curves, and member-specific sensitivity thresholds.
              </span>
            </div>
            <Link
              to="/login"
              className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline shrink-0 flex items-center gap-1"
            >
              Sign In for Full Telemetry <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* PART 2: SCIENTIFIC EXPLANATION WITH CLEAN DIAGRAMS */}
      <section id="inversion-science" className="py-14 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Scientific Principles
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Why Winter Smog Peaks in the Morning: Atmospheric Inversion
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              In summer, the sun heats the ground, causing warm air to rise and carry pollutants high into the atmosphere. In North Indian winters, overnight ground cooling creates a stable cold air layer trapped beneath a warmer ceiling.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Clean SVG Diagram: Temperature Inversion */}
            <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 pb-2 border-b border-slate-200 dark:border-slate-800">
                <span>Atmospheric Cross-Section (Winter Night vs Noon)</span>
                <span className="text-[10px] text-slate-400">Planetary Boundary Layer</span>
              </div>

              {/* Vector Illustration */}
              <svg viewBox="0 0 600 240" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
                {/* Background Sky */}
                <rect x="0" y="0" width="600" height="240" fill="#0f172a" rx="12" />

                {/* Warm Inversion Lid */}
                <rect x="20" y="30" width="560" height="40" fill="#f59e0b" fillOpacity="0.25" rx="6" />
                <text x="300" y="55" fill="#fef3c7" fontSize="11" textAnchor="middle" fontWeight="bold">
                  Warm Air Ceiling (Inversion Lid at ~150 meters)
                </text>

                {/* Trapped Cold Air with High Smog Concentration */}
                <rect x="20" y="75" width="270" height="110" fill="#ef4444" fillOpacity="0.2" rx="6" />
                <text x="155" y="100" fill="#fca5a5" fontSize="11" textAnchor="middle" fontWeight="bold">
                  6:00 AM – 10:00 AM Hazard Peak
                </text>
                <text x="155" y="120" fill="#cbd5e1" fontSize="9" textAnchor="middle">
                  Vehicular soot + biomass smoke trapped
                </text>
                <text x="155" y="140" fill="#ef4444" fontSize="14" textAnchor="middle" fontWeight="extrabold">
                  AQI 350 – 500+ (Severe)
                </text>
                <text x="155" y="165" fill="#f87171" fontSize="9" textAnchor="middle">
                  ⚠️ Cancel outdoor running & school sports
                </text>

                {/* Solar Convection Breaking Inversion at Noon */}
                <rect x="310" y="75" width="270" height="110" fill="#10b981" fillOpacity="0.2" rx="6" />
                <text x="445" y="100" fill="#6ee7b7" fontSize="11" textAnchor="middle" fontWeight="bold">
                  1:00 PM – 3:30 PM Golden Window
                </text>
                <text x="445" y="120" fill="#cbd5e1" fontSize="9" textAnchor="middle">
                  Sun breaks inversion cap, vertical mixing begins
                </text>
                <text x="445" y="140" fill="#10b981" fontSize="14" textAnchor="middle" fontWeight="extrabold">
                  Lowest Daily PM2.5 Density
                </text>
                <text x="445" y="165" fill="#34d399" fontSize="9" textAnchor="middle">
                  🌿 Safest time for home airing & errands
                </text>

                {/* Ground Line */}
                <line x1="20" y1="195" x2="580" y2="195" stroke="#64748b" strokeWidth="2" strokeDasharray="4" />
                <text x="300" y="215" fill="#94a3b8" fontSize="10" textAnchor="middle">
                  Ground Level (Breathing Zone: 0 to 2 meters)
                </text>
              </svg>

              <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center">
                Exercising at 6:00 AM forces 50+ liters of concentrated particulates into your alveoli per minute. Moving activities to midday reduces particle deposition by up to 60%.
              </p>
            </div>

            {/* Diurnal Timing Table */}
            <div className="lg:col-span-5 space-y-3 text-xs">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Daily Smog Schedule Summary
              </h3>

              <div className="p-3.5 rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50/50 dark:bg-rose-950/20 space-y-1">
                <div className="flex items-center justify-between font-bold text-rose-800 dark:text-rose-300">
                  <span>06:00 AM – 10:00 AM</span>
                  <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-rose-200 dark:bg-rose-900/60">Severe Risk</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                  Surface inversion is most acute. Keep windows tightly shut. Shift outdoor morning walks indoors.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/50 dark:bg-emerald-950/20 space-y-1">
                <div className="flex items-center justify-between font-bold text-emerald-800 dark:text-emerald-300">
                  <span>01:00 PM – 03:30 PM</span>
                  <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-emerald-200 dark:bg-emerald-900/60">Ventilation Window</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                  Solar heating lifts the inversion lid. Safest time to open windows for 20–30 minutes to reduce indoor carbon dioxide.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/50 dark:bg-amber-950/20 space-y-1">
                <div className="flex items-center justify-between font-bold text-amber-800 dark:text-amber-300">
                  <span>06:00 PM – 10:00 PM</span>
                  <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-amber-200 dark:bg-amber-900/60">Night Inversion</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                  Evening traffic emissions combine with rapid night cooling. Seal draft stoppers under main doors.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PART 3: INDOOR AIR & DIY PURIFIER (Clean Air Refuge Blueprint) */}
      <section id="clean-air-refuge" className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="max-w-3xl space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            Practical Household Protection
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            The EPA Clean Air Room & ₹1,500 DIY Purifier Blueprint
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            During peak winter smog, indoor PM2.5 can be 3x worse than outdoor levels due to unventilated cooking, incense, and door seepage. Here is how to create a clean refuge inside your home without buying an expensive purifier.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Clean Vector Diagram: Clean Air Room Blueprint */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Home className="w-4 h-4 text-emerald-600" />
              Room Sealing & Airflow Schematic
            </h3>

            <svg viewBox="0 0 500 260" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
              {/* Room Frame */}
              <rect x="20" y="20" width="460" height="220" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2" rx="8" />

              {/* Window with Tape */}
              <rect x="40" y="50" width="60" height="80" fill="#e2e8f0" stroke="#64748b" strokeWidth="1.5" />
              <line x1="40" y1="90" x2="100" y2="90" stroke="#64748b" strokeWidth="1" />
              <line x1="70" y1="50" x2="70" y2="130" stroke="#64748b" strokeWidth="1" />
              <rect x="36" y="46" width="68" height="88" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="3" />
              <text x="70" y="150" fontSize="9" fill="#dc2626" textAnchor="middle" fontWeight="bold">
                Window Sealing Tape
              </text>

              {/* Door with Draft Stopper */}
              <rect x="420" y="70" width="40" height="150" fill="#cbd5e1" stroke="#475569" strokeWidth="1.5" />
              <rect x="415" y="212" width="50" height="10" fill="#f59e0b" rx="2" />
              <text x="380" y="222" fontSize="9" fill="#d97706" textAnchor="end" fontWeight="bold">
                Door Draft Stopper
              </text>

              {/* Box Fan HEPA Purifier in Center */}
              <rect x="210" y="110" width="80" height="80" fill="#0284c7" fillOpacity="0.2" stroke="#0284c7" strokeWidth="2" rx="6" />
              <circle cx="250" cy="150" r="28" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1.5" />
              <path d="M250,150 L240,130 M250,150 L260,170 M250,150 L230,160 M250,150 L270,140" stroke="#0284c7" strokeWidth="3" strokeLinecap="round" />
              <rect x="200" y="120" width="10" height="60" fill="#10b981" rx="2" />
              <text x="250" y="85" fontSize="10" fill="#0369a1" textAnchor="middle" fontWeight="bold">
                DIY Box Fan + MERV-13 Filter
              </text>
              <text x="250" y="205" fontSize="8" fill="#64748b" textAnchor="middle">
                CADR: 120-150 CFM (~88% PM2.5 capture)
              </text>

              {/* Clean Air Arrows */}
              <path d="M 280 135 C 320 125, 340 100, 360 100" fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="3" />
              <path d="M 280 165 C 320 175, 340 190, 360 180" fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="3" />
            </svg>

            <div className="grid grid-cols-3 gap-2 text-center text-[10px] text-slate-500 pt-2 border-t border-slate-200 dark:border-slate-800">
              <div>1. Seal Windows</div>
              <div>2. Block Door Draft</div>
              <div>3. Continuous Filtration</div>
            </div>
          </div>

          {/* 4 Steps to Build DIY Purifier */}
          <div className="space-y-4 text-xs">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              The 4-Step DIY Air Cleaner Checklist
            </h3>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-xs shrink-0">
                  1
                </div>
                <div>
                  <strong className="text-slate-900 dark:text-white block">Procure 230V Box Fan & MERV-13 Filter</strong>
                  <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                    A standard 12-inch or 16-inch domestic box fan (approx. ₹800–₹1,000) and an HVAC MERV-13 or HEPA replacement filter (approx. ₹500–₹700).
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-xs shrink-0">
                  2
                </div>
                <div>
                  <strong className="text-slate-900 dark:text-white block">Orient Filter Airflow Direction</strong>
                  <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                    Mount filter onto the back of the fan. Ensure the printed airflow arrow points toward the fan blades (pulling room air through the filter).
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-xs shrink-0">
                  3
                </div>
                <div>
                  <strong className="text-slate-900 dark:text-white block">Tightly Tape All Four Edges</strong>
                  <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                    Use duct tape or packaging tape to seal all 4 perimeters. Air will always follow the path of least resistance—zero edge bypass is required.
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-xs shrink-0">
                  4
                </div>
                <div>
                  <strong className="text-slate-900 dark:text-white block">Run in Sealed Bedroom</strong>
                  <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                    Place in center of room away from curtains. Run at medium speed for 40 minutes before bedtime to drop indoor particulate counts by 80%.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PART 4: ASK USER TO LOGIN FOR ADVANCED & PERSONALIZED FEATURES */}
      <section id="member-features" className="py-14 bg-slate-100/70 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Personalized Protection
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Sign In to Access Your Household Protection Tools
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Air quality affects an infant, a healthy runner, and an elderly asthma patient completely differently. Create a free account or sign in to unlock your tailored protection suite.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Locked Card 1: Family Vulnerability Matrix */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 relative flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    <Lock className="w-3 h-3 text-amber-500" /> Member Feature
                  </span>
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Family Health Matrix
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Profile individual members (infants, asthmatics, elderly parents). Get customized exposure limits and bronchodilator accessibility notices.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => {
                    if (isAuthenticated) navigate('/family')
                    else setLockedModalFeature('Family Health Matrix')
                  }}
                  className="w-full py-2 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" /> {isAuthenticated ? 'Open Family Matrix' : 'Sign In to Profile Family'}
                </button>
              </div>
            </div>

            {/* Locked Card 2: Diurnal Routine Planner */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 relative flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    <Lock className="w-3 h-3 text-amber-500" /> Member Feature
                  </span>
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Diurnal Routine Planner
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Generate hour-by-hour schedules that automatically shift morning jogging and school commutes away from 6–10 AM inversion peaks.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => {
                    if (isAuthenticated) navigate('/planner')
                    else setLockedModalFeature('Diurnal Routine Planner')
                  }}
                  className="w-full py-2 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" /> {isAuthenticated ? 'Open Routine Planner' : 'Sign In to Plan Routines'}
                </button>
              </div>
            </div>

            {/* Locked Card 3: Home Air Assessment Wizard */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 relative flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 flex items-center justify-center">
                    <Home className="w-5 h-5" />
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    <Lock className="w-3 h-3 text-amber-500" /> Member Feature
                  </span>
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Clean Air Room Assessment
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Evaluate cooking fuel (LPG/PNG), incense burning, room volume, and exhaust capacity. Calculate your exact home safety score.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => {
                    if (isAuthenticated) navigate('/indoor')
                    else setLockedModalFeature('Clean Air Room Assessment')
                  }}
                  className="w-full py-2 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" /> {isAuthenticated ? 'Open Assessment' : 'Sign In to Assess Home'}
                </button>
              </div>
            </div>

            {/* Locked Card 4: AI Saathi Copilot */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 relative flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center">
                    <Bot className="w-5 h-5" />
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    <Lock className="w-3 h-3 text-amber-500" /> Member Feature
                  </span>
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  AI Saathi Copilot (Gemini)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Contextual AI consultations incorporating your local station AQI and household profiles, operating with strict medical triage boundaries.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => {
                    if (isAuthenticated) navigate('/chat')
                    else setLockedModalFeature('AI Saathi Copilot')
                  }}
                  className="w-full py-2 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" /> {isAuthenticated ? 'Open AI Copilot' : 'Sign In for AI Consultation'}
                </button>
              </div>
            </div>

            {/* Locked Card 5: Interactive Geospatial Map */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 relative flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    <Lock className="w-3 h-3 text-amber-500" /> Member Feature
                  </span>
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Geospatial Station Map
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Full Leaflet OpenStreetMap view with numeric CPCB radar pulse pins, GPS "Locate Me", and station popup telemetries.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => {
                    if (isAuthenticated) navigate('/map')
                    else setLockedModalFeature('Geospatial Station Map')
                  }}
                  className="w-full py-2 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" /> {isAuthenticated ? 'Open Pollution Map' : 'Sign In for Map Explorer'}
                </button>
              </div>
            </div>

            {/* Locked Card 6: Smog Alerts & 7 AM Briefings */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 relative flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 flex items-center justify-center">
                    <Bell className="w-5 h-5" />
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    <Lock className="w-3 h-3 text-amber-500" /> Member Feature
                  </span>
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Smog Alerts & Morning Briefing
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Automated 7:00 AM daily briefings informing you of today's predicted peak hours and 30-minute threshold breach alerts.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => {
                    if (isAuthenticated) navigate('/notifications')
                    else setLockedModalFeature('Smog Alerts & Morning Briefing')
                  }}
                  className="w-full py-2 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" /> {isAuthenticated ? 'Open Notifications' : 'Sign In for Alerts'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PART 5: OFFICIAL CPCB REFERENCE SCALE (Educational) */}
      <section className="py-14 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Regulatory Standards
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Official Central Pollution Control Board (CPCB) Scale
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              India's 6-tier classification framework and associated health impacts.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="h-2 rounded-full bg-[#55A630]" />
              <div className="text-xs font-bold text-slate-900 dark:text-white">0 – 50</div>
              <div className="text-[11px] font-bold text-[#55A630] uppercase">Good</div>
              <p className="text-[10px] text-slate-500 leading-snug">Minimal impact. Safe for all outdoor activities.</p>
            </div>

            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="h-2 rounded-full bg-[#80B918]" />
              <div className="text-xs font-bold text-slate-900 dark:text-white">51 – 100</div>
              <div className="text-[11px] font-bold text-[#80B918] uppercase">Satisfactory</div>
              <p className="text-[10px] text-slate-500 leading-snug">Minor breathing discomfort to sensitive individuals.</p>
            </div>

            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="h-2 rounded-full bg-[#FFB703]" />
              <div className="text-xs font-bold text-slate-900 dark:text-white">101 – 200</div>
              <div className="text-[11px] font-bold text-[#FFB703] uppercase">Moderate</div>
              <p className="text-[10px] text-slate-500 leading-snug">Breathing discomfort to people with asthma & heart conditions.</p>
            </div>

            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="h-2 rounded-full bg-[#FB8500]" />
              <div className="text-xs font-bold text-slate-900 dark:text-white">201 – 300</div>
              <div className="text-[11px] font-bold text-[#FB8500] uppercase">Poor</div>
              <p className="text-[10px] text-slate-500 leading-snug">Breathing discomfort on prolonged exposure. Avoid morning runs.</p>
            </div>

            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="h-2 rounded-full bg-[#D90429]" />
              <div className="text-xs font-bold text-slate-900 dark:text-white">301 – 400</div>
              <div className="text-[11px] font-bold text-[#D90429] uppercase">Very Poor</div>
              <p className="text-[10px] text-slate-500 leading-snug">Respiratory illness on prolonged exposure. Run purifiers.</p>
            </div>

            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="h-2 rounded-full bg-[#6B0504]" />
              <div className="text-xs font-bold text-slate-900 dark:text-white">401 – 500+</div>
              <div className="text-[11px] font-bold text-[#6B0504] uppercase">Severe</div>
              <p className="text-[10px] text-slate-500 leading-snug">Affects healthy people; serious risk to sensitive individuals.</p>
            </div>
          </div>
        </div>
      </section>

      {/* PART 6: FREQUENTLY ASKED QUESTIONS */}
      <section id="faq" className="py-14 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="space-y-1 text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            Common Inquiries
          </span>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-4 text-left font-semibold text-xs text-slate-900 dark:text-white flex items-center justify-between gap-4 cursor-pointer"
              >
                <span>{faq.q}</span>
                {openFaq === idx ? (
                  <ChevronUp className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                )}
              </button>
              {openFaq === idx && (
                <div className="px-4 pb-4 pt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* PART 7: SIMPLE CLEAN CTA */}
      <section className="py-12 bg-slate-900 text-white text-center">
        <div className="max-w-3xl mx-auto px-4 space-y-4">
          <h2 className="text-2xl font-bold">
            Ready to Protect Your Household This Winter?
          </h2>
          <p className="text-xs text-slate-300 max-w-lg mx-auto">
            Free forever for Indian families. Access personalized routines, clean air room blueprints, and daily intelligence in under a minute.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="w-full sm:w-auto px-6 py-2 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition-colors"
              >
                Open Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="w-full sm:w-auto px-6 py-2 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition-colors"
                >
                  Create Free Account
                </Link>
                <Link
                  to="/login"
                  className="w-full sm:w-auto px-6 py-2 rounded-lg text-xs font-semibold border border-slate-700 hover:bg-slate-800 text-slate-200 transition-colors"
                >
                  Sign In with Existing Account
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Clean Informative Footer */}
      <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 py-8 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
            <div className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-300">
              <Wind className="w-4 h-4 text-emerald-600" />
              <span>SaansSaathi — Breathe Better. Live Smarter.</span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/about" className="hover:underline">About</Link>
              <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
              <Link to="/terms" className="hover:underline">Terms of Service</Link>
            </div>
          </div>

          <div className="text-[10px] text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-3 flex flex-col sm:flex-row justify-between gap-2">
            <p>
              Data Sources: Central Pollution Control Board (CPCB), OpenAQ, Open-Meteo, OpenStreetMap. Open-source under MIT License.
            </p>
            <p>
              Medical Disclaimer: For health awareness only. Consult a physician for clinical symptoms.
            </p>
          </div>
        </div>
      </footer>

      {/* Clean Sign-In Modal when clicking a locked feature */}
      {lockedModalFeature && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    Sign In Required
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    To access: <strong>{lockedModalFeature}</strong>
                  </span>
                </div>
              </div>
              <button
                onClick={() => setLockedModalFeature(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Personalized family vulnerability profiles, diurnal routine adjustments, and AI consultations are customized to your home and saved in your secure profile.
            </p>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
              <span className="font-semibold text-slate-700 dark:text-slate-200 block text-[11px]">
                Demo Credentials Available:
              </span>
              <div className="font-mono text-[11px] text-slate-600 dark:text-slate-300">
                Email: <strong>swaraj@saanssaathi.org</strong> | Password: <strong>Pass@1234</strong>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => {
                  setLockedModalFeature(null)
                  navigate('/login')
                }}
                className="flex-1 py-2 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer"
              >
                Sign In Now
              </button>
              <button
                onClick={() => {
                  setLockedModalFeature(null)
                  navigate('/register')
                }}
                className="flex-1 py-2 rounded-lg text-xs font-semibold border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
