import { useState, useEffect } from 'react'
import {
  Calendar,
  Clock,
  Sparkles,
  BarChart3,
  Sun,
  Shield,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react'
import toast from 'react-hot-toast'
import {
  plannerApi,
  type DailyRoutine,
  type RoutineActivityRequest,
  type WeeklyOverviewData,
} from '@/api/plannerApi'
import { PlannerHeader } from '@/components/planner/PlannerHeader'
import { DailyScheduleTimeline } from '@/components/planner/DailyScheduleTimeline'
import { CustomActivityModal } from '@/components/planner/CustomActivityModal'
import BackButton from '@/components/common/BackButton'
import { WeeklyOverview } from '@/components/planner/WeeklyOverview'

export default function PlannerPage() {
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'timing'>('daily')
  const [routine, setRoutine] = useState<DailyRoutine | null>(null)
  const [weeklyData, setWeeklyData] = useState<WeeklyOverviewData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [todayRes, weekRes] = await Promise.all([
        plannerApi.getTodayRoutine().catch(() => null),
        plannerApi.getWeeklyOverview().catch(() => null),
      ])

      if (todayRes) setRoutine(todayRes)
      if (weekRes) setWeeklyData(weekRes)
    } catch (err) {
      console.error('Failed to load planner data', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegenerate = async () => {
    setIsRegenerating(true)
    try {
      const updated = await plannerApi.generateRoutine()
      setRoutine(updated)
      toast.success('Routine regenerated with latest telemetry!')
    } catch (err) {
      console.error('Failed to regenerate routine', err)
      toast.error('Failed to regenerate routine')
    } finally {
      setIsRegenerating(false)
    }
  }

  const handleToggleComplete = async (actId: number) => {
    if (!routine) return
    try {
      const updatedAct = await plannerApi.toggleComplete(routine.id, actId)
      setRoutine((prev) => {
        if (!prev) return null
        const newActivities = prev.activities.map((a) => (a.id === actId ? updatedAct : a))
        const completed = newActivities.filter((a) => a.isCompleted).length
        const total = newActivities.length
        const pct = total > 0 ? Math.round((completed / total) * 100) : 0
        return {
          ...prev,
          activities: newActivities,
          completedActivitiesCount: completed,
          compliancePercentage: pct,
        }
      })
      toast.success(updatedAct.isCompleted ? 'Activity completed!' : 'Activity marked pending')
    } catch (err) {
      console.error('Failed to toggle completion', err)
      toast.error('Failed to update activity')
    }
  }

  const handleAddCustomActivity = async (data: RoutineActivityRequest) => {
    if (!routine) return
    try {
      const created = await plannerApi.addActivity(routine.id, data)
      setRoutine((prev) => {
        if (!prev) return null
        const newActivities = [...prev.activities, created].sort((a, b) =>
          a.startTime.localeCompare(b.startTime)
        )
        const completed = newActivities.filter((a) => a.isCompleted).length
        const total = newActivities.length
        return {
          ...prev,
          isCustom: true,
          activities: newActivities,
          totalActivitiesCount: total,
          compliancePercentage: Math.round((completed / total) * 100),
        }
      })
      toast.success('Custom activity scheduled!')
    } catch (err) {
      console.error('Failed to add custom activity', err)
      toast.error('Failed to schedule activity')
    }
  }

  const handleDeleteActivity = async (actId: number) => {
    if (!routine) return
    try {
      await plannerApi.deleteActivity(routine.id, actId)
      setRoutine((prev) => {
        if (!prev) return null
        const newActivities = prev.activities.filter((a) => a.id !== actId)
        const completed = newActivities.filter((a) => a.isCompleted).length
        const total = newActivities.length
        return {
          ...prev,
          activities: newActivities,
          totalActivitiesCount: total,
          compliancePercentage: total > 0 ? Math.round((completed / total) * 100) : 0,
        }
      })
      toast.success('Activity removed')
    } catch (err) {
      console.error('Failed to delete activity', err)
      toast.error('Failed to remove activity')
    }
  }

  return (
    <div className="page-container space-y-6 animate-fade-in pb-12">
      <BackButton />
      {/* Page Header */}
      <div className="pb-3 border-b border-border flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
            <Clock className="w-7 h-7 text-brand-green-600" />
            Smart Daily Routine Planner
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Low-emission schedules synchronized with diurnal smog cycles, temperature inversions, and family routines.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-muted/60 rounded-2xl w-fit text-xs font-bold border border-border">
        <button
          onClick={() => setActiveTab('daily')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all ${
            activeTab === 'daily'
              ? 'bg-card text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Clock className="w-4 h-4 text-brand-green-600" /> Today's Routine
        </button>

        <button
          onClick={() => setActiveTab('weekly')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all ${
            activeTab === 'weekly'
              ? 'bg-card text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-purple-600" /> Weekly Overview
        </button>

        <button
          onClick={() => setActiveTab('timing')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all ${
            activeTab === 'timing'
              ? 'bg-card text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Sun className="w-4 h-4 text-amber-500" /> Inversion Timing Guide
        </button>
      </div>

      {/* TAB 1: Daily Routine */}
      {activeTab === 'daily' && (
        <div className="space-y-6">
          {routine && (
            <PlannerHeader
              routine={routine}
              onRegenerate={handleRegenerate}
              onAddCustom={() => setIsModalOpen(true)}
              isRegenerating={isRegenerating}
            />
          )}

          {routine && (
            <DailyScheduleTimeline
              activities={routine.activities}
              onToggleComplete={handleToggleComplete}
              onDeleteActivity={handleDeleteActivity}
            />
          )}
        </div>
      )}

      {/* TAB 2: Weekly Overview */}
      {activeTab === 'weekly' && weeklyData && <WeeklyOverview data={weeklyData} />}

      {/* TAB 3: Inversion Timing Guide */}
      {activeTab === 'timing' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-7 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Sun className="w-5 h-5 text-amber-500" />
              The Science of Diurnal Smog Cycles in Indian Cities
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              In urban India (Delhi NCR, Kanpur, Patna, Lucknow, Pune), winter pollution follows a sharp, predictable diurnal rhythm governed by atmospheric boundary layer dynamics:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 space-y-2">
                <span className="text-xs font-black text-red-700 dark:text-red-400 uppercase block">
                  06:00 AM – 10:00 AM: Severe Danger Window
                </span>
                <p className="text-xs text-foreground/80 leading-relaxed">
                  Nocturnal radiation cooling traps calm, cold air below 100 meters. Stubble smoke, heavy diesel trucks, and morning rush-hour emissions pool at breathing height.
                </p>
                <div className="text-[11px] font-bold text-red-600">
                  ⚠️ Never do outdoor cardio. Keep all windows shut.
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-brand-green-50/60 dark:bg-brand-green-950/20 border border-brand-green-200 dark:border-brand-green-900 space-y-2">
                <span className="text-xs font-black text-brand-green-700 dark:text-brand-green-400 uppercase block">
                  12:30 PM – 03:30 PM: Optimal Exposure Window
                </span>
                <p className="text-xs text-foreground/80 leading-relaxed">
                  Solar thermal heating expands the atmospheric boundary layer up to 1,200 meters. Wind speeds increase, diluting particulate concentrations to daily minimums.
                </p>
                <div className="text-[11px] font-bold text-brand-green-600">
                  ✓ Safest slot for cross-ventilation, errands & light exercise.
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-orange-50/50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900 space-y-2">
                <span className="text-xs font-black text-orange-700 dark:text-orange-400 uppercase block">
                  06:00 PM – 10:00 PM: Evening Re-Compression
                </span>
                <p className="text-xs text-foreground/80 leading-relaxed">
                  Sunset cools the surface rapidly. Evening rush hour congestion coincides with boundary layer compression, causing sudden PM2.5 and NO2 spikes.
                </p>
                <div className="text-[11px] font-bold text-orange-600">
                  ⚠️ Close windows before sunset. Move sports indoors.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Activity Modal */}
      <CustomActivityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddCustomActivity}
      />
    </div>
  )
}
