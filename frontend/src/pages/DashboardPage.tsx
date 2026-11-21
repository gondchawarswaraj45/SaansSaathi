import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AIRecommendationCard } from '@/components/dashboard/AIRecommendationCard'
import {
  Wind,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Users,
  Home,
  Bot,
  RefreshCw,
  MapPin,
  Clock,
  Thermometer,
  Droplets,
  Navigation,
  ArrowUpRight,
  Info,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import { getAqiCategory } from '@/utils/aqi'

export default function DashboardPage() {
  const [selectedCity, setSelectedCity] = useState('Pune (Bavdhan)')
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Current AQI telemetry state (e.g., 285 = Poor in winter smog)
  const aqiValue = 285
  const categoryInfo = getAqiCategory(aqiValue)
  const dominantPollutant = 'PM2.5'

  // Pollutant breakdown
  const pollutants = [
    { code: 'PM2.5', name: 'Fine Particulates', value: 138, unit: 'µg/m³', safeLimit: 60 },
    { code: 'PM10', name: 'Coarse Dust', value: 242, unit: 'µg/m³', safeLimit: 100 },
    { code: 'NO2', name: 'Nitrogen Dioxide', value: 48, unit: 'µg/m³', safeLimit: 80 },
    { code: 'SO2', name: 'Sulphur Dioxide', value: 22, unit: 'µg/m³', safeLimit: 80 },
    { code: 'CO', name: 'Carbon Monoxide', value: 1.4, unit: 'mg/m³', safeLimit: 2.0 },
    { code: 'O3', name: 'Ground Ozone', value: 38, unit: 'µg/m³', safeLimit: 100 },
  ]

  // 24-hour variation mock telemetry
  const trendData = [
    { time: '00:00', aqi: 210 },
    { time: '03:00', aqi: 240 },
    { time: '06:00', aqi: 310 }, // Morning peak (temperature inversion)
    { time: '09:00', aqi: 345 },
    { time: '12:00', aqi: 270 },
    { time: '15:00', aqi: 215 },
    { time: '18:00', aqi: 290 }, // Evening commute peak
    { time: '21:00', aqi: 285 },
  ]

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 800)
  }

  return (
    <div className="page-container space-y-8 animate-fade-in">
      {/* Top Bar / Location Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-brand-green-100 text-brand-green-800 dark:bg-brand-green-950 dark:text-brand-green-300">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight">{selectedCity}</h1>
              <span className="inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                <span className="live-dot" /> LIVE
              </span>
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
              <Clock className="w-3.5 h-3.5" /> Station: Pashan CPCB • Updated 6 mins ago
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="text-xs font-medium px-3 py-2 rounded-lg border border-border bg-card hover:bg-muted focus:outline-none"
          >
            <option value="Pune (Bavdhan)">Pune (Bavdhan / Pashan)</option>
            <option value="Delhi (Anand Vihar)">Delhi (Anand Vihar)</option>
            <option value="Mumbai (Bandra)">Mumbai (Bandra Kurla)</option>
            <option value="Bangalore (Silk Board)">Bangalore (Silk Board)</option>
          </select>

          <button
            onClick={handleRefresh}
            className="p-2 rounded-lg border border-border bg-card hover:bg-muted text-muted-foreground transition-all"
            title="Refresh Telemetry"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-brand-green-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* Hero AQI Card + Health Advisory Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main AQI Gauge Card */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-card border border-border shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              National Air Quality Index (CPCB)
            </span>
            <span
              className="text-xs font-bold px-3 py-1 rounded-full text-white uppercase tracking-wider shadow-sm"
              style={{ backgroundColor: categoryInfo.color }}
            >
              {categoryInfo.label}
            </span>
          </div>

          {/* Large AQI Indicator */}
          <div className="my-6 flex items-center gap-6">
            <div
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl flex flex-col items-center justify-center text-white shadow-xl transition-all"
              style={{
                backgroundColor: categoryInfo.color,
                boxShadow: `0 12px 30px -8px ${categoryInfo.color}66`,
              }}
            >
              <span className="font-mono text-5xl sm:text-6xl font-black tracking-tighter">
                {aqiValue}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-90 mt-1">
                AQI US / CPCB
              </span>
            </div>

            <div className="space-y-1.5 flex-1">
              <div className="text-sm font-semibold text-muted-foreground">Dominant Pollutant</div>
              <div className="text-2xl font-black text-foreground">{dominantPollutant}</div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Fine particulate matter is <strong>2.3× above</strong> CPCB 24-hr standard.
              </p>
            </div>
          </div>

          {/* Environmental Context / Weather Bar */}
          <div className="pt-4 border-t border-border grid grid-cols-3 gap-2 text-center text-xs">
            <div className="flex items-center justify-center gap-1.5 text-muted-foreground">
              <Thermometer className="w-4 h-4 text-amber-500" />
              <span>24°C</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 text-muted-foreground">
              <Droplets className="w-4 h-4 text-brand-sky-500" />
              <span>64% Hum</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 text-muted-foreground">
              <Navigation className="w-4 h-4 text-brand-green-600 rotate-45" />
              <span>6 km/h NW</span>
            </div>
          </div>
        </div>

        {/* Actionable Health Advisory & Family Action Card */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-card border border-border shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-aqi-poor" />
              <h2 className="text-base font-bold">Today's Precautionary Advisory</h2>
            </div>
            <span className="text-xs text-muted-foreground">WHO & CPCB Guidelines</span>
          </div>

          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-sm">
            <p className="font-semibold text-amber-900 dark:text-amber-200">
              {categoryInfo.summary}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Temperature inversion in early hours is trapping vehicle and biomass emissions closer
              to the ground.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-muted/60 space-y-1">
              <span className="font-bold text-foreground">😷 Face Mask</span>
              <p className="text-muted-foreground">{categoryInfo.advisories.mask}</p>
            </div>
            <div className="p-3 rounded-xl bg-muted/60 space-y-1">
              <span className="font-bold text-foreground">🏃 Outdoor Workouts</span>
              <p className="text-muted-foreground">{categoryInfo.advisories.outdoor}</p>
            </div>
            <div className="p-3 rounded-xl bg-muted/60 space-y-1">
              <span className="font-bold text-foreground">🏠 Home Ventilation</span>
              <p className="text-muted-foreground">{categoryInfo.advisories.indoor}</p>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between gap-3">
            <Link
              to="/family"
              className="flex items-center gap-1.5 text-xs font-bold text-brand-green-700 dark:text-brand-green-400 hover:underline"
            >
              <Users className="w-4 h-4" /> View Family Member Precautions →
            </Link>
            <Link
              to="/chat"
              className="px-3.5 py-1.5 rounded-lg bg-brand-green-600 text-white text-xs font-bold hover:bg-brand-green-700 transition-colors flex items-center gap-1"
            >
              <Bot className="w-3.5 h-3.5" /> Ask AI Saathi
            </Link>
          </div>
        </div>
      </div>

      {/* 24-Hour Trend Area Chart */}
      <div className="p-6 rounded-3xl bg-card border border-border shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold">24-Hour Pollution Fluctuation & Forecast</h2>
            <p className="text-xs text-muted-foreground">
              Peak exposures occur between 06:00 AM – 09:30 AM and 06:00 PM – 09:00 PM.
            </p>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <span className="w-3 h-3 rounded-sm bg-aqi-poor inline-block" />
            <span className="text-muted-foreground">Poor Threshold (200)</span>
            <span className="w-3 h-3 rounded-sm bg-aqi-verypoor inline-block ml-3" />
            <span className="text-muted-foreground">Very Poor (300)</span>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="aqiGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E76F51" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#E76F51" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" stroke="currentColor" opacity={0.6} tick={{ fontSize: 11, fill: 'currentColor' }} />
              <YAxis domain={[0, 400]} stroke="currentColor" opacity={0.6} tick={{ fontSize: 11, fill: 'currentColor' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1E293B',
                  color: '#fff',
                  borderRadius: '12px',
                  border: 'none',
                  fontSize: '12px',
                }}
              />
              <ReferenceLine y={200} stroke="#E76F51" strokeDasharray="3 3" />
              <ReferenceLine y={300} stroke="#D62828" strokeDasharray="3 3" />
              <Area
                type="monotone"
                dataKey="aqi"
                stroke="#E76F51"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#aqiGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Individual Pollutants Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold">Individual Pollutants Breakdown</h2>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Info className="w-3.5 h-3.5" /> Benchmarked against CPCB 24-hr standards
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {pollutants.map((item) => {
            const isExceeded = item.value > item.safeLimit
            const pct = Math.min(100, Math.round((item.value / item.safeLimit) * 100))
            return (
              <div
                key={item.code}
                className="p-4 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between space-y-2 card-hover"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-foreground">{item.code}</span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        isExceeded
                          ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                          : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                      }`}
                    >
                      {isExceeded ? 'Elevated' : 'Normal'}
                    </span>
                  </div>
                  <div className="mt-2 text-xl font-black font-mono">
                    {item.value}{' '}
                    <span className="text-[10px] font-normal text-muted-foreground">
                      {item.unit}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isExceeded ? 'bg-aqi-poor' : 'bg-aqi-good'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>Safe: {item.safeLimit}</span>
                    <span>{pct}%</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* AI Daily Intelligence Tip Card */}
      <AIRecommendationCard currentAqi={aqiValue} city={selectedCity} />

      {/* Quick Action Navigation Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <Link
          to="/family"
          className="p-6 rounded-3xl bg-gradient-to-br from-brand-green-500/10 to-transparent border border-brand-green-600/20 card-hover flex items-center justify-between"
        >
          <div className="space-y-1">
            <h3 className="font-bold text-sm">Family Protection Matrix</h3>
            <p className="text-xs text-muted-foreground">
              Review customized safety plans for children and seniors.
            </p>
          </div>
          <ArrowUpRight className="w-5 h-5 text-brand-green-700" />
        </Link>

        <Link
          to="/indoor"
          className="p-6 rounded-3xl bg-gradient-to-br from-brand-sky-500/10 to-transparent border border-brand-sky-600/20 card-hover flex items-center justify-between"
        >
          <div className="space-y-1">
            <h3 className="font-bold text-sm">Indoor Air Hack Generator</h3>
            <p className="text-xs text-muted-foreground">
              Create an affordable Clean Air Room with DIY filters.
            </p>
          </div>
          <ArrowUpRight className="w-5 h-5 text-brand-sky-600" />
        </Link>

        <Link
          to="/planner"
          className="p-6 rounded-3xl bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-600/20 card-hover flex items-center justify-between"
        >
          <div className="space-y-1">
            <h3 className="font-bold text-sm">Smart Daily Routine</h3>
            <p className="text-xs text-muted-foreground">
              Schedule school drop-offs and exercise when smog dips.
            </p>
          </div>
          <ArrowUpRight className="w-5 h-5 text-amber-600" />
        </Link>
      </div>
    </div>
  )
}
