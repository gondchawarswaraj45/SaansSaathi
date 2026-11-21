import { MapPin, Info, Check, ShieldAlert, Sparkles, Navigation } from 'lucide-react'
import toast from 'react-hot-toast'
import type { MapStation } from '@/api/mapApi'

interface Props {
  station: MapStation
  onSetLocation?: (station: MapStation) => void
}

export function StationPopupContent({ station, onSetLocation }: Props) {
  const handleSetLocation = () => {
    if (onSetLocation) {
      onSetLocation(station)
    } else {
      toast.success(`Active location set to ${station.name}`)
    }
  }

  return (
    <div className="p-1 min-w-[260px] sm:min-w-[290px] space-y-3 font-sans text-foreground">
      {/* Top Header */}
      <div className="flex items-start justify-between gap-3 pb-2 border-b border-border/80">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground block">
            {station.cityName} • {station.provider}
          </span>
          <h3 className="text-sm font-black text-foreground leading-snug">{station.name}</h3>
        </div>

        <div
          className="w-12 h-12 rounded-2xl flex flex-col items-center justify-center text-white font-mono font-black shrink-0 shadow-sm"
          style={{ backgroundColor: station.colorHex }}
        >
          <span className="text-sm leading-none">{station.aqi}</span>
          <span className="text-[7px] uppercase font-sans tracking-widest mt-0.5">AQI</span>
        </div>
      </div>

      {/* Dominant Pollutant & Category */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground font-medium">Category:</span>
        <span className="font-extrabold" style={{ color: station.colorHex }}>
          {station.category}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="p-2 rounded-xl bg-muted/40 border border-border/60">
          <span className="text-[10px] font-bold text-muted-foreground block">PM2.5 (Fine Soot)</span>
          <span className="text-sm font-black font-mono text-foreground">
            {station.pm25} <span className="text-[9px] font-normal text-muted-foreground">µg/m³</span>
          </span>
        </div>

        <div className="p-2 rounded-xl bg-muted/40 border border-border/60">
          <span className="text-[10px] font-bold text-muted-foreground block">PM10 (Dust)</span>
          <span className="text-sm font-black font-mono text-foreground">
            {station.pm10} <span className="text-[9px] font-normal text-muted-foreground">µg/m³</span>
          </span>
        </div>
      </div>

      {/* Advisory Snippet */}
      <div className="p-2.5 rounded-xl bg-muted/30 border border-border text-[11px] text-muted-foreground leading-relaxed flex items-start gap-1.5">
        <ShieldAlert className="w-3.5 h-3.5 text-brand-green-600 shrink-0 mt-0.5" />
        <span>
          {station.aqi > 250
            ? 'Severe smog: Wear N95 respirator outdoors & keep morning windows shut.'
            : 'Moderate air: Sensitive members should minimize heavy outdoor workouts.'}
        </span>
      </div>

      {/* Actions */}
      <div className="pt-1 flex items-center justify-between gap-2">
        <span className="text-[9px] text-muted-foreground">Updated {station.lastUpdated}</span>
        <button
          type="button"
          onClick={handleSetLocation}
          className="px-3 py-1.5 rounded-xl bg-brand-green-600 hover:bg-brand-green-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs transition-all"
        >
          <Navigation className="w-3 h-3" /> Set Location
        </button>
      </div>
    </div>
  )
}
