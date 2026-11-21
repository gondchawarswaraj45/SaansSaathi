import { useState, useEffect } from 'react'
import {
  Home,
  ShieldCheck,
  Wrench,
  TrendingDown,
  Sparkles,
  ClipboardCheck,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react'
import toast from 'react-hot-toast'
import BackButton from '@/components/common/BackButton'
import {
  indoorApi,
  type IndoorAssessmentRequest,
  type IndoorAssessmentResponse,
  type IndoorRecommendation,
  type CleanAirRoomGuide,
  type DiyAirPurifierGuide,
} from '@/api/indoorApi'
import { HomeAssessmentForm } from '@/components/indoor/HomeAssessmentForm'
import { IndoorRecommendationCard } from '@/components/indoor/IndoorRecommendationCard'
import { CleanAirRoomGuideView } from '@/components/indoor/CleanAirRoomGuideView'
import { DIYAirPurifierGuideView } from '@/components/indoor/DIYAirPurifierGuideView'
import { OutdoorVsIndoorWidget } from '@/components/indoor/OutdoorVsIndoorWidget'

export default function IndoorPage() {
  const [activeTab, setActiveTab] = useState<'assessment' | 'recommendations' | 'clean-air' | 'diy' | 'comparison'>('assessment')

  const [assessment, setAssessment] = useState<IndoorAssessmentResponse | null>(null)
  const [recommendations, setRecommendations] = useState<IndoorRecommendation[]>([])
  const [cleanAirGuide, setCleanAirGuide] = useState<CleanAirRoomGuide | null>(null)
  const [diyGuide, setDiyGuide] = useState<DiyAirPurifierGuide | null>(null)

  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch initial guides and existing assessment
  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      try {
        const [assessRes, cleanRes, diyRes] = await Promise.all([
          indoorApi.getLatestAssessment().catch(() => null),
          indoorApi.getCleanAirRoomGuide().catch(() => null),
          indoorApi.getDIYAirPurifierGuide().catch(() => null),
        ])

        if (assessRes) {
          setAssessment(assessRes)
          if (assessRes.recommendations && assessRes.recommendations.length > 0) {
            setRecommendations(assessRes.recommendations)
          }
        }

        if (cleanRes) setCleanAirGuide(cleanRes)
        if (diyRes) setDiyGuide(diyRes)
      } catch (err) {
        console.error('Failed to load indoor data', err)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  const handleSubmitAssessment = async (data: IndoorAssessmentRequest) => {
    setIsSubmitting(true)
    try {
      const response = await indoorApi.saveAssessment(data)
      setAssessment(response)
      setRecommendations(response.recommendations || [])
      toast.success('Indoor Assessment Evaluated & Protocol Generated!')
      setActiveTab('recommendations')
    } catch (err) {
      console.error('Failed to save assessment', err)
      toast.error('Failed to process assessment. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="page-container space-y-8 animate-fade-in pb-12">
      <BackButton />
      {/* Page Header */}
      <div className="pb-4 border-b border-border flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
            <Home className="w-7 h-7 text-brand-green-600" />
            Indoor Air Quality Assistant
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl">
            Did you know? Indoor air in Indian homes during winter smog can be 2–5× more toxic than outdoor air due
            to trapped cooking aerosols, incense smoke, and poor air exchange.
          </p>
        </div>

        {assessment && (
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                assessment.riskLevel === 'CRITICAL'
                  ? 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400'
                  : assessment.riskLevel === 'HIGH'
                  ? 'bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-400'
                  : 'bg-brand-green-100 text-brand-green-700 dark:bg-brand-green-950/60 dark:text-brand-green-400'
              }`}
            >
              Indoor Risk: {assessment.riskLevel}
            </span>
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 bg-muted/60 rounded-2xl overflow-x-auto text-xs font-bold border border-border">
        <button
          onClick={() => setActiveTab('assessment')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl whitespace-nowrap transition-all ${
            activeTab === 'assessment'
              ? 'bg-card text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <ClipboardCheck className="w-4 h-4 text-brand-green-600" /> Home Assessment
        </button>

        <button
          onClick={() => setActiveTab('recommendations')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl whitespace-nowrap transition-all ${
            activeTab === 'recommendations'
              ? 'bg-card text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Sparkles className="w-4 h-4 text-brand-green-600" /> Recommendations
          {recommendations.length > 0 && (
            <span className="ml-1 px-1.5 py-0.2 bg-brand-green-100 text-brand-green-800 text-[10px] rounded-full">
              {recommendations.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('clean-air')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl whitespace-nowrap transition-all ${
            activeTab === 'clean-air'
              ? 'bg-card text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-brand-sky-600" /> Clean Air Room Blueprint
        </button>

        <button
          onClick={() => setActiveTab('diy')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl whitespace-nowrap transition-all ${
            activeTab === 'diy'
              ? 'bg-card text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Wrench className="w-4 h-4 text-purple-600" /> DIY Box Fan Purifier
        </button>

        <button
          onClick={() => setActiveTab('comparison')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl whitespace-nowrap transition-all ${
            activeTab === 'comparison'
              ? 'bg-card text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <TrendingDown className="w-4 h-4 text-emerald-600" /> Outdoor vs Indoor
        </button>
      </div>

      {/* TAB 1: Assessment Form */}
      {activeTab === 'assessment' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7">
            <HomeAssessmentForm
              initialData={assessment || undefined}
              onSubmit={handleSubmitAssessment}
              isSubmitting={isSubmitting}
            />
          </div>

          <div className="lg:col-span-5 space-y-5">
            <div className="p-6 rounded-3xl bg-gradient-to-br from-brand-green-500/10 via-brand-sky-500/5 to-transparent border border-brand-green-500/20 space-y-3">
              <div className="flex items-center gap-2 text-brand-green-800 dark:text-brand-green-300 font-bold text-sm">
                <Sparkles className="w-5 h-5 text-brand-green-600" />
                Why Indoor Source Control Matters
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                During north Indian winter smog, high outdoor particulate levels are aggravated by indoor cooking
                fumes (tadka), agarbatti incense, and mosquito coils. In an unvented room, these sources can easily drive
                indoor PM2.5 past 500 µg/m³.
              </p>
              <div className="pt-2 text-xs font-semibold text-foreground/90 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-brand-green-600">✓</span> Evidence-based solutions for every budget tier
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-brand-green-600">✓</span> Inversion-aware ventilation timing guidance
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-brand-green-600">✓</span> Zero-cost behavioral modifications
                </div>
              </div>
            </div>

            {assessment && recommendations.length > 0 && (
              <div className="p-5 rounded-2xl bg-card border border-border space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Previous Assessment Summary
                  </h4>
                  <button
                    onClick={() => setActiveTab('recommendations')}
                    className="text-xs font-bold text-brand-green-600 hover:underline"
                  >
                    View All {recommendations.length} Steps →
                  </button>
                </div>
                <div className="space-y-2">
                  {recommendations.slice(0, 3).map((rec) => (
                    <div key={rec.id} className="text-xs p-2.5 rounded-xl bg-muted/40 border border-border/50">
                      <div className="font-bold text-foreground">{rec.title}</div>
                      <div className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">{rec.recommendation}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Recommendations List */}
      {activeTab === 'recommendations' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-foreground">
                Tailored Clean Air Recommendations ({recommendations.length})
              </h2>
              <p className="text-xs text-muted-foreground">
                Ranked by health urgency and cost-effectiveness based on your home setup
              </p>
            </div>

            <button
              onClick={() => setActiveTab('assessment')}
              className="text-xs font-bold text-brand-green-600 hover:text-brand-green-700 flex items-center gap-1.5 bg-muted/50 px-3 py-1.5 rounded-xl border border-border"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Re-take Assessment
            </button>
          </div>

          {recommendations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendations.map((rec) => (
                <IndoorRecommendationCard key={rec.id} recommendation={rec} />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center rounded-3xl bg-card border border-border space-y-3">
              <ClipboardCheck className="w-12 h-12 text-muted-foreground mx-auto" />
              <h3 className="text-base font-bold text-foreground">No Assessment Evaluated Yet</h3>
              <p className="text-xs text-muted-foreground max-w-md mx-auto">
                Complete the 1-minute home assessment form to generate an evidence-based indoor protection protocol.
              </p>
              <button
                onClick={() => setActiveTab('assessment')}
                className="mt-2 px-5 py-2 rounded-xl bg-brand-green-600 text-white font-bold text-xs"
              >
                Start Assessment
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Clean Air Room Blueprint */}
      {activeTab === 'clean-air' && cleanAirGuide && (
        <CleanAirRoomGuideView guide={cleanAirGuide} />
      )}

      {/* TAB 4: DIY Air Purifier Guide */}
      {activeTab === 'diy' && diyGuide && (
        <DIYAirPurifierGuideView guide={diyGuide} />
      )}

      {/* TAB 5: Outdoor vs Indoor Comparison */}
      {activeTab === 'comparison' && (
        <div className="space-y-6">
          <OutdoorVsIndoorWidget
            outdoorAqi={285}
            indoorHazardScore={assessment?.estimatedIndoorAqiScore ?? 45}
            hasPurifier={assessment?.hasAirPurifier ?? false}
            usesIncenseOrCoils={assessment?.usesIncense || assessment?.usesMosquitoCoil}
          />

          <div className="p-6 rounded-3xl bg-card border border-border space-y-4">
            <h3 className="text-base font-bold text-foreground">Key Scientific Findings on Indoor Smog Exposure</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-muted/30 border border-border/60 space-y-1">
                <span className="font-extrabold text-foreground block">Agarbatti & Dhoop</span>
                <p className="text-muted-foreground leading-relaxed">
                  Generates massive fine particle concentrations (up to 400 µg/m³) and volatile benzene that settle slowly in still winter air.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-muted/30 border border-border/60 space-y-1">
                <span className="font-extrabold text-foreground block">Morning Inversion Trapping</span>
                <p className="text-muted-foreground leading-relaxed">
                  Opening windows between 6 AM and 9 AM draws in cold ground-layer smog containing high industrial and traffic soot.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-muted/30 border border-border/60 space-y-1">
                <span className="font-extrabold text-foreground block">Sanctuary Room Efficacy</span>
                <p className="text-muted-foreground leading-relaxed">
                  Sealing door undercuts and operating one MERV-13/HEPA unit consistently lowers bedroom PM2.5 by 75–85%.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
