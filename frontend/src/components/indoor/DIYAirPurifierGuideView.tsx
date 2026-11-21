import { Wrench, ShieldAlert, Sparkles, Check, DollarSign, BookOpen, AlertOctagon } from 'lucide-react'
import type { DiyAirPurifierGuide } from '@/api/indoorApi'

interface Props {
  guide: DiyAirPurifierGuide
}

export function DIYAirPurifierGuideView({ guide }: Props) {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-purple-500/10 via-brand-green-500/5 to-transparent border border-purple-500/20 rounded-3xl p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 dark:bg-purple-950/60 rounded-2xl text-purple-600">
              <Wrench className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-foreground">{guide.title}</h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">{guide.subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-card border border-border px-4 py-2.5 rounded-2xl shadow-sm text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                Total Build Cost
              </span>
              <span className="text-base font-extrabold text-brand-green-600">{guide.estimatedCost}</span>
            </div>
            <div className="bg-card border border-border px-4 py-2.5 rounded-2xl shadow-sm text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                PM2.5 Removal
              </span>
              <span className="text-base font-extrabold text-purple-600">{guide.filtrationEfficiency}</span>
            </div>
          </div>
        </div>

        <div className="bg-background/80 p-4 rounded-2xl border border-border/50 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-foreground">
            <Sparkles className="w-4 h-4 text-purple-600" /> Scientific Validation (US EPA Chamber Testing)
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">{guide.scientificValidation}</p>
          <div className="text-[11px] text-muted-foreground/80 flex items-center gap-1.5 pt-1">
            <BookOpen className="w-3.5 h-3.5 text-muted-foreground" />
            <span>Citation: <strong className="text-foreground/80">{guide.officialCitation}</strong></span>
          </div>
        </div>
      </div>

      {/* Required Materials Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-brand-green-600" />
            Required Bill of Materials ({guide.materials.length} Items)
          </h3>
          <span className="text-xs font-semibold text-brand-green-700 bg-brand-green-100 px-2.5 py-1 rounded-full">
            ~80% cheaper than commercial HEPA purifiers
          </span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/60 text-muted-foreground font-bold uppercase text-[10px] border-b border-border">
              <tr>
                <th className="px-4 py-3">Material Component</th>
                <th className="px-4 py-3">Specification & Dimensions</th>
                <th className="px-4 py-3">Approx Cost</th>
                <th className="px-4 py-3">Importance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {guide.materials.map((mat, idx) => (
                <tr key={idx} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-bold text-foreground">{mat.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{mat.specification}</td>
                  <td className="px-4 py-3 font-semibold text-brand-green-600">{mat.approximateCost}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        mat.isEssential
                          ? 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {mat.isEssential ? 'Essential' : 'Optional Upgrade'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Step by Step Assembly Instructions */}
      <div className="space-y-4">
        <h3 className="text-base font-bold flex items-center gap-2">
          <Wrench className="w-5 h-5 text-purple-600" /> Step-by-Step Assembly Instructions
        </h3>

        <div className="grid grid-cols-1 gap-3.5">
          {guide.steps.map((st) => (
            <div key={st.stepNumber} className="p-4 sm:p-5 rounded-2xl border border-border bg-card shadow-sm">
              <div className="flex items-start gap-3.5">
                <div className="w-7 h-7 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-extrabold flex items-center justify-center shrink-0 text-xs">
                  {st.stepNumber}
                </div>
                <div className="flex-1 space-y-1">
                  <h4 className="text-sm font-bold text-foreground">{st.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{st.instructions}</p>
                  {st.tip && (
                    <div className="mt-2 text-[11px] text-purple-800 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/30 p-2 rounded-lg font-medium">
                      💡 Pro-Tip: {st.tip}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Safety Precautions & Callouts */}
      <div className="p-6 rounded-3xl border border-amber-300 bg-amber-50/60 dark:bg-amber-950/20 space-y-3">
        <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300 font-bold text-sm">
          <AlertOctagon className="w-5 h-5 text-amber-600 shrink-0" />
          Critical Fire & Electrical Safety Guidelines
        </div>
        <ul className="space-y-2 text-xs text-amber-900/90 dark:text-amber-200/90">
          {guide.safetyPrecautions.map((safe, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-amber-600 font-bold shrink-0">•</span>
              <span>{safe}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
