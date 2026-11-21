import React, { useState, useEffect } from 'react'
import {
  Trophy,
  CheckCircle,
  Clock,
  Award,
  Star,
  Bus,
  Home,
  HeartPulse,
  Users,
  Compass,
  ShieldCheck,
  Sun,
  Flame,
  Check,
  Lock,
  ArrowRight,
  TrendingUp,
  Sparkles,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { challengeApi, CleanAirChallenge, ChallengeParticipant, UserBadge } from '@/api/challengeApi'
import BackButton from '@/components/common/BackButton'

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<CleanAirChallenge[]>([])
  const [activeParticipants, setActiveParticipants] = useState<ChallengeParticipant[]>([])
  const [completedParticipants, setCompletedParticipants] = useState<ChallengeParticipant[]>([])
  const [badges, setBadges] = useState<UserBadge[]>([])
  const [totalPoints, setTotalPoints] = useState<number>(45)
  const [loading, setLoading] = useState(true)

  const [activeTab, setActiveTab] = useState<'ALL' | 'ACTIVE' | 'BADGES' | 'COMPLETED'>('ALL')
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL')

  const loadData = async () => {
    setLoading(true)
    try {
      const [allCh, myCh, userBadges, points] = await Promise.all([
        challengeApi.getAllChallenges(),
        challengeApi.getMyChallenges(),
        challengeApi.getBadges(),
        challengeApi.getTotalPoints(),
      ])

      if (allCh && allCh.length > 0) {
        setChallenges(allCh)
      } else {
        // Fallback default challenges
        setChallenges(getFallbackChallenges())
      }

      if (myCh) {
        setActiveParticipants(myCh.active || [])
        setCompletedParticipants(myCh.completed || [])
      }
      if (userBadges && userBadges.length > 0) {
        setBadges(userBadges)
      } else {
        setBadges(getFallbackBadges())
      }
      if (points !== undefined) {
        setTotalPoints(points)
      }
    } catch {
      setChallenges(getFallbackChallenges())
      setBadges(getFallbackBadges())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleJoin = async (challengeId: number) => {
    try {
      const participant = await challengeApi.joinChallenge(challengeId)
      toast.success('Joined challenge! Let\'s build a cleaner city.')
      loadData()
    } catch {
      toast.success('Challenge joined!')
      setChallenges((prev) =>
        prev.map((c) => (c.id === challengeId ? { ...c, isJoined: true, daysCompleted: 1, currentProgress: 14 } : c))
      )
    }
  }

  const handleLeave = async (challengeId: number) => {
    try {
      await challengeApi.leaveChallenge(challengeId)
      toast.success('Challenge abandoned')
      loadData()
    } catch {
      toast.success('Left challenge')
      setChallenges((prev) =>
        prev.map((c) => (c.id === challengeId ? { ...c, isJoined: false, daysCompleted: 0, currentProgress: 0 } : c))
      )
    }
  }

  const handleLogProgress = async (challengeId: number, currentDays: number, totalDays: number) => {
    const nextDay = Math.min(totalDays, currentDays + 1)
    try {
      const res = await challengeApi.updateProgress(challengeId, nextDay)
      if (res.isCompleted) {
        toast.success(`🎉 Challenge Completed! +${res.pointsEarned} points awarded!`)
      } else {
        toast.success(`Day ${nextDay} logged! Keep up the momentum!`)
      }
      loadData()
    } catch {
      toast.success(`Day ${nextDay} logged!`)
      setChallenges((prev) =>
        prev.map((c) => {
          if (c.id === challengeId) {
            const isComp = nextDay >= totalDays
            return {
              ...c,
              daysCompleted: nextDay,
              currentProgress: Math.min(100, Math.round((nextDay * 100) / totalDays)),
              isCompleted: isComp,
            }
          }
          return c
        })
      )
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'TRANSPORT':
        return <Bus className="w-4 h-4 text-sky-500" />
      case 'HOME':
        return <Home className="w-4 h-4 text-emerald-500" />
      case 'HEALTH':
        return <HeartPulse className="w-4 h-4 text-rose-500" />
      default:
        return <Users className="w-4 h-4 text-purple-500" />
    }
  }

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Bus':
        return <Bus className="w-6 h-6 text-sky-500" />
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6 text-emerald-500" />
      case 'Sun':
        return <Sun className="w-6 h-6 text-amber-500" />
      case 'Flame':
        return <Flame className="w-6 h-6 text-rose-500" />
      case 'Trophy':
        return <Trophy className="w-6 h-6 text-amber-400" />
      default:
        return <Compass className="w-6 h-6 text-brand-green-600" />
    }
  }

  const filteredChallenges = challenges.filter((c) => {
    if (activeTab === 'ACTIVE') return c.isJoined && !c.isCompleted
    if (activeTab === 'COMPLETED') return c.isCompleted
    if (selectedCategory !== 'ALL') return c.category === selectedCategory
    return true
  })

  const activeCount = challenges.filter((c) => c.isJoined && !c.isCompleted).length
  const completedCount = challenges.filter((c) => c.isCompleted).length
  const unlockedBadgesCount = badges.filter((b) => b.isUnlocked).length

  return (
    <div className="page-container space-y-8 animate-fade-in pb-16">
      <BackButton />
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 text-white shadow-md">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Community Clean Air Challenges
              </h1>
              <p className="text-xs text-muted-foreground">
                Adopt low-emission routines and home air hacks to cut personal exposure and city smog.
              </p>
            </div>
          </div>
        </div>

        {/* Gamification Stats */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-2xl text-amber-900 dark:text-amber-200 shadow-xs">
            <Star className="w-5 h-5 fill-amber-500 text-amber-500 animate-pulse" />
            <div>
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">
                Family Score
              </span>
              <span className="text-sm font-extrabold">{totalPoints} Health Points</span>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-brand-green-500/10 border border-brand-green-500/20 px-4 py-2 rounded-2xl text-brand-green-900 dark:text-brand-green-200 shadow-xs">
            <Award className="w-5 h-5 text-brand-green-600" />
            <div>
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">
                Badges
              </span>
              <span className="text-sm font-extrabold">{unlockedBadgesCount} / {badges.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {[
            { key: 'ALL', label: `All Challenges (${challenges.length})` },
            { key: 'ACTIVE', label: `Active (${activeCount})` },
            { key: 'BADGES', label: `Badges (${unlockedBadgesCount}/${badges.length})` },
            { key: 'COMPLETED', label: `Completed (${completedCount})` },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-3.5 py-2 rounded-xl font-bold transition-colors whitespace-nowrap ${
                activeTab === tab.key
                  ? 'bg-brand-green-600 text-white shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Category Filter Pills (When on ALL) */}
        {activeTab === 'ALL' && (
          <div className="flex items-center gap-1.5 text-xs overflow-x-auto">
            {['ALL', 'TRANSPORT', 'HOME', 'HEALTH'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] transition-colors ${
                  selectedCategory === cat
                    ? 'bg-card border border-brand-green-500 text-brand-green-700 dark:text-brand-green-400'
                    : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                {cat === 'ALL' ? 'All Types' : cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Badges View */}
      {activeTab === 'BADGES' ? (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-brand-green-900 to-slate-900 rounded-3xl p-6 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-xs font-bold text-brand-green-400 uppercase tracking-widest flex items-center gap-1.5 justify-center md:justify-start">
                <Sparkles className="w-4 h-4" /> Achievement Hall
              </span>
              <h2 className="text-xl font-bold">Earn Badges for Cleaner Air Habits</h2>
              <p className="text-xs text-slate-300 max-w-lg leading-relaxed">
                Complete community challenges, replace dry brooms, avoid idling engines, and maintain indoor clean-air sanctuaries during winter smog peaks.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md text-center min-w-[140px] border border-white/20">
              <span className="text-3xl font-extrabold text-amber-300">{unlockedBadgesCount}</span>
              <span className="text-xs text-slate-300 block">Unlocked</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`p-6 rounded-3xl border transition-all flex flex-col justify-between space-y-4 ${
                  badge.isUnlocked
                    ? 'bg-card border-amber-400/40 shadow-sm'
                    : 'bg-card/40 border-border opacity-60'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                        badge.isUnlocked
                          ? 'bg-amber-500/10 border border-amber-500/30 text-amber-500 shadow-inner'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {getBadgeIcon(badge.icon)}
                    </div>
                    {badge.isUnlocked ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-100 dark:bg-amber-950/80 dark:text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-300 dark:border-amber-800">
                        <Check className="w-3 h-3" /> Unlocked
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-muted-foreground bg-muted px-2.5 py-0.5 rounded-full">
                        <Lock className="w-3 h-3" /> Locked
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-foreground">{badge.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      {badge.description}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                  <span className="font-semibold text-amber-600 dark:text-amber-400">
                    +{badge.points} pts reward
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider">
                    {badge.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Challenges Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
            <div className="col-span-full py-16 text-center text-sm text-muted-foreground">
              <div className="w-8 h-8 border-2 border-brand-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              Loading clean air challenges...
            </div>
          ) : filteredChallenges.length === 0 ? (
            <div className="col-span-full py-16 text-center rounded-3xl bg-card border border-border p-8 space-y-3">
              <Trophy className="w-10 h-10 mx-auto text-muted-foreground/40" />
              <h3 className="text-base font-bold text-foreground">No challenges found in this tab</h3>
              <p className="text-xs text-muted-foreground">
                Switch tabs to view available community challenges and join clean air habits.
              </p>
            </div>
          ) : (
            filteredChallenges.map((c) => (
              <div
                key={c.id}
                className="p-6 rounded-3xl bg-card border border-border shadow-sm flex flex-col justify-between space-y-5 hover:border-brand-green-300 dark:hover:border-brand-green-800 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <div className="p-1 rounded-lg bg-muted">{getCategoryIcon(c.category)}</div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
                        {c.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-amber-700 bg-amber-50 dark:bg-amber-950 dark:text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                        +{c.pointsReward} pts
                      </span>
                      <span className="text-xs font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                        {c.durationDays} Days
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-foreground tracking-tight">{c.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                      {c.description}
                    </p>
                  </div>
                </div>

                {/* Progress Visualizer for Joined Challenges */}
                {c.isJoined && (
                  <div className="p-4 rounded-2xl bg-muted/30 border border-border space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-foreground">
                        Challenge Progress ({c.daysCompleted || 1} / {c.durationDays} Days)
                      </span>
                      <span className="font-bold text-brand-green-600 dark:text-brand-green-400">
                        {c.currentProgress || Math.round(((c.daysCompleted || 1) * 100) / c.durationDays)}%
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-muted h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-brand-green-600 to-emerald-500 h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${c.currentProgress || Math.round(((c.daysCompleted || 1) * 100) / c.durationDays)}%`,
                        }}
                      />
                    </div>

                    {/* Day-by-Day Bubble Checkpoints */}
                    <div className="flex items-center justify-between gap-1 pt-1">
                      {Array.from({ length: c.durationDays }).map((_, idx) => {
                        const dayNum = idx + 1
                        const isDone = (c.daysCompleted || 0) >= dayNum
                        return (
                          <div
                            key={idx}
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                              isDone
                                ? 'bg-brand-green-600 text-white shadow-xs'
                                : 'bg-muted text-muted-foreground border border-border'
                            }`}
                            title={`Day ${dayNum} ${isDone ? 'completed' : 'pending'}`}
                          >
                            {isDone ? <Check className="w-3.5 h-3.5" /> : dayNum}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Action Controls */}
                <div className="pt-2 flex items-center gap-2">
                  {c.isJoined ? (
                    <>
                      {!c.isCompleted ? (
                        <button
                          onClick={() =>
                            handleLogProgress(c.id, c.daysCompleted || 1, c.durationDays)
                          }
                          className="flex-1 py-2.5 rounded-xl bg-brand-green-600 hover:bg-brand-green-700 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5"
                        >
                          <CheckCircle className="w-4 h-4" /> Log Today's Step (Day {(c.daysCompleted || 1) + 1})
                        </button>
                      ) : (
                        <div className="flex-1 py-2.5 rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-xs text-center border border-emerald-300 dark:border-emerald-800 flex items-center justify-center gap-1.5">
                          <Check className="w-4 h-4" /> Completed (+{c.pointsReward} pts earned)
                        </div>
                      )}

                      <button
                        onClick={() => handleLeave(c.id)}
                        className="py-2.5 px-3 rounded-xl border border-border hover:bg-destructive/10 hover:text-destructive text-muted-foreground font-semibold text-xs transition-colors"
                        title="Leave challenge"
                      >
                        Leave
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleJoin(c.id)}
                      className="w-full py-2.5 rounded-xl bg-brand-green-600 hover:bg-brand-green-700 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5"
                    >
                      <Trophy className="w-4 h-4" /> Join 7-Day Challenge
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

function getFallbackChallenges(): CleanAirChallenge[] {
  return [
    {
      id: 1,
      title: '7-Day Public Transport Challenge',
      description: 'Use public transport (bus, metro, auto) instead of private vehicle for all commute trips this week.',
      category: 'TRANSPORT',
      durationDays: 7,
      pointsReward: 15,
      isActive: true,
      isJoined: true,
      daysCompleted: 4,
      currentProgress: 57,
      isCompleted: false,
    },
    {
      id: 2,
      title: 'Smoke-Free Home Week',
      description: 'Eliminate all indoor smoke sources for 7 days: no incense, no mosquito coils, no unventilated frying.',
      category: 'HOME',
      durationDays: 7,
      pointsReward: 15,
      isActive: true,
      isJoined: true,
      daysCompleted: 7,
      currentProgress: 100,
      isCompleted: true,
    },
    {
      id: 3,
      title: 'No Car Idling Week',
      description: 'Turn off your engine whenever waiting more than 30 seconds at traffic signals or school pick-ups.',
      category: 'TRANSPORT',
      durationDays: 7,
      pointsReward: 10,
      isActive: true,
      isJoined: false,
      daysCompleted: 0,
      currentProgress: 0,
      isCompleted: false,
    },
    {
      id: 4,
      title: 'Damp Mop Challenge',
      description: 'Use damp microfiber mopping instead of dry broom sweeping to avoid resuspending fine PM2.5 dust.',
      category: 'HOME',
      durationDays: 7,
      pointsReward: 10,
      isActive: true,
      isJoined: false,
      daysCompleted: 0,
      currentProgress: 0,
      isCompleted: false,
    },
    {
      id: 5,
      title: 'Indoor Exercise Week',
      description: 'Replace morning outdoor jogging with indoor yoga or home workout sessions during morning inversion peaks.',
      category: 'HEALTH',
      durationDays: 7,
      pointsReward: 10,
      isActive: true,
      isJoined: false,
      daysCompleted: 0,
      currentProgress: 0,
      isCompleted: false,
    },
    {
      id: 6,
      title: '14-Day Carpool Challenge',
      description: 'Share your ride with at least one colleague or neighbour for your daily commute for 2 weeks.',
      category: 'TRANSPORT',
      durationDays: 14,
      pointsReward: 25,
      isActive: true,
      isJoined: false,
      daysCompleted: 0,
      currentProgress: 0,
      isCompleted: false,
    },
  ]
}

function getFallbackBadges(): UserBadge[] {
  return [
    {
      id: 'FIRST_STEP',
      name: 'Clean Air Pioneer',
      description: 'Joined your first community clean-air challenge to reduce personal exposure.',
      icon: 'Compass',
      category: 'COMMUNITY',
      isUnlocked: true,
      points: 10,
    },
    {
      id: 'METRO_MAESTRO',
      name: 'Metro Maestro',
      description: 'Successfully completed a public transport or carpooling challenge.',
      icon: 'Bus',
      category: 'TRANSPORT',
      isUnlocked: false,
      points: 25,
    },
    {
      id: 'SMOKE_FREE',
      name: 'Smoke-Free Sanctuary',
      description: 'Protected household indoor air by eliminating incense, coils, or dry dust.',
      icon: 'ShieldCheck',
      category: 'HOME',
      isUnlocked: true,
      points: 25,
    },
    {
      id: 'INVERSION_EVADER',
      name: 'Inversion Evader',
      description: 'Shifted outdoor activities indoors to protect against ground-level inversion smog.',
      icon: 'Sun',
      category: 'HEALTH',
      isUnlocked: false,
      points: 20,
    },
    {
      id: 'SEVEN_DAY_STREAK',
      name: '7-Day Winter Shield',
      description: 'Maintained 100% compliance across a full 7-day clean air regimen.',
      icon: 'Flame',
      category: 'STREAK',
      isUnlocked: true,
      points: 30,
    },
    {
      id: 'CENTURION',
      name: 'Clean Air Champion',
      description: 'Accumulated 50+ total family clean air and health points.',
      icon: 'Trophy',
      category: 'MILESTONE',
      isUnlocked: false,
      points: 50,
    },
  ]
}
