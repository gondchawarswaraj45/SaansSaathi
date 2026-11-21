import { useState } from 'react'
import { Calendar, Clock, CheckCircle2, Circle, AlertTriangle, ArrowRight, Shield } from 'lucide-react'
import toast from 'react-hot-toast'

interface RoutineItem {
  id: number
  time: string
  original: string
  recommended: string
  reason: string
  type: 'OUTDOOR' | 'INDOOR' | 'TRAVEL'
  status: 'PENDING' | 'DONE'
}

export default function PlannerPage() {
  const [items, setItems] = useState<RoutineItem[]>([
    {
      id: 1,
      time: '06:00 AM – 07:00 AM',
      original: 'Outdoor morning walk in neighborhood park',
      recommended: 'Switch to indoor yoga / stretching or delay walk until 10:00 AM',
      reason: 'Winter temperature inversion traps cold smog near the surface at sunrise.',
      type: 'INDOOR',
      status: 'DONE',
    },
    {
      id: 2,
      time: '08:00 AM – 08:45 AM',
      original: 'School drop-off on 2-wheeler',
      recommended: 'Carpool via closed vehicle with AC on recirculation, or wear certified N95 mask',
      reason: 'Peak school rush coinciding with highest traffic particulate density.',
      type: 'TRAVEL',
      status: 'PENDING',
    },
    {
      id: 3,
      time: '01:00 PM – 02:00 PM',
      original: 'Ventilate flat by opening all balcony doors',
      recommended: 'Brief 15-min cross-ventilation only when sunlight breaks inversion and wind picks up',
      reason: 'Mid-afternoon ambient air quality is relatively cleaner than morning or evening.',
      type: 'INDOOR',
      status: 'PENDING',
    },
    {
      id: 4,
      time: '05:30 PM – 07:00 PM',
      original: 'Son’s outdoor football practice',
      recommended: 'Move to indoor badminton / indoor gym training',
      reason: 'Evening smog buildup as atmospheric boundary layer compresses.',
      type: 'INDOOR',
      status: 'PENDING',
    },
  ])

  const toggleStatus = (id: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: item.status === 'DONE' ? 'PENDING' : 'DONE' }
          : item
      )
    )
    toast.success('Routine updated!')
  }

  return (
    <div className="page-container space-y-8 animate-fade-in">
      <div className="pb-2 border-b border-border">
        <h1 className="text-2xl font-bold tracking-tight">Smart Daily Routine Planner</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Low-emission, exposure-minimized schedules synchronized with diurnal pollution cycles.
        </p>
      </div>

      {/* Routine Timeline */}
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => toggleStatus(item.id)}
            className={`p-6 rounded-3xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              item.status === 'DONE'
                ? 'bg-muted/40 border-border opacity-70'
                : 'bg-card border-border shadow-sm hover:border-brand-green-600/40'
            }`}
          >
            <div className="flex items-start gap-4">
              <button className="mt-1 text-brand-green-600">
                {item.status === 'DONE' ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : (
                  <Circle className="w-6 h-6 text-muted-foreground" />
                )}
              </button>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-brand-green-700 dark:text-brand-green-400 bg-brand-green-50 dark:bg-brand-green-950 px-2 py-0.5 rounded">
                    {item.time}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    {item.type}
                  </span>
                </div>

                <div className="text-xs text-muted-foreground line-through">
                  Original Plan: {item.original}
                </div>
                <div className="text-sm font-bold text-foreground">
                  👉 Recommended: {item.recommended}
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1.5 pt-1">
                  <Shield className="w-3.5 h-3.5 text-brand-sky-500 shrink-0" /> {item.reason}
                </p>
              </div>
            </div>

            <div className="self-end sm:self-center text-xs font-semibold text-brand-green-700">
              {item.status === 'DONE' ? 'Completed' : 'Mark Done'}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
