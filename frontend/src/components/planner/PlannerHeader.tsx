import { Calendar, Sun, Clock, RotateCcw, Plus, ShieldCheck } from 'lucide-react'
import type { DailyRoutine } from '@/api/plannerApi'

interface Props {
  routine: DailyRoutine
  onRegenerate: () => void
  onAddCustom: () => void
  isRegenerating?: boolean
}

export function PlannerHeader({ routine, onRegenerate, onAddCustom, isRegenerating }: Props) {
  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'GOOD':
        return 'bg-aqi-good text-white'
      case 'SATISFACTORY':
        return 'bg-aqi-satisfactory text-white'
      case 'MODERATE':
        return 'bg-aqi-moderate text-foreground'
      case 'POOR':
        return 'bg-aqi-poor text-white'
      case 'VERY_POOR':
        return 'bg-aqi-very-poor text-white'
      default:
        return 'bg-aqi-severe text-white'
    }
  }

  return (
    <div className="bg-card border border-border rounded-3xl p-6 sm:p-7 shadow-sm space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
            <Calendar className="w-3.5 h-3.5 text-brand-green-600" />
            <span>Schedule for {new Date(routine.routineDate).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-foreground">
            Smart Low-Emission Daily Routine
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onRegenerate}
            disabled={isRegenerating}
            className="px-3.5 py-2 rounded-xl border border-border bg-background hover:bg-muted text-foreground font-bold text-xs flex items-center gap-1.5 transition-all disabled:opacity-50"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
            Regenerate Routine
          </button>

          <button
            type="button"
            onClick={onAddCustom}
            className="px-4 py-2 rounded-xl bg-brand-green-600 hover:bg-brand-green-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" /> Add Activity
          </button>
        </div>
      </div>

      {/* Grid of 3 Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
        {/* Metric 1: Telemetry AQI at Generation */}
        <div className="p-3.5 rounded-2xl bg-muted/40 border border-border flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase block">
              Day Baseline AQI
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xl font-black text-foreground">{routine.aqiAtGen}</span>
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${getCategoryColor(routine.aqiCategory)}`}>
                {routine.aqiCategory}
              </span>
            </div>
          </div>
        </div>

        {/* Metric 2: Best Outdoor Window */}
        <div className="p-3.5 rounded-2xl bg-brand-green-50/60 dark:bg-brand-green-950/20 border border-brand-green-200 dark:border-brand-green-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-brand-green-800 dark:text-brand-green-300 uppercase flex items-center gap-1">
              <Sun className="w-3.5 h-3.5 text-brand-green-600" /> Best Outdoor Window
            </span>
            <span className="text-xs sm:text-sm font-extrabold text-foreground mt-0.5 block">
              {routine.bestOutdoorWindow}
            </span>
          </div>
        </div>

        {/* Metric 3: Today's Compliance Progress */}
        <div className="p-3.5 rounded-2xl bg-muted/40 border border-border flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase block">
              Compliance Progress
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xl font-black text-brand-green-600">
                {routine.compliancePercentage}%
              </span>
              <span className="text-xs text-muted-foreground">
                ({routine.completedActivitiesCount}/{routine.totalActivitiesCount} done)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
