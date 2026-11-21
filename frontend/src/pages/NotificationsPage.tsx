import { Bell, AlertTriangle, ShieldCheck, Info } from 'lucide-react'

export default function NotificationsPage() {
  const notifications = [
    {
      id: 1,
      title: 'High PM2.5 Smog Advisory',
      desc: 'Pashan / Bavdhan station has entered the POOR category (AQI 285). Ensure family members avoid strenuous outdoor cardio.',
      time: '12 mins ago',
      type: 'ALERT',
    },
    {
      id: 2,
      title: 'Morning Routine Prepared',
      desc: 'Today’s recommended routine shifted your morning jog indoors to protect against ground-level inversion smog.',
      time: '2 hours ago',
      type: 'ROUTINE',
    },
    {
      id: 3,
      title: 'Clean Air Challenge Milestone',
      desc: 'You completed Day 3 of the Smoke-Free Home Week challenge! +15 health points awarded.',
      time: '1 day ago',
      type: 'CHALLENGE',
    },
  ]

  return (
    <div className="page-container max-w-3xl space-y-6 animate-fade-in">
      <div className="pb-2 border-b border-border">
        <h1 className="text-2xl font-bold tracking-tight">Alerts & Notifications</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Real-time threshold breaches, morning briefings, and family protection advisories.
        </p>
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            className="p-5 rounded-2xl bg-card border border-border shadow-sm flex items-start gap-4"
          >
            <div className="p-2 rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 mt-0.5">
              <Bell className="w-5 h-5" />
            </div>
            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-foreground">{n.title}</h3>
                <span className="text-[10px] text-muted-foreground">{n.time}</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{n.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
