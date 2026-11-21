import { useState } from 'react'
import {
  Flame,
  Wind,
  Filter,
  Sparkles,
  HeartHandshake,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Tag,
  BookOpen,
  DollarSign,
} from 'lucide-react'
import type { IndoorRecommendation } from '@/api/indoorApi'

interface Props {
  recommendation: IndoorRecommendation
}

export function IndoorRecommendationCard({ recommendation }: Props) {
  const [expanded, setExpanded] = useState(false)

  // Map category to icon and styling
  const getCategoryDetails = (category: string) => {
    switch (category) {
      case 'SOURCE_CONTROL':
        return {
          icon: Flame,
          label: 'Source Control',
          badgeClass: 'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400',
        }
      case 'VENTILATION':
        return {
          icon: Wind,
          label: 'Ventilation & Inversion',
          badgeClass: 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400',
        }
      case 'FILTRATION':
        return {
          icon: Filter,
          label: 'Air Filtration',
          badgeClass: 'bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-400',
        }
      case 'CLEANING':
        return {
          icon: Sparkles,
          label: 'Dust & Cleaning',
          badgeClass: 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400',
        }
      default:
        return {
          icon: HeartHandshake,
          label: 'Daily Habit',
          badgeClass: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400',
        }
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return 'bg-red-500 text-white animate-pulse'
      case 'HIGH':
        return 'bg-orange-500 text-white'
      case 'MEDIUM':
        return 'bg-amber-500 text-white'
      default:
        return 'bg-emerald-600 text-white'
    }
  }

  const { icon: CategoryIcon, label: categoryLabel, badgeClass } = getCategoryDetails(recommendation.category)

  return (
    <div className="bg-card border border-border rounded-2xl p-5 shadow-sm transition-all hover:border-brand-green-300">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${badgeClass}`}>
            <CategoryIcon className="w-3.5 h-3.5" />
            {categoryLabel}
          </span>
          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${getPriorityBadge(recommendation.priority)}`}>
            {recommendation.priority}
          </span>
        </div>

        <div className="flex items-center gap-1 text-xs font-bold text-brand-green-700 dark:text-brand-green-400 bg-brand-green-50 dark:bg-brand-green-950/40 px-2.5 py-1 rounded-lg">
          <DollarSign className="w-3.5 h-3.5" />
          {recommendation.estimatedCost}
        </div>
      </div>

      <h3 className="text-base font-bold text-foreground mb-1.5">{recommendation.title}</h3>
      <p className="text-xs text-muted-foreground leading-relaxed mb-3">{recommendation.recommendation}</p>

      {recommendation.impactDescription && (
        <div className="p-2.5 rounded-xl bg-muted/40 border border-border/50 text-[11px] text-muted-foreground mb-3 flex items-start gap-2">
          <span className="font-bold text-foreground shrink-0">Impact:</span>
          <span>{recommendation.impactDescription}</span>
        </div>
      )}

      {/* Action Steps Toggle */}
      {recommendation.actionSteps && recommendation.actionSteps.length > 0 && (
        <div className="pt-2 border-t border-border/60">
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="flex items-center justify-between w-full text-xs font-bold text-brand-green-600 hover:text-brand-green-700 transition-colors py-1"
          >
            <span>Actionable Implementation Steps ({recommendation.actionSteps.length})</span>
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {expanded && (
            <div className="mt-2.5 space-y-2 animate-fade-in">
              {recommendation.actionSteps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-foreground/90 bg-background p-2 rounded-lg border border-border">
                  <CheckCircle2 className="w-4 h-4 text-brand-green-600 shrink-0 mt-0.5" />
                  <span>{step}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {recommendation.source && (
        <div className="mt-3 pt-2 border-t border-dashed border-border/60 flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <BookOpen className="w-3 h-3 text-muted-foreground/80 shrink-0" />
          <span>Scientific Source: <span className="font-semibold text-foreground/80">{recommendation.source}</span></span>
        </div>
      )}
    </div>
  )
}
