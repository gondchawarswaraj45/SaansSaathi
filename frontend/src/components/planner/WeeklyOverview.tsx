import { Calendar, TrendingUp, CheckCircle, BarChart3, Sun } from 'lucide-react'
import type { WeeklyOverviewData } from '@/api/plannerApi'

interface Props {
  data: WeeklyOverviewData
}

export function WeeklyOverview({ data }: Props) {
  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'GOOD':
        return 'text-aqi-good bg-aqi-good/10 border-aqi-good/30'
      case 'SATISFACTORY':
        return 'text-aqi-satisfactory bg-aqi-satisfactory/10 border-aqi-satisfactory/30'
      case 'MODERATE':
        return 'text-aqi-moderate bg-aqi-moderate/10 border-aqi-moderate/30'
      case 'POOR':
        return 'text-aqi-poor bg-aqi-poor/10 border-aqi-poor/30'
      case 'VERY_POOR':
        return 'text-aqi-verypoor bg-aqi-verypoor/10 border-aqi-verypoor/30'
      default:
        return 'text-aqi-severe bg-aqi-severe/10 border-aqi-severe/30'
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-card border border-border shadow-sm space-y-1">
          <span className="text-xs font-bold text-muted-foreground uppercase">7-Day Compliance</span>
          <div className="text-2xl font-black text-brand-green-600">
            {data.overallComplianceScore}%
          </div>
          <p className="text-[11px] text-muted-foreground">
            {data.totalActivitiesCompleted} exposure-reduction routines completed
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border shadow-sm space-y-1">
          <span className="text-xs font-bold text-muted-foreground uppercase">Average Week AQI</span>
          <div className="text-2xl font-black text-foreground">
            {data.averageAqi}
          </div>
          <p className="text-[11px] text-muted-foreground">
            Typical Indian winter inversion condition
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border shadow-sm space-y-1">
          <span className="text-xs font-bold text-muted-foreground uppercase">Best Daily Outdoor Slot</span>
          <div className="text-base font-extrabold text-brand-sky-600 flex items-center gap-1.5 mt-1">
            <Sun className="w-4 h-4" /> 1:00 PM – 3:30 PM
          </div>
          <p className="text-[11px] text-muted-foreground">
            Consistent diurnal solar mixing window
          </p>
        </div>
      </div>

      {/* 7-Day Visual Cards Bar */}
      <div className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-brand-green-600" />
          7-Day Routine Compliance Timeline
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-7 gap-3 pt-2">
          {data.days.map((day, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl border border-border bg-muted/20 flex flex-col justify-between space-y-3 text-center"
            >
              <div>
                <span className="text-xs font-black text-foreground block">{day.dayOfWeek}</span>
                <span className="text-[10px] text-muted-foreground block">{day.date}</span>
              </div>

              <div>
                <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full border inline-block ${getCategoryColor(day.aqiCategory)}`}>
                  AQI {day.aqi}
                </span>
              </div>

              <div className="space-y-1">
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-green-600 rounded-full"
                    style={{ width: `${day.compliancePercentage}%` }}
                  />
                </div>
                <span className="text-[10px] font-bold text-brand-green-700 dark:text-brand-green-400 block">
                  {day.compliancePercentage}% ({day.completedActivities}/{day.totalActivities})
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
