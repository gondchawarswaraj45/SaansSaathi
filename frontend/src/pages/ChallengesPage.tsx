import { useState } from 'react'
import { Trophy, CheckCircle, Clock, Award, Star } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState([
    {
      id: 1,
      title: '7-Day Public Transport Challenge',
      desc: 'Use bus or metro for commute instead of personal 2-wheeler or car.',
      daysLeft: 4,
      points: 15,
      joined: true,
      progress: 60,
    },
    {
      id: 2,
      title: 'Smoke-Free Home Week',
      desc: 'Zero indoor incense, dhoop, or mosquito coils for 7 days.',
      daysLeft: 7,
      points: 10,
      joined: true,
      progress: 30,
    },
    {
      id: 3,
      title: 'No Vehicle Idling',
      desc: 'Turn off engine at red lights over 30 seconds to cut neighborhood smog.',
      daysLeft: 7,
      points: 10,
      joined: false,
      progress: 0,
    },
    {
      id: 4,
      title: 'Damp Mopping Master',
      desc: 'Replace dry broom sweeping with damp microfiber mopping for 7 days.',
      daysLeft: 7,
      points: 10,
      joined: false,
      progress: 0,
    },
  ])

  const toggleJoin = (id: number) => {
    setChallenges((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, joined: !c.joined, progress: !c.joined ? 10 : 0 } : c
      )
    )
    toast.success('Challenge updated!')
  }

  return (
    <div className="page-container space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Community Clean Air Challenges</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Adopt habits that cut personal exposure and lower urban air pollution footprint.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-3.5 py-1.5 rounded-xl text-amber-900 dark:text-amber-200 text-xs font-bold">
          <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
          <span>Family Points: 45 pts</span>
        </div>
      </div>

      {/* Challenges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {challenges.map((c) => (
          <div
            key={c.id}
            className="p-6 rounded-3xl bg-card border border-border shadow-sm flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-brand-green-700 bg-brand-green-50 dark:bg-brand-green-950 px-2 py-0.5 rounded">
                  +{c.points} Health Points
                </span>
                {c.joined && (
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded">
                    In Progress
                  </span>
                )}
              </div>
              <h3 className="text-base font-bold text-foreground">{c.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{c.desc}</p>
            </div>

            {c.joined && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Progress</span>
                  <span>{c.progress}%</span>
                </div>
                <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-brand-green-600 h-full rounded-full transition-all"
                    style={{ width: `${c.progress}%` }}
                  />
                </div>
              </div>
            )}

            <button
              onClick={() => toggleJoin(c.id)}
              className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all ${
                c.joined
                  ? 'border border-border hover:bg-muted text-foreground'
                  : 'bg-brand-green-600 text-white hover:bg-brand-green-700'
              }`}
            >
              {c.joined ? 'Leave Challenge' : 'Join Challenge'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
