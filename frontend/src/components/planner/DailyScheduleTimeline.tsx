import {
  CheckCircle2,
  Circle,
  Clock,
  Car,
  Home,
  Dumbbell,
  Briefcase,
  AlertTriangle,
  Trash2,
  Edit2,
  Sparkles,
} from 'lucide-react'
import type { RoutineActivity } from '@/api/plannerApi'

interface Props {
  activities: RoutineActivity[]
  onToggleComplete: (actId: number) => void
  onDeleteActivity: (actId: number) => void
}

export function DailyScheduleTimeline({ activities, onToggleComplete, onDeleteActivity }: Props) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'TRAVEL':
        return <Car className="w-4 h-4 text-blue-600" />
      case 'EXERCISE':
        return <Dumbbell className="w-4 h-4 text-emerald-600" />
      case 'WORK':
        return <Briefcase className="w-4 h-4 text-purple-600" />
      case 'OUTDOOR':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />
      default:
        return <Home className="w-4 h-4 text-brand-green-600" />
    }
  }

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'HIGH':
        return 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400'
      case 'MEDIUM':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
      default:
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-1 border-b border-border">
        <h2 className="text-base font-bold text-foreground flex items-center gap-2">
          <Clock className="w-5 h-5 text-brand-green-600" />
          Scheduled Activities ({activities.length})
        </h2>
        <span className="text-xs text-muted-foreground">Click checkmark to log activity</span>
      </div>

      <div className="relative pl-6 sm:pl-8 space-y-4 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-border">
        {activities.map((act) => {
          const isDone = Boolean(act.isCompleted)
          return (
            <div
              key={act.id}
              className={`relative group p-4 sm:p-5 rounded-2xl border transition-all ${
                isDone
                  ? 'bg-muted/30 border-border opacity-70'
                  : 'bg-card border-border hover:border-brand-green-400 shadow-sm'
              }`}
            >
              {/* Timeline Bullet Node */}
              <button
                type="button"
                onClick={() => onToggleComplete(act.id)}
                className={`absolute -left-6 sm:-left-8 top-5 w-6 h-6 rounded-full flex items-center justify-center transition-all bg-card border ${
                  isDone
                    ? 'border-brand-green-600 text-brand-green-600'
                    : 'border-border text-muted-foreground hover:border-brand-green-500'
                }`}
                title={isDone ? 'Mark as Pending' : 'Mark as Done'}
              >
                {isDone ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-4 h-4" />}
              </button>

              <div className="space-y-2">
                {/* Header row: time slot, family member, risk level, actions */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-muted text-foreground border border-border">
                      {act.timeSlotFormatted}
                    </span>

                    {act.familyMemberName && (
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-brand-sky-100 dark:bg-brand-sky-950 text-brand-sky-800 dark:text-brand-sky-200">
                        {act.familyMemberName}
                      </span>
                    )}

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getRiskBadge(act.riskLevel)}`}>
                      {act.riskLevel} Risk
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                      {getActivityIcon(act.type)}
                      {act.type}
                    </span>

                    <button
                      type="button"
                      onClick={() => onDeleteActivity(act.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-red-600 transition-opacity"
                      title="Delete activity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Activity Name & Original */}
                <div>
                  <h3 className={`text-sm sm:text-base font-bold ${isDone ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                    {act.activityName}
                  </h3>
                  {act.originalActivity && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Original Plan: <span className="italic">{act.originalActivity}</span>
                    </p>
                  )}
                </div>

                {/* AI-grounded Recommendation */}
                <div className="p-3 rounded-xl bg-brand-green-50/50 dark:bg-brand-green-950/20 border border-brand-green-200 dark:border-brand-green-800 text-xs text-foreground/90 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-brand-green-800 dark:text-brand-green-300">
                    <Sparkles className="w-3.5 h-3.5 text-brand-green-600 shrink-0" />
                    <span>SaansSaathi Low-Emission Routine Hack:</span>
                  </div>
                  <p className="leading-relaxed pl-5">{act.recommendation}</p>
                </div>

                {/* Scientific Reason */}
                {act.reason && (
                  <p className="text-[11px] text-muted-foreground leading-relaxed pl-1">
                    🔬 <strong>Why this matters:</strong> {act.reason}
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
