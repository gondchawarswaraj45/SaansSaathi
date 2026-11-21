import { ShieldCheck, AlertCircle, TrendingDown, ArrowRight } from 'lucide-react'

interface Props {
  outdoorAqi?: number
  indoorHazardScore?: number
  hasPurifier?: boolean
  usesIncenseOrCoils?: boolean
}

export function OutdoorVsIndoorWidget({
  outdoorAqi = 285,
  indoorHazardScore = 45,
  hasPurifier = false,
  usesIncenseOrCoils = true,
}: Props) {
  // Outdoor AQI vs Unmanaged Indoor vs Clean Air Room
  // In winter, indoor unmanaged with incense/cooking can be higher than outdoor!
  const unmanagedIndoorAqi = Math.round(
    outdoorAqi * (usesIncenseOrCoils ? 1.25 : 0.85)
  )
  const sanctuaryIndoorAqi = hasPurifier
    ? Math.round(outdoorAqi * 0.18)
    : Math.round(outdoorAqi * 0.28)

  const reductionPercent = Math.round(
    ((unmanagedIndoorAqi - sanctuaryIndoorAqi) / unmanagedIndoorAqi) * 100
  )

  const getAqiColor = (aqi: number) => {
    if (aqi <= 50) return 'text-aqi-good bg-aqi-good/10 border-aqi-good/30'
    if (aqi <= 100) return 'text-aqi-satisfactory bg-aqi-satisfactory/10 border-aqi-satisfactory/30'
    if (aqi <= 200) return 'text-aqi-moderate bg-aqi-moderate/10 border-aqi-moderate/30'
    if (aqi <= 300) return 'text-aqi-poor bg-aqi-poor/10 border-aqi-poor/30'
    if (aqi <= 400) return 'text-aqi-very-poor bg-aqi-very-poor/10 border-aqi-very-poor/30'
    return 'text-aqi-severe bg-aqi-severe/10 border-aqi-severe/30'
  }

  return (
    <div className="bg-card border border-border rounded-3xl p-6 sm:p-7 shadow-sm space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-border">
        <div>
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-brand-green-600" />
            Outdoor vs. Indoor Exposure Comparison
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time projection based on current outdoor smog & your home's mitigation setup
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-green-100 dark:bg-brand-green-950 text-brand-green-700 dark:text-brand-green-300 font-extrabold text-xs">
          <span>↓ {reductionPercent}% PM2.5 Reduction</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Outdoor Smog */}
        <div className="p-5 rounded-2xl border border-border bg-muted/20 space-y-2 text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
            1. Current Ambient Outdoor
          </span>
          <div className="text-3xl font-black text-aqi-poor">
            AQI {outdoorAqi}
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-aqi-poor/10 text-aqi-poor inline-block">
            Poor / Inversion
          </span>
          <p className="text-[11px] text-muted-foreground pt-1">
            Raw street air carrying road dust, vehicular NO2 & stubble smoke.
          </p>
        </div>

        {/* Card 2: Unmanaged Indoor */}
        <div className="p-5 rounded-2xl border border-red-200 dark:border-red-950/60 bg-red-50/30 dark:bg-red-950/10 space-y-2 text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400 block">
            2. Unsealed Indoor (Default)
          </span>
          <div className="text-3xl font-black text-red-600">
            AQI ~{unmanagedIndoorAqi}
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400 inline-block">
            Trapped Cooking & Smog
          </span>
          <p className="text-[11px] text-muted-foreground pt-1">
            Without exhaust and door seals, indoor cooking aerosols linger for hours.
          </p>
        </div>

        {/* Card 3: SaansSaathi Sanctuary */}
        <div className="p-5 rounded-2xl border-2 border-brand-green-500 bg-brand-green-50/50 dark:bg-brand-green-950/20 space-y-2 text-center shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-green-700 dark:text-brand-green-400 block">
            3. SaansSaathi Clean Air Room
          </span>
          <div className="text-3xl font-black text-brand-green-600">
            AQI ~{sanctuaryIndoorAqi}
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-brand-green-200/60 dark:bg-brand-green-900/60 text-brand-green-800 dark:text-brand-green-200 inline-block">
            Protected Sanctuary
          </span>
          <p className="text-[11px] text-muted-foreground pt-1">
            Sealed door undercut + DIY or HEPA filtration running continuously.
          </p>
        </div>
      </div>
    </div>
  )
}
