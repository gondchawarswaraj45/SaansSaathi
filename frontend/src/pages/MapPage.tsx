import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import {
  MapPin,
  Navigation,
  Layers,
  Info,
  Filter,
  Search,
  RefreshCw,
  Compass,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { mapApi, type MapStation } from '@/api/mapApi'
import { MapLegend } from '@/components/map/MapLegend'
import { StationPopupContent } from '@/components/map/StationPopupContent'

// Helper component to programmatically pan/zoom map when city changes
function ChangeMapView({ coords, zoom }: { coords: [number, number]; zoom: number }) {
  const map = useMap()
  useEffect(() => {
    map.flyTo(coords, zoom, { duration: 1.5 })
  }, [coords, zoom, map])
  return null
}

// Preset Indian city coordinates for quick navigation
const CITY_CENTERS: Record<string, { coords: [number, number]; zoom: number; label: string }> = {
  ALL: { coords: [22.5, 78.9], zoom: 5, label: 'All India View' },
  Delhi: { coords: [28.6139, 77.209], zoom: 11, label: 'Delhi NCR' },
  Pune: { coords: [18.5204, 73.8567], zoom: 12, label: 'Pune' },
  Mumbai: { coords: [19.076, 72.8777], zoom: 11, label: 'Mumbai' },
  Jaipur: { coords: [26.9124, 75.7873], zoom: 12, label: 'Jaipur' },
  Lucknow: { coords: [26.8467, 80.9462], zoom: 12, label: 'Lucknow' },
  Bengaluru: { coords: [12.9716, 77.5946], zoom: 11, label: 'Bengaluru' },
  Kolkata: { coords: [22.5726, 88.3639], zoom: 11, label: 'Kolkata' },
}

export default function MapPage() {
  const [stations, setStations] = useState<MapStation[]>([])
  const [selectedCity, setSelectedCity] = useState('ALL')
  const [riskFilter, setRiskFilter] = useState<'ALL' | 'HIGH' | 'LOW'>('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const [mapCenter, setMapCenter] = useState<[number, number]>(CITY_CENTERS.ALL.coords)
  const [mapZoom, setMapZoom] = useState<number>(CITY_CENTERS.ALL.zoom)
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)

  useEffect(() => {
    loadStations()
  }, [])

  const loadStations = async (city?: string) => {
    setIsLoading(true)
    try {
      const data = await mapApi.getStations(city)
      setStations(data || [])
    } catch (err) {
      console.error('Failed to load stations', err)
      toast.error('Could not fetch live monitoring stations')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCityChange = (cityKey: string) => {
    setSelectedCity(cityKey)
    if (CITY_CENTERS[cityKey]) {
      setMapCenter(CITY_CENTERS[cityKey].coords)
      setMapZoom(CITY_CENTERS[cityKey].zoom)
    }
  }

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser')
      return
    }

    toast.loading('Detecting your GPS coordinates...', { id: 'geo' })
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        toast.dismiss('geo')
        const lat = pos.coords.latitude
        const lng = pos.coords.longitude
        setUserLocation([lat, lng])
        setMapCenter([lat, lng])
        setMapZoom(13)
        toast.success('Centered map at your location!')
      },
      (err) => {
        toast.dismiss('geo')
        toast.error('Could not retrieve your location: ' + err.message)
      },
      { timeout: 10000 }
    )
  }

  // Create custom circular colored divIcon for Leaflet
  const createAqiIcon = (aqi: number, colorHex: string) => {
    return L.divIcon({
      className: 'custom-aqi-icon-wrapper',
      html: `
        <div style="
          background-color: ${colorHex};
          color: #ffffff;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-weight: 800;
          font-size: 13px;
          border: 3px solid #ffffff;
          box-shadow: 0 4px 14px rgba(0,0,0,0.4);
          cursor: pointer;
          transition: transform 0.2s ease;
        ">
          <span style="line-height: 1;">${aqi}</span>
          <span style="font-size: 7px; font-family: sans-serif; font-weight: 700; opacity: 0.9; letter-spacing: 0.5px; text-transform: uppercase;">AQI</span>
        </div>
      `,
      iconSize: [44, 44],
      iconAnchor: [22, 22],
      popupAnchor: [0, -24],
    })
  }

  // User GPS Pin Icon
  const userPinIcon = L.divIcon({
    className: 'custom-user-pin',
    html: `
      <div style="
        background-color: #2563EB;
        color: #ffffff;
        width: 38px;
        height: 38px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 3px solid #ffffff;
        box-shadow: 0 0 0 6px rgba(37,99,235,0.3);
      ">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <circle cx="12" cy="12" r="10" />
          <polygon points="12 2 15 9 22 9 17 14 19 21 12 17 5 21 7 14 2 9 9 9 12 2" />
        </svg>
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
  })

  // Filter stations based on city, search query, and risk filter
  const filteredStations = stations.filter((s) => {
    if (selectedCity !== 'ALL' && s.cityName) {
      if (!s.cityName.toLowerCase().includes(selectedCity.toLowerCase())) {
        return false
      }
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const matchName = s.name.toLowerCase().includes(q)
      const matchCity = s.cityName.toLowerCase().includes(q)
      const matchArea = s.areaName.toLowerCase().includes(q)
      if (!matchName && !matchCity && !matchArea) return false
    }
    if (riskFilter === 'HIGH') return s.aqi > 200
    if (riskFilter === 'LOW') return s.aqi <= 200
    return true
  })

  return (
    <div className="page-container space-y-6 animate-fade-in pb-10">
      {/* Page Header */}
      <div className="pb-3 border-b border-border flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
            <Compass className="w-7 h-7 text-brand-green-600" />
            Interactive Air Quality Geospatial Map
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Live observation telemetry from CPCB, SPCBs & OpenAQ ground monitoring stations across urban India.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={handleLocateMe}
            className="px-3.5 py-2 rounded-xl bg-card border border-border hover:bg-muted font-bold text-foreground flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Navigation className="w-3.5 h-3.5 text-blue-600" />
            Locate Me
          </button>

          <button
            type="button"
            onClick={() => loadStations()}
            disabled={isLoading}
            className="p-2 rounded-xl bg-card border border-border hover:bg-muted text-foreground transition-all"
            title="Refresh Stations"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-brand-green-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* Control Bar: City selector, Search box & Risk filters */}
      <div className="p-4 rounded-3xl bg-card border border-border shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* City Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 max-w-full">
          {Object.entries(CITY_CENTERS).map(([key, val]) => (
            <button
              key={key}
              type="button"
              onClick={() => handleCityChange(key)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                selectedCity === key
                  ? 'bg-brand-green-600 text-white shadow-xs'
                  : 'bg-muted/50 text-foreground hover:bg-muted'
              }`}
            >
              {val.label}
            </button>
          ))}
        </div>

        {/* Search & Risk Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-56">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search station or area..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-border bg-background text-xs focus:outline-none focus:ring-2 focus:ring-brand-green-500"
            />
          </div>

          <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl border border-border">
            <button
              type="button"
              onClick={() => setRiskFilter('ALL')}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                riskFilter === 'ALL' ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setRiskFilter('HIGH')}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                riskFilter === 'HIGH' ? 'bg-red-500 text-white' : 'text-muted-foreground'
              }`}
            >
              Smog &gt;200
            </button>
            <button
              type="button"
              onClick={() => setRiskFilter('LOW')}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                riskFilter === 'LOW' ? 'bg-emerald-600 text-white' : 'text-muted-foreground'
              }`}
            >
              &le;200
            </button>
          </div>
        </div>
      </div>

      {/* Map Container View */}
      <div className="rounded-3xl border border-border overflow-hidden bg-card shadow-md relative h-[580px] sm:h-[640px]">
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          scrollWheelZoom={true}
          className="w-full h-full z-0"
        >
          <ChangeMapView coords={mapCenter} zoom={mapZoom} />

          {/* CartoDB Voyager or OpenStreetMap standard tiles */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* User GPS Pin if located */}
          {userLocation && (
            <Marker position={userLocation} icon={userPinIcon}>
              <Popup>
                <div className="text-xs font-bold p-1">📍 You are here</div>
              </Popup>
            </Marker>
          )}

          {/* Monitoring Station Markers */}
          {filteredStations.map((station) => (
            <Marker
              key={station.id}
              position={[station.latitude, station.longitude]}
              icon={createAqiIcon(station.aqi, station.colorHex)}
            >
              <Popup className="custom-station-popup">
                <StationPopupContent station={station} />
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Floating Map Legend (Bottom Right on desktop, Bottom Center on mobile) */}
        <div className="absolute bottom-4 right-4 z-20 max-w-sm hidden sm:block">
          <MapLegend />
        </div>

        {/* Top-left station counter badge */}
        <div className="absolute top-4 left-4 z-20 px-3 py-1.5 rounded-xl bg-card/90 backdrop-blur-md border border-border text-xs font-bold text-foreground shadow-sm">
          Showing {filteredStations.length} Active Stations
        </div>
      </div>

      {/* Mobile Legend Below Map */}
      <div className="sm:hidden">
        <MapLegend />
      </div>

      {/* Bottom Disclaimer Banner */}
      <div className="p-3.5 rounded-2xl bg-muted/40 border border-border flex items-center gap-2.5 text-xs text-muted-foreground">
        <Info className="w-4 h-4 text-brand-green-600 shrink-0" />
        <span>
          <strong>Observation Transparency:</strong> Markers represent discrete point observations from certified CPCB & State Pollution Control Board monitors. Air quality varies with micro-topography, highway proximity, and localized wind eddies.
        </span>
      </div>
    </div>
  )
}
