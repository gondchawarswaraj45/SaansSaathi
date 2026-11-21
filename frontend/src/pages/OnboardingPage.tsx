import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, MapPin, CheckCircle, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import ThemeToggle from '@/components/common/ThemeToggle'

export default function OnboardingPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [selectedCity, setSelectedCity] = useState('Pune')
  const [familyName, setFamilyName] = useState('Sharma Family')

  const handleFinish = () => {
    toast.success('Family setup complete! Loading your dashboard…')
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4 py-12 relative transition-colors">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="max-w-xl w-full bg-card border border-border rounded-3xl p-8 shadow-xl">
        {/* Progress bar */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                step >= 1 ? 'bg-brand-green-600 text-white' : 'bg-muted text-muted-foreground'
              }`}
            >
              1
            </div>
            <span className="text-xs font-semibold">Location</span>
          </div>
          <div className="h-0.5 flex-1 mx-4 bg-border" />
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                step >= 2 ? 'bg-brand-green-600 text-white' : 'bg-muted text-muted-foreground'
              }`}
            >
              2
            </div>
            <span className="text-xs font-semibold">Family Setup</span>
          </div>
        </div>

        {step === 1 ? (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-brand-sky-100 dark:bg-brand-sky-950 text-brand-sky-600 dark:text-brand-sky-300 flex items-center justify-center mb-3">
                <MapPin className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold">Select Your Primary Location</h2>
              <p className="text-sm text-muted-foreground mt-1">
                We'll fetch nearest CPCB / OpenAQ monitoring stations for real-time readings.
              </p>
            </div>

            <div className="space-y-3">
              {['Delhi / NCR', 'Pune (Bavdhan & Pashan)', 'Mumbai (Andheri & Bandra)', 'Bangalore'].map(
                (city) => (
                  <button
                    key={city}
                    onClick={() => setSelectedCity(city)}
                    className={`w-full p-4 rounded-xl text-left border flex items-center justify-between transition-all ${
                      selectedCity.startsWith(city.split(' ')[0])
                        ? 'border-brand-green-600 bg-brand-green-50/60 dark:bg-brand-green-950/40 text-foreground font-semibold'
                        : 'border-border hover:bg-muted/50 text-muted-foreground'
                    }`}
                  >
                    <span>{city}</span>
                    {selectedCity.startsWith(city.split(' ')[0]) && (
                      <CheckCircle className="w-5 h-5 text-brand-green-600 dark:text-brand-green-400" />
                    )}
                  </button>
                )
              )}
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full py-3.5 rounded-xl bg-brand-green-600 text-white font-bold flex items-center justify-center gap-2 hover:bg-brand-green-700 transition-colors shadow-md"
            >
              Continue to Family Setup <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-brand-green-100 dark:bg-brand-green-950 text-brand-green-700 dark:text-brand-green-300 flex items-center justify-center mb-3">
                <Users className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold">Name Your Family Group</h2>
              <p className="text-sm text-muted-foreground mt-1">
                You can add individual family members (kids, seniors, asthmatic) on the next page.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                Family Group Name
              </label>
              <input
                type="text"
                value={familyName}
                onChange={(e) => setFamilyName(e.target.value)}
                placeholder="e.g., Sharma Family"
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-brand-green-600 focus:outline-none text-base"
              />
            </div>

            <button
              onClick={handleFinish}
              className="w-full py-3.5 rounded-xl bg-brand-green-600 text-white font-bold flex items-center justify-center gap-2 hover:bg-brand-green-700 transition-colors shadow-md"
            >
              Launch Dashboard <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
