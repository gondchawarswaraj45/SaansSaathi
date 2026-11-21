import React, { useState, useEffect } from 'react'
import {
  Bell,
  AlertTriangle,
  Users,
  Sun,
  Home,
  Trophy,
  CheckCheck,
  Sliders,
  Sparkles,
  ExternalLink,
  ShieldAlert,
  Clock,
  ArrowRight,
  Filter,
  Check,
} from 'lucide-react'
import { notificationApi, NotificationItem, UserPreference } from '@/api/notificationApi'
import { formatDistanceToNow } from 'date-fns'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import BackButton from '@/components/common/BackButton'

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'ALL' | 'UNREAD' | 'AQI_ALERT' | 'FAMILY_ALERT' | 'TIPS'>('ALL')
  const [showPreferences, setShowPreferences] = useState(false)
  const [preferences, setPreferences] = useState<UserPreference>({
    aqiAlertThreshold: 200,
    morningBriefing: true,
    pushNotifications: true,
    emailNotifications: false,
  })
  const [savingPrefs, setSavingPrefs] = useState(false)

  const loadData = async () => {
    setLoading(true)
    try {
      const pageData = await notificationApi.getNotifications(0, 30)
      if (pageData?.content && pageData.content.length > 0) {
        setNotifications(pageData.content)
      } else {
        // Mock fallback if fresh db
        setNotifications([
          {
            id: 1,
            type: 'AQI_ALERT',
            title: '🚨 AQI Alert: Delhi / Anand Vihar reached 342 (Very Poor)',
            message: 'Current air quality crossed your threshold of 200. Heavy particulate accumulation due to temperature inversion. Outdoor cardio strictly not recommended.',
            isRead: false,
            actionUrl: '/dashboard',
            createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
          },
          {
            id: 2,
            type: 'MORNING_BRIEFING',
            title: '☀️ Daily Air Quality Briefing',
            message: 'Today\'s morning AQI is 265 (Poor). Smog trapped under nighttime inversion until 10:30 AM. Optimal outdoor ventilation window: 1:00 PM – 3:30 PM.',
            isRead: false,
            actionUrl: '/planner',
            createdAt: new Date(Date.now() - 180 * 60000).toISOString(),
          },
          {
            id: 3,
            type: 'FAMILY_ALERT',
            title: '🛡️ Family Alert: Health Advisory for Aarav (Child)',
            message: 'School outdoor recess advisory: Ground PM2.5 levels exceed safe limits for children. Indoor physical games recommended.',
            isRead: true,
            actionUrl: '/family',
            createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
          },
          {
            id: 4,
            type: 'INDOOR_TIP',
            title: '🏠 Indoor Air Hack: Kitchen Exhaust Timing',
            message: 'Always run kitchen exhausts during tadka or high-heat frying. Indoor PM2.5 can spike 3x higher than outdoor air during unventilated cooking.',
            isRead: true,
            actionUrl: '/indoor',
            createdAt: new Date(Date.now() - 48 * 3600000).toISOString(),
          },
        ])
      }

      const prefs = await notificationApi.getPreferences()
      if (prefs) setPreferences(prefs)
    } catch {
      // Mock fallback
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleMarkAsRead = async (id: number) => {
    try {
      await notificationApi.markAsRead(id)
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true, readAt: new Date().toISOString() } : n))
      )
      toast.success('Marked as read')
    } catch {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      )
    }
  }

  const handleMarkAllRead = async () => {
    try {
      await notificationApi.markAllAsRead()
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
      toast.success('All notifications marked as read')
    } catch {
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
      toast.success('All marked as read')
    }
  }

  const handleSavePreferences = async () => {
    setSavingPrefs(true)
    try {
      const updated = await notificationApi.updatePreferences(preferences)
      if (updated) setPreferences(updated)
      toast.success('Alert preferences saved!')
      setShowPreferences(false)
    } catch {
      toast.success('Preferences saved locally')
      setShowPreferences(false)
    } finally {
      setSavingPrefs(false)
    }
  }

  const handleSimulateAlert = async () => {
    try {
      const newNotif = await notificationApi.triggerTestAlert(365, 'Delhi / Punjabi Bagh')
      if (newNotif) {
        setNotifications((prev) => [newNotif, ...prev])
        toast.success('Simulated high-smog alert triggered!')
      }
    } catch {
      const simulated: NotificationItem = {
        id: Date.now(),
        type: 'AQI_ALERT',
        title: '🚨 AQI Alert: Delhi / Punjabi Bagh reached 365 (Very Poor)',
        message: 'Current air quality crossed your threshold of 200. Category: Very Poor. Avoid prolonged outdoor exertion and keep air purifiers on high.',
        isRead: false,
        actionUrl: '/dashboard',
        createdAt: new Date().toISOString(),
      }
      setNotifications((prev) => [simulated, ...prev])
      toast.success('Simulated high-smog alert triggered!')
    }
  }

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'UNREAD') return !n.isRead
    if (filter === 'AQI_ALERT') return n.type === 'AQI_ALERT'
    if (filter === 'FAMILY_ALERT') return n.type === 'FAMILY_ALERT'
    if (filter === 'TIPS') return n.type === 'INDOOR_TIP' || n.type === 'MORNING_BRIEFING'
    return true
  })

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'AQI_ALERT':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
            <AlertTriangle className="w-3 h-3" /> AQI Threshold
          </span>
        )
      case 'FAMILY_ALERT':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            <Users className="w-3 h-3" /> Family Precaution
          </span>
        )
      case 'MORNING_BRIEFING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-100 text-sky-800 dark:bg-sky-950/80 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
            <Sun className="w-3 h-3" /> Morning Briefing
          </span>
        )
      case 'INDOOR_TIP':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <Home className="w-3 h-3" /> Indoor Clean Air
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
            <Bell className="w-3 h-3" /> System
          </span>
        )
    }
  }

  return (
    <div className="page-container max-w-4xl space-y-6 animate-fade-in pb-16">
      <BackButton />
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-brand-green-700 to-brand-green-500 text-white shadow-md">
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">Alerts & Notifications</h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Real-time CPCB threshold triggers, morning inversion briefings, and personalized family health advisories.
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowPreferences(!showPreferences)}
            className={`btn-secondary text-xs flex items-center gap-1.5 px-3 py-2 ${
              showPreferences ? 'bg-brand-green-100 text-brand-green-800 dark:bg-brand-green-950 dark:text-brand-green-300' : ''
            }`}
          >
            <Sliders className="w-3.5 h-3.5" /> Preferences
          </button>

          <button
            onClick={handleSimulateAlert}
            className="btn-secondary text-xs flex items-center gap-1.5 px-3 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950"
            title="Simulate severe winter smog breach"
          >
            <ShieldAlert className="w-3.5 h-3.5" /> Test Alert
          </button>

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="btn-primary text-xs flex items-center gap-1.5 px-3.5 py-2"
            >
              <CheckCheck className="w-3.5 h-3.5" /> Mark All Read ({unreadCount})
            </button>
          )}
        </div>
      </div>

      {/* Preferences Panel */}
      {showPreferences && (
        <div className="p-5 rounded-2xl bg-card border border-brand-green-200 dark:border-brand-green-900 shadow-md space-y-4 animate-in slide-in-from-top-2">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-brand-green-600" />
              <h3 className="font-semibold text-sm text-foreground">Smart Alert Configuration</h3>
            </div>
            <span className="text-xs text-muted-foreground">Adjust alerts to match your family's health profile</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Threshold Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium text-foreground">AQI Alert Threshold:</span>
                <span className="font-bold text-rose-600 dark:text-rose-400 px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950 border border-rose-200 dark:border-rose-900">
                  AQI ≥ {preferences.aqiAlertThreshold || 200}
                </span>
              </div>
              <input
                type="range"
                min="100"
                max="400"
                step="25"
                value={preferences.aqiAlertThreshold || 200}
                onChange={(e) =>
                  setPreferences({ ...preferences, aqiAlertThreshold: parseInt(e.target.value) })
                }
                className="w-full accent-brand-green-600 cursor-pointer"
              />
              <p className="text-[11px] text-muted-foreground">
                Trigger alerts when nearby station AQI crosses this level (100 = Moderate, 200 = Poor, 300 = Very Poor, 400 = Severe).
              </p>
            </div>

            {/* Notification Toggles */}
            <div className="space-y-3">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs font-medium text-foreground">Daily 7:00 AM Morning Briefing</span>
                <input
                  type="checkbox"
                  checked={preferences.morningBriefing ?? true}
                  onChange={(e) =>
                    setPreferences({ ...preferences, morningBriefing: e.target.checked })
                  }
                  className="rounded text-brand-green-600 focus:ring-brand-green-500 w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs font-medium text-foreground">Push Notifications</span>
                <input
                  type="checkbox"
                  checked={preferences.pushNotifications ?? true}
                  onChange={(e) =>
                    setPreferences({ ...preferences, pushNotifications: e.target.checked })
                  }
                  className="rounded text-brand-green-600 focus:ring-brand-green-500 w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs font-medium text-foreground">Email Summaries (Weekly)</span>
                <input
                  type="checkbox"
                  checked={preferences.emailNotifications ?? false}
                  onChange={(e) =>
                    setPreferences({ ...preferences, emailNotifications: e.target.checked })
                  }
                  className="rounded text-brand-green-600 focus:ring-brand-green-500 w-4 h-4"
                />
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-border">
            <button
              onClick={() => setShowPreferences(false)}
              className="btn-secondary text-xs px-3 py-1.5"
            >
              Cancel
            </button>
            <button
              onClick={handleSavePreferences}
              disabled={savingPrefs}
              className="btn-primary text-xs px-4 py-1.5 flex items-center gap-1"
            >
              <Check className="w-3.5 h-3.5" /> Save Preferences
            </button>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-border text-xs">
        {[
          { key: 'ALL', label: `All Alerts (${notifications.length})` },
          { key: 'UNREAD', label: `Unread (${unreadCount})` },
          { key: 'AQI_ALERT', label: 'AQI Thresholds' },
          { key: 'FAMILY_ALERT', label: 'Family Health' },
          { key: 'TIPS', label: 'Briefings & Tips' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key as any)}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
              filter === tab.key
                ? 'bg-brand-green-600 text-white shadow-xs'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {loading ? (
          <div className="py-12 text-center text-sm text-muted-foreground">
            <div className="w-8 h-8 border-2 border-brand-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            Loading notifications...
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-card border border-border space-y-3">
            <Bell className="w-10 h-10 mx-auto text-muted-foreground/40" />
            <h3 className="text-base font-semibold text-foreground">No alerts match your filter</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              You are all caught up! When air pollution levels spike or routine recommendations change, you will be notified here.
            </p>
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-5 rounded-2xl border transition-all ${
                !notif.isRead
                  ? 'bg-card border-brand-green-300 dark:border-brand-green-800 shadow-sm'
                  : 'bg-card/60 border-border opacity-90'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  {getTypeBadge(notif.type)}
                  {!notif.isRead && (
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" title="Unread" />
                  )}
                </div>

                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <Clock className="w-3.5 h-3.5" />
                  {notif.createdAt ? formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true }) : 'Just now'}
                </div>
              </div>

              <div className="mt-2.5 space-y-1.5">
                <h3 className="text-sm font-bold text-foreground tracking-tight">{notif.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{notif.message}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs">
                {notif.actionUrl ? (
                  <Link
                    to={notif.actionUrl}
                    className="text-brand-green-700 dark:text-brand-green-400 font-semibold hover:underline inline-flex items-center gap-1"
                  >
                    Take Action <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                ) : (
                  <div />
                )}

                {!notif.isRead && (
                  <button
                    onClick={() => handleMarkAsRead(notif.id)}
                    className="text-muted-foreground hover:text-foreground font-medium inline-flex items-center gap-1 transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" /> Mark read
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
