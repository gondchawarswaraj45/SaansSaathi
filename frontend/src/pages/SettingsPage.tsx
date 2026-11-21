import { useState } from 'react'
import { Settings, Shield, Bell, Moon, MapPin } from 'lucide-react'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const [threshold, setThreshold] = useState(200)
  const [morningBriefing, setMorningBriefing] = useState(true)
  const [emailAlerts, setEmailAlerts] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success('Preferences saved successfully!')
  }

  return (
    <div className="page-container max-w-2xl space-y-6 animate-fade-in">
      <div className="pb-2 border-b border-border">
        <h1 className="text-2xl font-bold tracking-tight">Application Preferences</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Customize alert sensitivity, notification channels, and display options.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 bg-card border border-border p-6 rounded-3xl shadow-sm">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase">
              AQI Alert Threshold
            </label>
            <p className="text-xs text-muted-foreground mb-2">
              Receive alert whenever AQI in your primary area crosses this value.
            </p>
            <select
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm"
            >
              <option value={100}>100 (Moderate - Sensitive users)</option>
              <option value={200}>200 (Poor - General population)</option>
              <option value={300}>300 (Very Poor - Severe smog)</option>
              <option value={400}>400 (Severe - Emergency only)</option>
            </select>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div>
              <div className="text-sm font-semibold">Morning Air Quality Briefing</div>
              <div className="text-xs text-muted-foreground">
                Get a 7:00 AM daily summary with safe outdoor exercise windows.
              </div>
            </div>
            <input
              type="checkbox"
              checked={morningBriefing}
              onChange={(e) => setMorningBriefing(e.target.checked)}
              className="w-4 h-4 accent-brand-green-600 rounded"
            />
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div>
              <div className="text-sm font-semibold">Email Notification Reports</div>
              <div className="text-xs text-muted-foreground">
                Weekly family air exposure summary report sent to email.
              </div>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="w-4 h-4 accent-brand-green-600 rounded"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-brand-green-600 hover:bg-brand-green-700 text-white font-bold text-sm shadow-md transition-all"
        >
          Save Preferences
        </button>
      </form>
    </div>
  )
}
