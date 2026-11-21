import { useState } from 'react'
import { ShieldCheck, Check, AlertTriangle, Info, BedDouble, Wind, CheckCircle2 } from 'lucide-react'
import type { CleanAirRoomGuide } from '@/api/indoorApi'

interface Props {
  guide: CleanAirRoomGuide
}

export function CleanAirRoomGuideView({ guide }: Props) {
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({})

  const toggleStep = (stepNum: number) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [stepNum]: !prev[stepNum],
    }))
  }

  const completedCount = Object.values(completedSteps).filter(Boolean).length
  const totalSteps = guide.setupSteps.length
  const progressPercent = Math.round((completedCount / totalSteps) * 100)

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-brand-sky-500/10 via-brand-green-500/5 to-transparent border border-brand-sky-500/20 rounded-3xl p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-brand-sky-100 dark:bg-brand-sky-950/60 rounded-2xl text-brand-sky-600">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-foreground">{guide.title}</h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">{guide.subtitle}</p>
            </div>
          </div>

          <div className="bg-card border border-border px-4 py-3 rounded-2xl shadow-sm text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
              Sanctuary Readiness
            </span>
            <span className="text-lg font-black text-brand-green-600">{progressPercent}% Ready</span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed bg-background/60 p-4 rounded-2xl border border-border/40">
          <Info className="w-4 h-4 text-brand-sky-600 inline mr-1.5 -mt-0.5" />
          {guide.rationale}
        </p>
      </div>

      {/* Interactive Step-by-Step Checklist */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold flex items-center gap-2">
            <BedDouble className="w-5 h-5 text-brand-green-600" />
            5-Step Setup Checklist ({completedCount}/{totalSteps} Done)
          </h3>
          <span className="text-xs text-muted-foreground">Click step to mark ready</span>
        </div>

        <div className="grid grid-cols-1 gap-3.5">
          {guide.setupSteps.map((step) => {
            const isDone = !!completedSteps[step.stepNumber]
            return (
              <div
                key={step.stepNumber}
                onClick={() => toggleStep(step.stepNumber)}
                className={`p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all ${
                  isDone
                    ? 'bg-brand-green-50/70 border-brand-green-300 dark:bg-brand-green-950/20 dark:border-brand-green-800'
                    : 'bg-card border-border hover:border-brand-green-200'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      isDone
                        ? 'bg-brand-green-600 text-white'
                        : 'border-2 border-muted-foreground/40 text-muted-foreground'
                    }`}
                  >
                    {isDone ? <Check className="w-3.5 h-3.5" /> : <span className="text-xs font-bold">{step.stepNumber}</span>}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className={`text-sm font-bold ${isDone ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                        {step.title}
                      </h4>
                      {isDone && (
                        <span className="text-[10px] font-bold text-brand-green-700 bg-brand-green-100 px-2 py-0.5 rounded-full">
                          Ready
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{step.description}</p>
                    {step.tip && (
                      <div className="mt-2 text-[11px] text-brand-sky-700 dark:text-brand-sky-300 bg-brand-sky-50 dark:bg-brand-sky-950/40 p-2 rounded-lg font-medium">
                        💡 Tip: {step.tip}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Air Purifier Sizing Table */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Wind className="w-5 h-5 text-brand-green-600" />
          <h3 className="text-base font-bold">Purifier Sizing Matrix (CADR by Room Area)</h3>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/60 text-muted-foreground font-bold uppercase text-[10px] border-b border-border">
              <tr>
                <th className="px-4 py-3">Room Type</th>
                <th className="px-4 py-3">Floor Area</th>
                <th className="px-4 py-3">Required CADR</th>
                <th className="px-4 py-3">Air Changes (ACH)</th>
                <th className="px-4 py-3">Purifier Specification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {guide.sizingTable.map((row, idx) => (
                <tr key={idx} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-bold text-foreground">{row.roomCategory}</td>
                  <td className="px-4 py-3 text-muted-foreground">{row.roomArea}</td>
                  <td className="px-4 py-3 font-semibold text-brand-green-600">{row.requiredCadr}</td>
                  <td className="px-4 py-3 text-muted-foreground">{row.airChangesPerHour}</td>
                  <td className="px-4 py-3 text-foreground font-medium">{row.recommendedType}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sanctuary Do's and Don'ts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl border border-brand-green-200 bg-brand-green-50/40 dark:bg-brand-green-950/10 space-y-3">
          <h4 className="text-sm font-bold text-brand-green-800 dark:text-brand-green-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-brand-green-600" /> Sanctuary Rules (Do)
          </h4>
          <ul className="space-y-2 text-xs text-foreground/80">
            {guide.doItems.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-brand-green-600 font-bold">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-5 rounded-2xl border border-red-200 bg-red-50/40 dark:bg-red-950/10 space-y-3">
          <h4 className="text-sm font-bold text-red-800 dark:text-red-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600" /> Never Do Inside Sanctuary (Don't)
          </h4>
          <ul className="space-y-2 text-xs text-foreground/80">
            {guide.dontItems.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-red-600 font-bold">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
