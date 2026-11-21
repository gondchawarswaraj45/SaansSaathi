import { useEffect } from 'react'
import { MapPin, Info, Layers } from 'lucide-react'

// Station pins inspired by the sample images (Delhi, Pune, Mumbai, etc.)
const sampleStations = [
  { id: 1, name: 'Pashan CPCB', city: 'Pune', aqi: 285, category: 'POOR', color: '#E76F51', lat: 18.535, lng: 73.792 },
  { id: 2, name: 'Shivajinagar MPCB', city: 'Pune', aqi: 310, category: 'VERY_POOR', color: '#D62828', lat: 18.531, lng: 73.844 },
  { id: 3, name: 'Bavdhan Sensor', city: 'Pune', aqi: 240, category: 'POOR', color: '#E76F51', lat: 18.513, lng: 73.774 },
  { id: 4, name: 'Hinjawadi IT Park', city: 'Pune', aqi: 195, category: 'MODERATE', color: '#F4A261', lat: 18.591, lng: 73.738 },
  { id: 5, name: 'Katraj Lake', city: 'Pune', aqi: 165, category: 'MODERATE', color: '#F4A261', lat: 18.455, lng: 73.867 },
  { id: 6, name: 'Alandi Road', city: 'Pune', aqi: 340, category: 'VERY_POOR', color: '#D62828', lat: 18.612, lng: 73.876 },
]

export default function MapPage() {
  return (
    <div className="page-container space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Interactive Pollution Geospatial Map</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Station-wise ground measurements (CPCB, MPCB & OpenAQ telemetry).
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1.5 font-medium text-muted-foreground">
            <span className="live-dot" /> Live Observation Feed
          </span>
        </div>
      </div>

      {/* Map Container View */}
      <div className="rounded-3xl border border-border overflow-hidden bg-card shadow-sm relative min-h-[500px] flex flex-col justify-between">
        {/* Map Top Floating Controls */}
        <div className="p-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-border flex items-center justify-between z-10">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <MapPin className="w-4 h-4 text-brand-green-600" />
            <span>Viewing: Pune Metropolitan Region</span>
          </div>
          <span className="text-xs text-muted-foreground">Showing 6 Active Ground Stations</span>
        </div>

        {/* Station Pins Visual Representation (inspired by Sample Images 1, 2, 6, 7) */}
        <div className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-auto">
          {sampleStations.map((station) => (
            <div
              key={station.id}
              className="p-5 rounded-2xl border border-border bg-card shadow-md flex items-center justify-between card-hover"
            >
              <div className="space-y-1">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  {station.city}
                </span>
                <h3 className="text-sm font-bold text-foreground">{station.name}</h3>
                <span className="text-[10px] text-muted-foreground font-mono">
                  {station.lat.toFixed(3)}°N, {station.lng.toFixed(3)}°E
                </span>
              </div>

              {/* Colored AQI badge pin */}
              <div
                className="w-16 h-12 rounded-xl flex flex-col items-center justify-center text-white font-mono font-bold shadow-md"
                style={{ backgroundColor: station.color }}
              >
                <span className="text-base">{station.aqi}</span>
                <span className="text-[8px] uppercase tracking-widest opacity-90">AQI</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Legend (Reference Images style) */}
        <div className="p-4 bg-muted/60 border-t border-border flex flex-wrap items-center justify-between gap-4 text-xs">
          <span className="font-semibold text-muted-foreground">CPCB AQI Scale:</span>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2 py-0.5 rounded text-white bg-aqi-good font-bold text-[10px]">0–50 Good</span>
            <span className="px-2 py-0.5 rounded text-white bg-aqi-satisfactory font-bold text-[10px]">51–100 Satisfactory</span>
            <span className="px-2 py-0.5 rounded text-white bg-aqi-moderate font-bold text-[10px]">101–200 Moderate</span>
            <span className="px-2 py-0.5 rounded text-white bg-aqi-poor font-bold text-[10px]">201–300 Poor</span>
            <span className="px-2 py-0.5 rounded text-white bg-aqi-verypoor font-bold text-[10px]">301–400 Very Poor</span>
            <span className="px-2 py-0.5 rounded text-white bg-aqi-severe font-bold text-[10px]">401+ Severe</span>
          </div>
        </div>
      </div>
    </div>
  )
}
