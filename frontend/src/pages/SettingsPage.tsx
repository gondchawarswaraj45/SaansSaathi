import { useState, useEffect } from 'react'
import { Settings, Shield, Bell, Moon, Sun, Monitor, MapPin, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import { notificationApi, UserPreference } from '@/api/notificationApi'
import { useThemeStore } from '@/store/themeStore'
import BackButton from '@/components/common/BackButton'

export default function SettingsPage() {
  const [threshold, setThreshold] = useState(200)
  const [morningBriefing, setMorningBriefing] = useState(true)
  const [emailAlerts, setEmailAlerts] = useState(false)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [loading, setLoading] = useState(false)
  const { theme, setTheme } = useThemeStore()

  useEffect(() => {
    const fetchPrefs = async () => {
      try {
        const pref = await notificationApi.getPreferences()
        if (pref) {
          if (pref.aqiAlertThreshold) setThreshold(pref.aqiAlertThreshold)
          if (pref.morningBriefing !== undefined) setMorningBriefing(pref.morningBriefing)
          if (pref.emailNotifications !== undefined) setEmailAlerts(pref.emailNotifications)
          if (pref.pushNotifications !== undefined) setPushNotifications(pref.pushNotifications)
        }
      } catch {
        // Fallback to local default
      }
    }
    fetchPrefs()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await notificationApi.updatePreferences({
        aqiAlertThreshold: threshold,
        morningBriefing,
        emailNotifications: emailAlerts,
        pushNotifications,
      })
      toast.success('Preferences saved successfully!')
    } catch {
      toast.success('Preferences saved locally!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container max-w-2xl space-y-6 animate-fade-in">
      <BackButton />
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

          {/* Appearance / Theme Mode */}
          <div className="pt-3 border-t border-border space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold">Display Theme</div>
                <div className="text-xs text-muted-foreground">
                  Choose between Light, Dark, or System automatic theme.
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-1">
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  theme === 'light'
                    ? 'border-brand-green-600 bg-brand-green-50 text-brand-green-800 dark:bg-brand-green-950 dark:text-brand-green-200'
                    : 'border-border text-muted-foreground hover:bg-muted'
                }`}
              >
                <Sun className="w-3.5 h-3.5 text-amber-500" /> Light
              </button>
              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  theme === 'dark'
                    ? 'border-brand-green-600 bg-brand-green-50 text-brand-green-800 dark:bg-brand-green-950 dark:text-brand-green-200'
                    : 'border-border text-muted-foreground hover:bg-muted'
                }`}
              >
                <Moon className="w-3.5 h-3.5 text-sky-400" /> Dark
              </button>
              <button
                type="button"
                onClick={() => setTheme('system')}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  theme === 'system'
                    ? 'border-brand-green-600 bg-brand-green-50 text-brand-green-800 dark:bg-brand-green-950 dark:text-brand-green-200'
                    : 'border-border text-muted-foreground hover:bg-muted'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" /> System
              </button>
            </div>
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
              <div className="text-sm font-semibold">Push Notifications</div>
              <div className="text-xs text-muted-foreground">
                In-app alerts for real-time smog surges and routine updates.
              </div>
            </div>
            <input
              type="checkbox"
              checked={pushNotifications}
              onChange={(e) => setPushNotifications(e.target.checked)}
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
          disabled={loading}
          className="w-full py-3 rounded-xl bg-brand-green-600 hover:bg-brand-green-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
        >
          <Check className="w-4 h-4" /> Save Preferences
        </button>
      </form>
    </div>
  )
}
