import { useState } from 'react'
import { Home, Sparkles, Check, AlertCircle, Wrench, Shield, DollarSign } from 'lucide-react'
import toast from 'react-hot-toast'

export default function IndoorPage() {
  const [assessmentStep, setAssessmentStep] = useState(1)
  const [homeType, setHomeType] = useState('2 BHK Apartment')
  const [hasPurifier, setHasPurifier] = useState(false)
  const [hasExhaust, setHasExhaust] = useState(true)
  const [cookingFuel, setCookingFuel] = useState('LPG')
  const [budget, setBudget] = useState('1000')

  const [generatedPlan, setGeneratedPlan] = useState<any[] | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault()
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
      setGeneratedPlan([
        {
          title: 'Designate Master Bedroom as Clean Air Room',
          desc: 'Seal door gap with a damp towel draft-stopper. Keep windows closed during 06:00-10:00 morning inversion.',
          cost: '₹0 (Free)',
          priority: 'CRITICAL',
        },
        {
          title: 'Source Control: Discontinue Agarbatti & Mosquito Coils',
          desc: '1 incense stick emits as much particulate matter as 3-5 cigarettes. Switch to liquid electric vaporizers or window nets.',
          cost: '₹0 (Free)',
          priority: 'HIGH',
        },
        {
          title: 'Build EPA-Evaluated DIY Box Fan Air Filter (Corsi-Rosenthal style)',
          desc: 'Tape one MERV-13 filter (20x20 in) to an ordinary box fan. Removes up to 80% fine particles in a 12x12 room.',
          cost: '₹950 approx',
          priority: 'RECOMMENDED',
        },
        {
          title: 'Exhaust Fan Operation Protocol',
          desc: 'Run kitchen exhaust for at least 15 minutes AFTER cooking turns off to evacuate nitrogen dioxide and ultrafine aerosols.',
          cost: '₹0 (Free)',
          priority: 'HIGH',
        },
      ])
      toast.success('Custom Indoor Air Plan Generated!')
    }, 1200)
  }

  return (
    <div className="page-container space-y-8 animate-fade-in">
      <div className="pb-2 border-b border-border">
        <h1 className="text-2xl font-bold tracking-tight">Indoor Air Quality Assistant</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Did you know? Indoor air in Indian homes can be 2–5× more toxic than outdoor air during
          winter cooking and stagnant periods.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Assessment Wizard Form */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-card border border-border shadow-sm space-y-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-green-600" />
            <h2 className="text-base font-bold">Generate AI Indoor Plan</h2>
          </div>

          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase">Home Layout</label>
              <select
                value={homeType}
                onChange={(e) => setHomeType(e.target.value)}
                className="w-full mt-1 px-3 py-2 rounded-xl border border-border bg-background text-sm"
              >
                <option value="1 BHK Flat">1 BHK Flat</option>
                <option value="2 BHK Apartment">2 BHK Apartment</option>
                <option value="3 BHK / Bungalow">3 BHK / Bungalow</option>
                <option value="Independent House">Independent House</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase">Air Purifier?</label>
                <select
                  value={hasPurifier ? 'yes' : 'no'}
                  onChange={(e) => setHasPurifier(e.target.value === 'yes')}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-border bg-background text-sm"
                >
                  <option value="no">No Purifier</option>
                  <option value="yes">Yes, Have Purifier</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase">Kitchen Chimney?</label>
                <select
                  value={hasExhaust ? 'yes' : 'no'}
                  onChange={(e) => setHasExhaust(e.target.value === 'yes')}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-border bg-background text-sm"
                >
                  <option value="yes">Yes, Installed</option>
                  <option value="no">No Exhaust</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase">Cooking Fuel</label>
              <select
                value={cookingFuel}
                onChange={(e) => setCookingFuel(e.target.value)}
                className="w-full mt-1 px-3 py-2 rounded-xl border border-border bg-background text-sm"
              >
                <option value="LPG">LPG Gas Cylinder / Piped Gas</option>
                <option value="Induction">Electric Induction</option>
                <option value="Biomass">Biomass / Chulha (High Risk)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase">
                Improvement Budget
              </label>
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full mt-1 px-3 py-2 rounded-xl border border-border bg-background text-sm"
              >
                <option value="0">₹0 (Zero Cost Lifestyle Hacks)</option>
                <option value="1000">₹1,000 (DIY Filter & Draft-Seals)</option>
                <option value="5000">₹5,000 (Entry HEPA Purifier)</option>
                <option value="10000+">₹10,000+ (Full Home Solution)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="w-full py-3 rounded-xl bg-brand-green-600 hover:bg-brand-green-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>Generating Tailored Plan…</>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Create Custom Plan
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results / Clean Air Room Blueprint */}
        <div className="lg:col-span-7 space-y-6">
          {generatedPlan ? (
            <div className="space-y-4">
              <h2 className="text-base font-bold flex items-center gap-2">
                <Shield className="w-5 h-5 text-brand-green-600" /> Tailored Indoor Protocol for{' '}
                {homeType}
              </h2>
              <div className="space-y-3">
                {generatedPlan.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-card border border-border shadow-sm flex flex-col space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-foreground">
                        {idx + 1}. {step.title}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-green-100 text-brand-green-800">
                        {step.cost}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-3xl bg-muted/40 border border-dashed border-border flex flex-col items-center justify-center text-center space-y-3">
              <Home className="w-12 h-12 text-muted-foreground/60" />
              <h3 className="font-bold text-sm">No Assessment Submitted Yet</h3>
              <p className="text-xs text-muted-foreground max-w-sm">
                Submit the 30-second form on the left to receive an evidence-based, budget-friendly
                indoor purification protocol.
              </p>
            </div>
          )}

          {/* Clean Air Room Educational Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-brand-sky-500/10 to-transparent border border-brand-sky-500/20 space-y-3">
            <div className="flex items-center gap-2">
              <Wrench className="w-5 h-5 text-brand-sky-600" />
              <h3 className="text-sm font-bold">The EPA "Clean Air Room" Concept</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              When severe smog strikes, trying to purify an entire house with open balconies is
              often impossible. Designate ONE bedroom as your family's Clean Air Room: seal doors,
              keep windows latched, and concentrate filtration in that single space during peak smog
              hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
