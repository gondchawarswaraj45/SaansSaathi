import { useState } from 'react'
import { Home, Wind, Flame, CheckCircle2, ChevronRight, ChevronLeft, ShieldCheck, Sparkles } from 'lucide-react'
import type { IndoorAssessmentRequest } from '@/api/indoorApi'

interface Props {
  initialData?: Partial<IndoorAssessmentRequest>
  onSubmit: (data: IndoorAssessmentRequest) => void
  isSubmitting?: boolean
}

export function HomeAssessmentForm({ initialData, onSubmit, isSubmitting }: Props) {
  const [step, setStep] = useState(1)

  const [formData, setFormData] = useState<IndoorAssessmentRequest>({
    roomCount: initialData?.roomCount ?? 2,
    windowCount: initialData?.windowCount ?? 4,
    floorNumber: initialData?.floorNumber ?? 1,
    totalFloors: initialData?.totalFloors ?? 4,
    hasAirPurifier: initialData?.hasAirPurifier ?? false,
    hasExhaustFan: initialData?.hasExhaustFan ?? true,
    hasChimney: initialData?.hasChimney ?? false,
    cookingFuel: initialData?.cookingFuel ?? 'LPG',
    usesIncense: initialData?.usesIncense ?? false,
    usesMosquitoCoil: initialData?.usesMosquitoCoil ?? false,
    hasSmokingMember: initialData?.hasSmokingMember ?? false,
    budgetRupees: initialData?.budgetRupees ?? 1000,
    hasChildren: initialData?.hasChildren ?? false,
    hasSeniors: initialData?.hasSeniors ?? false,
    additionalNotes: initialData?.additionalNotes ?? '',
  })

  const handleNext = () => setStep((s) => Math.min(s + 1, 3))
  const handlePrev = () => setStep((s) => Math.max(s - 1, 1))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm">
      {/* Wizard Progress Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Step {step} of 3: {step === 1 ? 'Home Architecture' : step === 2 ? 'Air Devices & Ventilation' : 'Habits & Budget'}
          </span>
          <span className="text-xs font-semibold text-brand-green-600">
            {Math.round((step / 3) * 100)}% Complete
          </span>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-green-500 to-brand-green-600 transition-all duration-300 rounded-full"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {/* Step pills */}
        <div className="grid grid-cols-3 gap-2 mt-4 text-xs font-medium text-center">
          <button
            type="button"
            onClick={() => setStep(1)}
            className={`py-1.5 rounded-lg border transition-all ${
              step === 1
                ? 'bg-brand-green-50 text-brand-green-700 border-brand-green-300 font-bold'
                : 'bg-muted/40 text-muted-foreground border-transparent'
            }`}
          >
            1. Layout
          </button>
          <button
            type="button"
            onClick={() => setStep(2)}
            className={`py-1.5 rounded-lg border transition-all ${
              step === 2
                ? 'bg-brand-green-50 text-brand-green-700 border-brand-green-300 font-bold'
                : 'bg-muted/40 text-muted-foreground border-transparent'
            }`}
          >
            2. Appliances
          </button>
          <button
            type="button"
            onClick={() => setStep(3)}
            className={`py-1.5 rounded-lg border transition-all ${
              step === 3
                ? 'bg-brand-green-50 text-brand-green-700 border-brand-green-300 font-bold'
                : 'bg-muted/40 text-muted-foreground border-transparent'
            }`}
          >
            3. Habits
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* STEP 1: Home Layout */}
        {step === 1 && (
          <div className="space-y-5 animate-fade-in">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <Home className="w-5 h-5 text-brand-green-600" />
              <h3 className="font-bold text-base">Home Dimensions & Floor</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase">Number of Rooms</label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={formData.roomCount}
                  onChange={(e) => setFormData({ ...formData, roomCount: Number(e.target.value) })}
                  className="w-full mt-1.5 px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand-green-500"
                />
                <p className="text-[11px] text-muted-foreground mt-1">Bedrooms + living spaces</p>
              </div>

              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase">External Windows</label>
                <input
                  type="number"
                  min={0}
                  max={30}
                  value={formData.windowCount}
                  onChange={(e) => setFormData({ ...formData, windowCount: Number(e.target.value) })}
                  className="w-full mt-1.5 px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand-green-500"
                />
                <p className="text-[11px] text-muted-foreground mt-1">Windows facing streets or outdoors</p>
              </div>

              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase">Floor Level</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={formData.floorNumber}
                  onChange={(e) => setFormData({ ...formData, floorNumber: Number(e.target.value) })}
                  className="w-full mt-1.5 px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand-green-500"
                />
                <p className="text-[11px] text-muted-foreground mt-1">Ground floor is 0</p>
              </div>

              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase">Total Building Floors</label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={formData.totalFloors}
                  onChange={(e) => setFormData({ ...formData, totalFloors: Number(e.target.value) })}
                  className="w-full mt-1.5 px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand-green-500"
                />
                <p className="text-[11px] text-muted-foreground mt-1">Total floors in building/house</p>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl bg-brand-green-600 hover:bg-brand-green-700 text-white font-bold text-sm flex items-center gap-2 shadow-sm transition-all"
              >
                Next: Appliances <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Appliances & Ventilation */}
        {step === 2 && (
          <div className="space-y-5 animate-fade-in">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <Wind className="w-5 h-5 text-brand-green-600" />
              <h3 className="font-bold text-base">Purification & Kitchen Exhaust</h3>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl border border-border bg-muted/20 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold">Do you have an Air Purifier?</h4>
                  <p className="text-xs text-muted-foreground">Commercial HEPA or mechanical filter unit</p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, hasAirPurifier: true })}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      formData.hasAirPurifier
                        ? 'bg-brand-green-600 text-white shadow-sm'
                        : 'bg-background border border-border text-foreground hover:bg-muted'
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, hasAirPurifier: false })}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      !formData.hasAirPurifier
                        ? 'bg-brand-green-600 text-white shadow-sm'
                        : 'bg-background border border-border text-foreground hover:bg-muted'
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-border bg-muted/20 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold">Kitchen Exhaust Fan?</h4>
                  <p className="text-xs text-muted-foreground">Window or wall mounted ventilation fan</p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, hasExhaustFan: true })}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      formData.hasExhaustFan
                        ? 'bg-brand-green-600 text-white shadow-sm'
                        : 'bg-background border border-border text-foreground hover:bg-muted'
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, hasExhaustFan: false })}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      !formData.hasExhaustFan
                        ? 'bg-brand-green-600 text-white shadow-sm'
                        : 'bg-background border border-border text-foreground hover:bg-muted'
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-border bg-muted/20 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold">Electric Kitchen Chimney?</h4>
                  <p className="text-xs text-muted-foreground">Motorized hood directly over the cooktop</p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, hasChimney: true })}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      formData.hasChimney
                        ? 'bg-brand-green-600 text-white shadow-sm'
                        : 'bg-background border border-border text-foreground hover:bg-muted'
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, hasChimney: false })}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      !formData.hasChimney
                        ? 'bg-brand-green-600 text-white shadow-sm'
                        : 'bg-background border border-border text-foreground hover:bg-muted'
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={handlePrev}
                className="px-5 py-2.5 rounded-xl border border-border bg-background hover:bg-muted text-foreground font-bold text-sm flex items-center gap-2 transition-all"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl bg-brand-green-600 hover:bg-brand-green-700 text-white font-bold text-sm flex items-center gap-2 shadow-sm transition-all"
              >
                Next: Habits & Budget <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Habits & Risk Factors */}
        {step === 3 && (
          <div className="space-y-5 animate-fade-in">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <Flame className="w-5 h-5 text-brand-green-600" />
              <h3 className="font-bold text-base">Cooking Fuel, Smoke Sources & Budget</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase">Primary Cooking Fuel</label>
                <select
                  value={formData.cookingFuel}
                  onChange={(e) => setFormData({ ...formData, cookingFuel: e.target.value })}
                  className="w-full mt-1.5 px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand-green-500"
                >
                  <option value="LPG">LPG Cylinder / Piped Natural Gas (PNG)</option>
                  <option value="ELECTRIC">Electric Induction / Cooktop</option>
                  <option value="BIOMASS">Firewood / Cow Dung / Coal Chulha (High Risk)</option>
                  <option value="NONE">No Cooking Indoors</option>
                </select>
              </div>

              {/* Toggles for common Indian indoor emission sources */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <label className="p-3.5 rounded-xl border border-border bg-muted/20 flex items-start gap-3 cursor-pointer hover:bg-muted/40 transition-all">
                  <input
                    type="checkbox"
                    checked={formData.usesIncense}
                    onChange={(e) => setFormData({ ...formData, usesIncense: e.target.checked })}
                    className="mt-0.5 rounded text-brand-green-600 focus:ring-brand-green-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-foreground">Uses Agarbatti / Dhoop</span>
                    <p className="text-[11px] text-muted-foreground">Daily incense or camphor rituals</p>
                  </div>
                </label>

                <label className="p-3.5 rounded-xl border border-border bg-muted/20 flex items-start gap-3 cursor-pointer hover:bg-muted/40 transition-all">
                  <input
                    type="checkbox"
                    checked={formData.usesMosquitoCoil}
                    onChange={(e) => setFormData({ ...formData, usesMosquitoCoil: e.target.checked })}
                    className="mt-0.5 rounded text-brand-green-600 focus:ring-brand-green-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-foreground">Uses Mosquito Coils</span>
                    <p className="text-[11px] text-muted-foreground">Combustion coils lit overnight</p>
                  </div>
                </label>

                <label className="p-3.5 rounded-xl border border-border bg-muted/20 flex items-start gap-3 cursor-pointer hover:bg-muted/40 transition-all">
                  <input
                    type="checkbox"
                    checked={formData.hasSmokingMember}
                    onChange={(e) => setFormData({ ...formData, hasSmokingMember: e.target.checked })}
                    className="mt-0.5 rounded text-brand-green-600 focus:ring-brand-green-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-foreground">Smoking in Household</span>
                    <p className="text-[11px] text-muted-foreground">Cigarette or bidi consumption indoors</p>
                  </div>
                </label>

                <label className="p-3.5 rounded-xl border border-border bg-muted/20 flex items-start gap-3 cursor-pointer hover:bg-muted/40 transition-all">
                  <input
                    type="checkbox"
                    checked={formData.hasChildren || formData.hasSeniors}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        hasChildren: e.target.checked,
                        hasSeniors: e.target.checked,
                      })
                    }
                    className="mt-0.5 rounded text-brand-green-600 focus:ring-brand-green-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-foreground">Vulnerable Members</span>
                    <p className="text-[11px] text-muted-foreground">Children under 10 or seniors over 60</p>
                  </div>
                </label>
              </div>

              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase">
                  Available Improvement Budget (INR)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-1.5">
                  {[
                    { label: '₹0 (Free Hacks)', value: 0 },
                    { label: '₹1,000 (DIY Filter)', value: 1000 },
                    { label: '₹5,000 (Entry HEPA)', value: 5000 },
                    { label: '₹10,000+ (Full Setup)', value: 10000 },
                  ].map((tier) => (
                    <button
                      key={tier.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, budgetRupees: tier.value })}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition-all text-center ${
                        formData.budgetRupees === tier.value
                          ? 'bg-brand-green-50 border-brand-green-500 text-brand-green-800 shadow-sm'
                          : 'bg-background border-border text-foreground hover:bg-muted'
                      }`}
                    >
                      {tier.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase">
                  Additional Notes (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g., Living room opens into heavy traffic road..."
                  value={formData.additionalNotes || ''}
                  onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                  className="w-full mt-1.5 px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand-green-500"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={handlePrev}
                className="px-5 py-2.5 rounded-xl border border-border bg-background hover:bg-muted text-foreground font-bold text-sm flex items-center gap-2 transition-all"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-brand-green-600 hover:bg-brand-green-700 text-white font-bold text-sm flex items-center gap-2 shadow-sm transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>Evaluating Home...</>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" /> Generate Clean Air Protocol
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}
