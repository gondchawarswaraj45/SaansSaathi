import { Sparkles, ArrowRight, ShieldCheck, Bot } from 'lucide-react'
import { Link } from 'react-router-dom'

interface Props {
  currentAqi?: number
  city?: string
}

export function AIRecommendationCard({ currentAqi = 285, city = 'Delhi' }: Props) {
  // Context-aware dynamic advisory
  const getTip = () => {
    if (currentAqi > 300) {
      return {
        title: 'Severe Smog Advisory: Morning Inversion Active',
        advice:
          'Keep all windows sealed between 06:00 AM – 10:00 AM. Ground-level particulate soot is concentrated due to low wind velocities. Ensure children and seniors remain in the Clean Air Room.',
        action: 'View Sanctuary Protocol',
        link: '/indoor',
      }
    }
    if (currentAqi > 200) {
      return {
        title: 'High Winter Smog: Commute with N95 Respirators',
        advice:
          'Air quality is Poor. Outdoor aerobic workouts should be shifted to indoor stationary training. Use a kitchen exhaust fan for 15 minutes post-cooking to evacuate trapped NO2.',
        action: 'Ask AI Plan for My Family',
        link: '/chat',
      }
    }
    return {
      title: 'Satisfactory Air Quality: Good Time for Midday Ventilation',
      advice:
        'Current conditions allow cross-ventilation. Open windows for 30 minutes to refresh indoor oxygen levels before evening rush hour traffic begins.',
      action: 'Check 24-hr Forecast',
      link: '/dashboard',
    }
  }

  const tip = getTip()

  return (
    <div className="bg-gradient-to-br from-brand-green-500/10 via-brand-sky-500/5 to-transparent border border-brand-green-500/20 rounded-3xl p-5 sm:p-6 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-brand-green-700 dark:text-brand-green-400 font-bold text-xs">
          <Bot className="w-4 h-4 text-brand-green-600" />
          <span>SaansSaathi AI Daily Intelligence • {city}</span>
        </div>
        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-brand-green-100 dark:bg-brand-green-950 text-brand-green-800 dark:text-brand-green-300">
          AQI {currentAqi}
        </span>
      </div>

      <h3 className="text-sm sm:text-base font-bold text-foreground">{tip.title}</h3>
      <p className="text-xs text-muted-foreground leading-relaxed">{tip.advice}</p>

      <div className="pt-2 flex items-center justify-between border-t border-border/40">
        <span className="text-[10px] text-muted-foreground">
          ⚠️ Awareness only • Follows CPCB/NCDC guidelines
        </span>
        <Link
          to={tip.link}
          className="text-xs font-bold text-brand-green-600 hover:text-brand-green-700 flex items-center gap-1 transition-colors"
        >
          {tip.action} <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  )
}
